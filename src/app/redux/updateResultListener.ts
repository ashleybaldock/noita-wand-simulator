import type { Action } from '@reduxjs/toolkit';
import { isValidActionId } from '../calc/actionId';
import { clickWand } from '../calc/eval/clickWand';
import { getSpellById } from '../calc/spells';
import { isNotNullOrUndefined, compareSequencesIter } from '../util';
import type { SpellId } from './Wand/spellId';
import { wandsMatchForSimulation } from './Wand/wand';
import type { AppStartListening } from './listenerMiddleware';
import { newResult, newSimulation } from './resultSlice';
import type { RootState } from './store';

type ListenerPredicate<T> = (
  action: Action,
  currentState: T,
  previousState: T,
) => boolean;

/**
 * @returns true if main spell sequence has changed
 */
const spellSequenceHasChanged: ListenerPredicate<RootState> = (
  _unused,
  currentState,
) => {
  const prev = currentState.result.lastSpellIds.values(),
    cur = currentState.wand.present.spellIds.values(),
    changed = !compareSequencesIter<SpellId>(
      { filterPredicate: isNotNullOrUndefined },
      prev,
      cur,
    );
  console.debug(
    `alwaysCastSeqChanged? '${changed}', present: '${cur}', previous: '${prev} `,
  );
  return changed;
};

/**
 * @returns true if sequence of always cast spells has changed
 */
const alwaysCastSequenceHasChanged: ListenerPredicate<RootState> = (
  _unused,
  currentState,
) => {
  const prev = currentState.result.lastAlwaysIds.values(),
    cur = currentState.wand.present.alwaysIds.values(),
    changed = !compareSequencesIter<SpellId>(
      { filterPredicate: isNotNullOrUndefined },
      prev,
      cur,
    );
  console.debug(
    `alwaysCastSeqChanged? '${changed}', present: '${cur}', previous: '${prev} `,
  );
  return changed;
};

/**
 * @returns true if any wand stats (that affect simulation
 *               results) have changed
 */
const wandStatsHaveChanged: ListenerPredicate<RootState> = (
  _unused,
  currentState,
) => {
  const prev = currentState.result.lastWand,
    cur = currentState.wand.present.wand,
    changed = !wandsMatchForSimulation(cur, prev);
  console.debug(
    `wandStatsChanged? ${changed}, present: '${cur}', previous: '${prev} `,
  );
  return changed;
};

/**
 * @returns true if zetaId has changed
 */
const zetaIdHasChanged: ListenerPredicate<RootState> = (
  _unused,
  currentState,
) => {
  const prev = currentState.wand.present.zetaId,
    cur = currentState.result.lastZetaId,
    changed = prev !== cur;
  console.debug(
    `zetaIdChanged? ${changed}, present: '${cur}', previous: '${prev}'`,
  );
  return changed;
};

/**
 * @returns true if no simulation has yet been performed since start
 */
const simulationHasNeverRun: ListenerPredicate<RootState> = (
  _unused,
  currentState,
) => {
  const hasNeverRun = currentState.result.simulationsSinceStart === 0;
  console.debug(
    `simHasNeverRun? '${hasNeverRun}', runsSinceStart: ${currentState.result.simulationsSinceStart}`,
  );
  return hasNeverRun;
};

// TODO also depends on config
// TODO memoise previous sim results to avoid re-running
/**
 * Checks if simulation needs to be re-run
 *
 * Composed of several match predicates, if any of those
 * returns false the simulation needs to be refreshed
 *
 * @returns true if changes require a new simulation run
 * @returns false if previous simulation result is still valid
 */
const simulationNeedsUpdate: ListenerPredicate<RootState> = (
  action,
  currentState,
  previousState,
) =>
  [
    spellSequenceHasChanged,
    alwaysCastSequenceHasChanged,
    wandStatsHaveChanged,
    zetaIdHasChanged,
    simulationHasNeverRun,
  ].some((predicate) => predicate(action, currentState, previousState));

const simulationEnabled: ListenerPredicate<RootState> = (
  _action,
  currentState,
) => !currentState.config.config.pauseCalculations;

/**
 * Update Simulation result when wand has been changed
 */
export const startUpdateListener = (startAppListening: AppStartListening) =>
  startAppListening({
    predicate: (...args) =>
      simulationEnabled(...args) && simulationNeedsUpdate(...args),
    effect: async (_action, listenerApi) => {
      const {
        endSimulationOnShotCount,
        endSimulationOnReloadCount,
        endSimulationOnRefreshCount,
        limitSimulationIterations,
        limitSimulationDuration,
        'random.worldSeed': rng_worldSeed,
        'random.frameNumber': rng_frameNumber,
        'requirements.enemies': req_enemies,
        'requirements.projectiles': req_projectiles,
        'requirements.hp': req_hp,
        'requirements.half': req_half,
      } = listenerApi.getState().config.config;

      const spellIds = [...listenerApi.getState().wand.present.spellIds];
      const alwaysIds = [...listenerApi.getState().wand.present.alwaysIds];
      const zetaId = listenerApi.getState().wand.present.zetaId;
      const wand = listenerApi.getState().wand.present.wand;

      console.debug('dispatch: newSimulation');
      listenerApi.dispatch(
        newSimulation({
          wandState: {
            spellIds,
            alwaysIds,
            zetaId,
            wand,
          },
        }),
      );

      const spells = spellIds.flatMap((id) =>
        isNotNullOrUndefined(id) && isValidActionId(id) ? getSpellById(id) : [],
      );
      const alwaysCastSpells = alwaysIds.flatMap((id) =>
        isNotNullOrUndefined(id) && isValidActionId(id) ? getSpellById(id) : [],
      );
      const zetaSpell =
        isNotNullOrUndefined(zetaId) && isValidActionId(zetaId)
          ? getSpellById(zetaId)
          : undefined;

      /* TODO spellsWithUses */
      const task = listenerApi.fork(async (/*forkApi*/) =>
        clickWand({
          wand,
          spells,
          alwaysCastSpells,
          zetaSpell,
          req_enemies,
          req_projectiles,
          req_hp,
          req_half,
          rng_frameNumber,
          rng_worldSeed,
          wand_available_mana: wand.mana_max,
          wand_cast_delay: wand.cast_delay,
          endSimulationOnShotCount,
          endSimulationOnReloadCount,
          endSimulationOnRefreshCount,
          limitSimulationIterations,
          limitSimulationDuration,
        }));

      const result = await task.result;
      const { status } = result;

      if (status === 'ok') {
        const { value } = result;
        // console.debug('Child succeeded: ', value);

        console.debug('dispatch: newResult');
        listenerApi.dispatch(
          newResult({
            result: value,
          }),
        );
      } else {
        const { error } = result;
        console.warn('Child failed: ', status, error);
      }
    },
  });
