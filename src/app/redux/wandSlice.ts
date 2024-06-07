import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type { SpellEditMode, SpellShiftDirection } from '../types';
import { defaultWand } from './Wand/presets';
import { useSliceWrapper } from './useSlice';
import { generateWandStateFromSearch } from './Wand/fromSearch';
import {
  MAX_ALWAYS,
  fixedLengthCopy,
  isNotNullOrUndefined,
  assertNever,
} from '../util';
import type { WandState } from './Wand/wandState';
import type { Wand } from './Wand/wand';
import type { SpellId } from './Wand/spellId';
import type { MainWandIndex } from './WandIndex';
import {
  alwaysCastIndexMap,
  isAlwaysCastIndex,
  isMainWandIndex,
  isSpecialWandIndex,
  isWandIndex,
  isWithinBounds,
  ZTA,
  type WandIndex,
} from './WandIndex';
import type { ActionId } from '../calc/actionId';
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
    deleteSpellsInRange: (
      state,
      {
        payload: { fromIndex, toIndex, shift = 'none' },
      }: PayloadAction<{
        fromIndex: MainWandIndex;
        toIndex: MainWandIndex;
        shift: SpellShiftDirection;
      }>,
    ): void => {
      const [a, b] = [
        Math.min(fromIndex, toIndex),
        Math.max(fromIndex, toIndex),
      ];
      state.spellIds = fixedLengthCopy(
        [
          ...(shift === 'right' ? new Array(b - a).fill(null) : []),
          ...state.spellIds.slice(0, a),
          ...(shift === 'none' ? new Array(b - a).fill(null) : []),
          ...state.spellIds.slice(b + 1),
        ],
        state.wand.deck_capacity,
      );
    },
    deleteSpellAtIndex: (
      state,
      {
        payload: { wandIndex, shift = 'none' },
      }: PayloadAction<{ wandIndex: WandIndex; shift: SpellShiftDirection }>,
    ): void => {
      if (shift === 'none' || !isMainWandIndex(wandIndex)) {
        setSpellId(state, wandIndex, null);
      } else if (isMainWandIndex(wandIndex)) {
        state.spellIds = fixedLengthCopy(
          [
            ...(shift === 'right' ? [null] : []),
            ...state.spellIds.slice(0, wandIndex),
            ...state.spellIds.slice(wandIndex + 1),
          ],
          state.wand.deck_capacity,
        );
      }
    },
    moveSpell: (
      state,
      {
        payload: { fromIndex, toIndex, spellId, mode = 'swap' },
      }: PayloadAction<{
        fromIndex: WandIndex | undefined;
        toIndex: WandIndex;
        spellId: SpellId;
        mode?: SpellEditMode;
      }>,
    ): void => {
      const { deck_capacity: capacity } = state.wand;
      if (
        fromIndex === toIndex ||
        (fromIndex !== undefined && !isWithinBounds(fromIndex, capacity)) ||
        !isWithinBounds(toIndex, capacity)
      ) {
        return;
      }
      /*
       * insert strategies
       * shiftright: from Target to end are shifted right
       *             may fall off the end of the wand
       * shiftleft:  start to Target are shifted left
       *             may fall off the start of the wand
       */
      if (mode === 'before' || mode === 'after') {
        if (isMainWandIndex(toIndex)) {
          if (isMainWandIndex(fromIndex)) {
            /* Moving spell within wand, so will always fit */
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
          } else {
            /* Moving spell into wand, so may cause overflow TODO */
            state.spellIds = fixedLengthCopy(
              [
                ...state.spellIds.slice(0, toIndex),
                isWandIndex(fromIndex) ? popSpellId(state, fromIndex) : spellId,
                ...state.spellIds.slice(toIndex),
              ],
              state.wand.deck_capacity,
            );
          }
        }
      } else if (mode === 'swap') {
        const fromSpellId = isWandIndex(fromIndex)
          ? popSpellId(state, fromIndex)
          : spellId;
        const toSpellId = getSpellId(state, toIndex);
        if (fromIndex !== undefined) {
          setSpellId(state, fromIndex, toSpellId);
        }
        setSpellId(state, toIndex, fromSpellId);
      } else if (mode === 'overwrite') {
        setSpellId(
          state,
          toIndex,
          isWandIndex(fromIndex) ? popSpellId(state, fromIndex) : spellId,
        );
      } else {
        assertNever();
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
  deleteSpellsInRange,
  deleteSpellAtIndex,
  moveSpell,
} = wandSlice.actions;

export const wandReducer = wandSlice.reducer;

export const useWandSlice = () => useSliceWrapper(wandSlice, 'wand');
