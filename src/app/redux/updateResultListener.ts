import type { Action } from '@reduxjs/toolkit';
import { clickWand } from '../calc/eval/clickWand';
import { isNotNullOrUndefined, compareSequencesIter } from '../util';
import type { SpellId } from './Wand/spellId';
import { wandsMatchForSimulation } from './Wand/wand';
import type { AppStartListening } from './listenerMiddleware';
import { newResult, newSimulation } from './resultSlice';
import type { RootState } from './store';
import { nextSimulationRequestId } from './SimulationRequestId';

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
  {
    wand: {
      present: { spellIds: currentSpellIds },
    },
  },
  {
    wand: {
      present: { spellIds: previousSpellIds },
    },
  },
) => {
  const changed = !compareSequencesIter<SpellId>(
    { filterPredicate: isNotNullOrUndefined },
    previousSpellIds.values(),
    currentSpellIds.values(),
  );
  if (changed) {
    console.debug(
      `spellSequenceHasChanged, from: '[${previousSpellIds.join(', ')}]' to: ['${currentSpellIds.join(', ')}']`,
    );
  }
  return changed;
};

/**
 * @returns true if sequence of always cast spells has changed
 */
const alwaysCastSequenceHasChanged: ListenerPredicate<RootState> = (
  _unused,
  {
    wand: {
      present: { alwaysIds: currentAlwaysIds },
    },
  },
  {
    wand: {
      present: { alwaysIds: previousAlwaysIds },
    },
  },
) => {
  const changed = !compareSequencesIter<SpellId>(
    { filterPredicate: isNotNullOrUndefined },
    previousAlwaysIds.values(),
    currentAlwaysIds.values(),
  );
  if (changed) {
    console.debug(
      `alwaysCastSequenceHasChanged, from: '[${previousAlwaysIds.join(', ')}]' to: ['${currentAlwaysIds.join(', ')}']`,
    );
  }
  return changed;
};

/**
 * @returns true if any wand stats (that affect simulation
 *               results) have changed
 */
const wandStatsHaveChanged: ListenerPredicate<RootState> = (
  _unused,
  {
    wand: {
      present: { wand: currentWandStats },
    },
  },
  {
    wand: {
      present: { wand: previousWandStats },
    },
  },
) => {
  const changed = !wandsMatchForSimulation(currentWandStats, previousWandStats);
  if (changed) {
    console.debug(
      `wandStatsHaveChanged, from: '${previousWandStats}' to: '${currentWandStats}'`,
    );
  }
  return changed;
};

/**
 * @returns true if zetaId has changed
 */
const zetaIdHasChanged: ListenerPredicate<RootState> = (
  _unused,
  {
    wand: {
      present: { zetaId: currentZetaId },
    },
  },
  {
    wand: {
      present: { zetaId: previousZetaId },
    },
  },
) => {
  const changed = previousZetaId !== currentZetaId;

  if (changed) {
    console.debug(
      `zetaIdHasChanged, from: '${previousZetaId}' to: '${currentZetaId}'`,
    );
  }
  return changed;
};

/**
 * @returns true if simulation has not run since startup
 */
const hasNeverRun: ListenerPredicate<RootState> = (
  _unused,
  { result: { lastSimulationRequested } },
) => {
  const changed = lastSimulationRequested === null;
  if (changed) {
    console.debug(`hasNeverRun`);
  }
  return changed;
};

/**
 * @returns true if zetaId has changed
 */
const simulationConfigChanged: ListenerPredicate<RootState> = (
  _unused,
  { config: currentConfig },
  { config: previousConfig },
) => {
  const changed = false; // TODO

  if (changed) {
    console.debug(
      `simulationConfigChanged, from: '${previousConfig}' to: '${currentConfig}'`,
    );
  }
  return changed;
};

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
    simulationConfigChanged,
    hasNeverRun,
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
        endSimulationOnCastCount,
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
      const alwaysCastSpellIds = [
        ...listenerApi.getState().wand.present.alwaysIds,
      ];
      const zetaSpellId = listenerApi.getState().wand.present.zetaId;
      const wand = { ...listenerApi.getState().wand.present.wand };

      const simulationRequestId = nextSimulationRequestId();

      console.group(`Simulation Request #${simulationRequestId}`);
      listenerApi.dispatch(
        newSimulation({
          simulationRequestId,
          wandState: {
            spellIds,
            alwaysIds: alwaysCastSpellIds,
            zetaId: zetaSpellId,
            wand,
          },
        }),
      );

      /* TODO spellsWithUses */
      const task = listenerApi.fork(async (/*forkApi*/) =>
        clickWand({
          simulationRequestId,
          wand,
          spellIds,
          alwaysCastSpellIds,
          zetaSpellId,
          req_enemies,
          req_projectiles,
          req_hp,
          req_half,
          rng_frameNumber,
          rng_worldSeed,
          wand_available_mana: wand.mana_max,
          wand_cast_delay: wand.cast_delay,
          endSimulationOnCastCount,
          endSimulationOnReloadCount,
          endSimulationOnRefreshCount,
          limitSimulationIterations,
          limitSimulationDuration,
        }),);

      console.group();
      const result = await task.result;
      console.groupEnd();
      const { status } = result;

      if (status === 'ok') {
        const { value } = result;
        console.debug('Simulation done, result: ', value);

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
      console.groupEnd();
    },
  });
