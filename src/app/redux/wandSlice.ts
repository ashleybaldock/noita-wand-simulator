import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from './store';
import type { SpellEditMode, SpellShiftDirection } from '../types';
import { defaultWand } from './Wand/presets';
import { useSliceWrapper } from './useSlice';
import { generateWandStateFromSearch } from './Wand/fromSearch';
import {
  MAX_ALWAYS,
  fixedLengthCopy,
  compareSequenceIgnoringGaps,
  isNotNullOrUndefined,
  assertNever,
} from '../util';
import type { WandState } from './Wand/wandState';
import { type Wand, compareWandsForSimulation } from './Wand/wand';
import type { SpellId } from './Wand/spellId';
import { startAppListening } from './listenerMiddleware';
import { clickWand } from '../calc/eval/clickWand';
import { isValidActionId } from '../calc/actionId';
import { getSpellById } from '../calc/spells';
import {
  alwaysCastIndexMap,
  isAlwaysCastIndex,
  isMainWandIndex,
  ZTA,
  type WandIndex,
} from './WandIndex';
const {
  wand,
  spellIds = [],
  alwaysIds = [],
  messages = [],
} = generateWandStateFromSearch(window.location.search);

// TODO these could be surfaced in the UI for debugging wand urls
// console.debug(messages);

const initialState: WandState = {
  wand: {
    ...defaultWand,
    ...wand,
  },
  spellIds: fixedLengthCopy(
    spellIds,
    wand.deck_capacity ?? defaultWand.deck_capacity,
  ),
  alwaysIds: fixedLengthCopy(alwaysIds, MAX_ALWAYS),
  messages: messages || [],
} as const;

const getSpellId = (state: WandState, wandIndex: WandIndex): SpellId | null => {
  if (isMainWandIndex(wandIndex)) {
    return state.spellIds[wandIndex] ?? null;
  }
  if (isAlwaysCastIndex(wandIndex)) {
    return state.alwaysIds[alwaysCastIndexMap[wandIndex]] ?? null;
  }
  if (typeof wandIndex === typeof ZTA) {
    return state.zetaId ?? null;
  }
  return assertNever();
};

const setSpellId = (
  state: WandState,
  wandIndex: WandIndex,
  spellId: SpellId | null,
): void => {
  if (isMainWandIndex(wandIndex)) {
    state.spellIds[wandIndex] = spellId;
    return;
  }
  if (isAlwaysCastIndex(wandIndex)) {
    state.alwaysIds[alwaysCastIndexMap[wandIndex]] = spellId;
    return;
  }
  if (typeof wandIndex === typeof ZTA) {
    state.zetaId = spellId;
    return;
  }
  assertNever();
};

const popSpellId = (state: WandState, wandIndex: WandIndex) => {
  const spellId = getSpellId(state, wandIndex);
  setSpellId(state, wandIndex, null);
  return spellId;
};

export const wandSlice = createSlice({
  name: 'wand',
  initialState,
  reducers: {
    resetWand: () => {
      return initialState;
    },
    setWand: (
      state,
      action: PayloadAction<{ wand: Wand; spells?: SpellId[] }>,
    ): void => {
      const { wand, spells } = action.payload;
      state.wand = wand;

      if (spells) {
        state.spellIds = spells;
      }

      state.spellIds = fixedLengthCopy(state.spellIds, wand.deck_capacity);
    },
    insertSpellBefore: (
      state,
      {
        payload: { spell, index },
      }: PayloadAction<{ index: number; spell: SpellId | null }>,
    ): void => {
      state.spellIds = fixedLengthCopy(
        [
          ...state.spellIds.slice(0, index),
          spell,
          ...state.spellIds.slice(index),
        ],
        state.wand.deck_capacity,
      );
    },
    insertSpellAfter: (
      state,
      {
        payload: { spell, index },
      }: PayloadAction<{ index: number; spell: SpellId | null }>,
    ): void => {
      state.spellIds = fixedLengthCopy(
        [
          ...state.spellIds.slice(0, index + 1),
          spell,
          ...state.spellIds.slice(index + 1),
        ],
        state.wand.deck_capacity,
      );
    },
    setSpellAtIndex: (
      state,
      {
        payload: { wandIndex, spellId },
      }: PayloadAction<{ wandIndex: WandIndex; spellId: SpellId | null }>,
    ): void => {
      setSpellId(state, wandIndex, spellId);
    },
    setSpells: (state, action: PayloadAction<SpellId[]>): void => {
      state.spellIds = action.payload;

      state.spellIds = fixedLengthCopy(
        state.spellIds,
        state.wand.deck_capacity,
      );
    },
    clearSpells: (state): void => {
      state.spellIds = fixedLengthCopy([], state.spellIds.length);
    },
    deleteSpellAtIndex: (
      state,
      {
        payload: { wandIndex, shift = 'none' },
      }: PayloadAction<{ wandIndex: WandIndex; shift: SpellShiftDirection }>,
    ): void => {
      if (isMainWandIndex(wandIndex)) {
        if (shift === 'left') {
          state.spellIds = fixedLengthCopy(
            [
              ...state.spellIds.slice(0, wandIndex),
              ...state.spellIds.slice(wandIndex + 1),
            ],
            state.wand.deck_capacity,
          );
        }
        if (shift === 'right') {
          state.spellIds = fixedLengthCopy(
            [
              null,
              ...state.spellIds.slice(0, wandIndex),
              ...state.spellIds.slice(wandIndex + 1),
            ],
            state.wand.deck_capacity,
          );
        }
      }
      if (shift === 'none') {
        setSpellId(state, wandIndex, null);
      }
    },
    moveSpell: (
      state,
      {
        payload: { fromIndex, toIndex, mode = 'swap' },
      }: PayloadAction<{
        fromIndex: WandIndex;
        toIndex: WandIndex;
        mode?: SpellEditMode;
      }>,
    ): void => {
      if (fromIndex === toIndex) {
        // TODO change if needed when implementing charge usage
        return;
      }
      if (
        (isMainWandIndex(fromIndex) &&
          (fromIndex >= state.wand.deck_capacity || fromIndex < 0)) ||
        (isMainWandIndex(toIndex) &&
          (toIndex >= state.wand.deck_capacity || toIndex < 0))
      ) {
        return;
      }
      if (
        mode === 'swap' &&
        isNotNullOrUndefined(fromIndex) &&
        isNotNullOrUndefined(toIndex)
      ) {
        const temp = getSpellId(state, fromIndex);
        setSpellId(state, fromIndex, getSpellId(state, toIndex));
        setSpellId(state, toIndex, temp);
      }
      if (mode === 'overwrite') {
        setSpellId(state, toIndex, popSpellId(state, fromIndex));
      }
      /* Target wandIndex shifted right to make room for insertion*/
      if (isMainWandIndex(toIndex)) {
        if (isMainWandIndex(fromIndex)) {
          /* Moving spell within wand, so will always fit */
          if (mode === 'before') {
            if (fromIndex < toIndex) {
              state.spellIds = fixedLengthCopy(
                [
                  ...state.spellIds.slice(0, fromIndex),
                  ...state.spellIds.slice(fromIndex + 1, toIndex),
                  state.spellIds[fromIndex],
                  ...state.spellIds.slice(toIndex),
                ],
                state.wand.deck_capacity,
              );
            } else {
              state.spellIds = fixedLengthCopy(
                [
                  ...state.spellIds.slice(0, toIndex),
                  state.spellIds[fromIndex],
                  ...state.spellIds.slice(toIndex, fromIndex),
                  ...state.spellIds.slice(fromIndex + 1),
                ],
                state.wand.deck_capacity,
              );
            }
          }
          if (mode === 'after') {
            /* Target wandIndex shifted left to make room for insertion*/
            if (fromIndex < toIndex) {
              state.spellIds = fixedLengthCopy(
                [
                  ...state.spellIds.slice(0, fromIndex),
                  ...state.spellIds.slice(fromIndex + 1, toIndex),
                  state.spellIds[fromIndex],
                  ...state.spellIds.slice(toIndex),
                ],
                state.wand.deck_capacity,
              );
            } else {
              state.spellIds = fixedLengthCopy(
                [
                  ...state.spellIds.slice(0, toIndex),
                  state.spellIds[fromIndex],
                  ...state.spellIds.slice(toIndex, fromIndex),
                  ...state.spellIds.slice(fromIndex + 1),
                ],
                state.wand.deck_capacity,
              );
            }
          }
        } else if (isNotNullOrUndefined(fromIndex)) {
          /* Moving spell into wand, so may cause overflow TODO */
          state.spellIds = fixedLengthCopy(
            [
              ...state.spellIds.slice(0, toIndex),
              popSpellId(state, fromIndex),
              ...state.spellIds.slice(toIndex),
            ],
            state.wand.deck_capacity,
          );
        }
        /* Inserting into Always Cast block   TODO
         * This is like the main wand but only 4 cap */
      } else if (isAlwaysCastIndex(toIndex)) {
        setSpellId(state, toIndex, popSpellId(state, fromIndex));
      } else if (typeof toIndex === typeof ZTA) {
        setSpellId(state, toIndex, popSpellId(state, fromIndex));
      }
    },
  },
});

export const {
  setWand,
  resetWand,
  clearSpells,
  setSpells,
  setSpellAtIndex,
  insertSpellBefore,
  insertSpellAfter,
  deleteSpellAtIndex,
  moveSpell,
} = wandSlice.actions;

export const wandReducer = wandSlice.reducer;

export const useWandSlice = () => useSliceWrapper(wandSlice, 'wand');

// TODO also depends on config
// TODO memoise previous sim results to avoid re-running
const simulationNeedsUpdatePredicate = (
  _unused: unknown,
  currentState: RootState,
  previousState: RootState,
): boolean =>
  compareWandsForSimulation(
    currentState.wand.present.wand,
    previousState.wand.present.wand,
  ) &&
  compareSequenceIgnoringGaps(
    currentState.wand.present.spellIds,
    previousState.wand.present.spellIds,
  );

/**
 * Update browser history and URL on change
 */
startAppListening({
  predicate: simulationNeedsUpdatePredicate,
  effect: async (_action, listenerApi) => {
    const {
      // condenseShots,
      // unlimitedSpells,
      // infiniteSpells,
      // showDivides,
      // showGreekSpells,
      // showDirectActionCalls,
      // showActionTree,
      endSimulationOnShotCount,
      endSimulationOnReloadCount,
      endSimulationOnRefreshCount,
      endSimulationOnRepeatCount,
      limitSimulationIterations,
      limitSimulationDuration,
      'random.worldSeed': worldSeed,
      'random.frameNumber': frameNumber,
      'requirements.enemies': req_enemies,
      'requirements.projectiles': req_projectiles,
      'requirements.hp': req_hp,
      'requirements.half': req_half,
    } = listenerApi.getState().config.config;

    const spellIds = listenerApi.getState().wand.present.spellIds;
    const spells = spellIds.flatMap((id) =>
      isNotNullOrUndefined(id) && isValidActionId(id) ? getSpellById(id) : [],
    );
    const wand = listenerApi.getState().wand.present.wand;

    const task = listenerApi.fork(async (forkApi) =>
      clickWand(wand, spells /* TODO spellsWithUses */, {
        req_enemies: req_enemies,
        req_projectiles: req_projectiles,
        req_hp: req_hp,
        req_half: req_half,
        rng_frameNumber: frameNumber,
        rng_worldSeed: worldSeed,
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

    if (result.status === 'ok') {
      console.log('Child succeeded: ', result.value);

      const {
        shots,
        recharge: totalRechargeTime,
        endReason,
        elapsedTime,
      } = result.value;
    } else {
      console.log('Child failed: ', result.status, result.error);
    }
  },
});
