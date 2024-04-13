// TODO also depends on config

import type { Action } from '@reduxjs/toolkit';
import { isValidActionId } from '../calc/actionId';
import { clickWand } from '../calc/eval/clickWand';
import { getSpellById } from '../calc/spells';
import {
  sequencesMatchIgnoringHoles as sequencesDifferPredicate,
  isNotNullOrUndefined,
  compareSequencesIter,
} from '../util';
import type { SpellId } from './Wand/spellId';
import { wandsMatchForSimulation } from './Wand/wand';
import type { AppStartListening } from './listenerMiddleware';
import { newResult, newSimulation } from './resultSlice';
import type { RootState } from './store';

// export const compareSequences = (
//   {
//     filterPredicate = anythingPredicate,
//   }: SequenceComparisonOptions<unknown>,
//   sequences: IterableIterator<unknown>[]
// ) => {
//   // const filteredA = sequenceA.filter(filterPredicate);
//   // const filteredB = sequenceB.filter(filterPredicate);
//   sequences
//     .map((sequence) => filterIter(sequence, filterPredicate)
//     .every((f, _, filteredSequences) => f.length === filteredSequences[0].length);

const spellIdsSequenceChangedPredicate = (
  _unused: unknown,
  currentState: RootState,
  previousState: RootState,
): boolean =>
  compareSequencesIter<SpellId>(
    { filterPredicate: isNotNullOrUndefined },
    currentState.wand.present.spellIds.values(),
    previousState.result.lastSpellIds.values(),
  );
const alwaysIdsSequenceChangedPredicate = (
  _unused: unknown,
  currentState: RootState,
  previousState: RootState,
): boolean =>
  compareSequencesIter<SpellId>(
    { filterPredicate: isNotNullOrUndefined },
    currentState.wand.present.alwaysIds.values(),
    previousState.result.lastAlwaysIds.values(),
  );

const wandStatsChangedPredicate = (
  _unused: unknown,
  currentState: RootState,
  previousState: RootState,
): boolean =>
  wandsMatchForSimulation(
    currentState.wand.present.wand,
    previousState.result.lastWand,
  );

const zetaIdChangedPredicate = (
  _unused: unknown,
  currentState: RootState,
  previousState: RootState,
): boolean =>
  currentState.wand.present.zetaId === previousState.result.lastZetaId;

// TODO memoise previous sim results to avoid re-running
const simulationNeedsUpdatePredicate = (
  action: Action,
  currentState: RootState,
  previousState: RootState,
): boolean =>
  [
    spellIdsSequenceChangedPredicate,
    alwaysIdsSequenceChangedPredicate,
    wandStatsChangedPredicate,
    zetaIdChangedPredicate,
  ].every((predicate) => predicate(action, currentState, previousState));

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
function zipIter(arg0: any[]) {
  throw new Error('Function not implemented.');
}
