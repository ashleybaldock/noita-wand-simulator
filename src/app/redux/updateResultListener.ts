// TODO also depends on config

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

/**
 * @returns true if sequences are the same, false if they differ
 */
const spellSequencesMatchPredicate = (
  _unused: unknown,
  currentState: RootState,
  previousState: RootState,
): boolean => {
  const res = compareSequencesIter<SpellId>(
    { filterPredicate: isNotNullOrUndefined },
    currentState.wand.present.spellIds.values(),
    previousState.result.lastSpellIds.values(),
  );
  // console.log(
  //   'spellIdsSequenceChangedPredicate',
  //   currentState.wand.present.spellIds.values(),
  //   previousState.result.lastSpellIds.values(),
  //   res,
  // );
  return res;
};

/**
 * @returns true if sequences are the same, false if they differ
 */
const alwaysCastSequencesMatchPredicate = (
  _unused: unknown,
  currentState: RootState,
  previousState: RootState,
): boolean => {
  const res = compareSequencesIter<SpellId>(
    { filterPredicate: isNotNullOrUndefined },
    currentState.wand.present.alwaysIds.values(),
    previousState.result.lastAlwaysIds.values(),
  );
  // console.log(
  //   'alwaysIdsSequenceChangedPredicate',
  //   currentState.wand.present.alwaysIds.values(),
  //   previousState.result.lastAlwaysIds.values(),
  //   res,
  // );
  return res;
};

/**
 * @returns true if all wand stats that affect simulation results are the same, false if they differ
 */
const wandStatsMatchPredicate = (
  _unused: unknown,
  currentState: RootState,
  previousState: RootState,
): boolean => {
  const res = wandsMatchForSimulation(
    currentState.wand.present.wand,
    previousState.result.lastWand,
  );
  // console.log(
  //   'wandStatsChangedPredicate',
  //   currentState.wand.present.wand,
  //   previousState.result.lastWand,
  //   res,
  // );
  return res;
};

/**
 * @returns true if zetaId matches, false otherwise
 */
const zetaIdsMatchPredicate = (
  _unused: unknown,
  currentState: RootState,
  previousState: RootState,
): boolean => {
  // console.log(
  //   'zetaIdChangedPredicate',
  //   currentState.wand.present.zetaId,
  //   previousState.result.lastZetaId,
  // );
  return currentState.wand.present.zetaId === previousState.result.lastZetaId;
};

// TODO memoise previous sim results to avoid re-running
/**
 * Checks if simulation needs to be re-run
 *
 * Composed of several match predicates, if any of those
 * returns false the simulation needs to be refreshed
 *
 * @returns {true} if changes require a new simulation run
 * @returns {false} if previous simulation result is still valid
 */
const simulationNeedsUpdatePredicate = (
  action: Action,
  currentState: RootState,
  previousState: RootState,
): boolean =>
  [
    spellSequencesMatchPredicate,
    alwaysCastSequencesMatchPredicate,
    wandStatsMatchPredicate,
    zetaIdsMatchPredicate,
  ].some((predicate) => !predicate(action, currentState, previousState));

/**
 * Update Simulation result when wand has been changed
 */
export const startUpdateListener = (startAppListening: AppStartListening) =>
  startAppListening({
    predicate: simulationNeedsUpdatePredicate,
    effect: async (_action, listenerApi) => {
      const {
        endSimulationOnShotCount,
        endSimulationOnReloadCount,
        endSimulationOnRefreshCount,
        endSimulationOnRepeatCount,
        limitSimulationIterations,
        limitSimulationDuration,
        'random.worldSeed': rng_worldSeed,
        'random.frameNumber': rng_frameNumber,
        'requirements.enemies': req_enemies,
        'requirements.projectiles': req_projectiles,
        'requirements.hp': req_hp,
        'requirements.half': req_half,
      } = listenerApi.getState().config.config;

      const spellIds = listenerApi.getState().wand.present.spellIds;
      const alwaysIds = listenerApi.getState().wand.present.alwaysIds;
      const zetaId = listenerApi.getState().wand.present.zetaId;
      const wand = listenerApi.getState().wand.present.wand;

      console.log('running new simulation');
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
      const task = listenerApi.fork(async (forkApi) =>
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
          endSimulationOnRepeatCount,
          limitSimulationIterations,
          limitSimulationDuration,
        }),
      );

      const result = await task.result;
      const { status } = result;

      if (status === 'ok') {
        const { value } = result;
        console.log('Child succeeded: ', value);

        listenerApi.dispatch(
          newResult({
            result: value,
          }),
        );
      } else {
        const { error } = result;
        console.log('Child failed: ', status, error);
      }
    },
  });
