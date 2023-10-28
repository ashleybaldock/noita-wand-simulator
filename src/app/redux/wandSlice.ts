import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
import { RootState } from './store';
import { Cursor, SpellEditMode, SpellId, Wand, WandState } from '../types';
import { defaultWand } from './Wand/presets';
import { useSliceWrapper } from './useSlice';
import { generateWandStateFromSearch } from './Wand/fromSearch';
import { MAX_ALWAYS } from '../util';

export function fixedLengthCopy<T>(
  arr: readonly T[],
  size: number = arr.length,
): T[] {
  return size > arr.length
    ? [...arr, ...Array(size - arr.length).fill(null)]
    : arr.slice(0, size);
}

// /* Produces a copy of the input array with the requested change */
// const moveSpell = (
//   spellIds: readonly SpellId[],
//   fromIndex: number | null,
//   toIndex: number | null,
//   mode: SpellEditMode,
// ): SpellId[] => {
//   const indexToSpell = (
//     spellIds: readonly SpellId[],
//     s: SpellId | number,
//   ): SpellId => {
//     if (typeof s === 'number') {
//       return spellIds[s];
//     }
//     return s;
//   };

//   // const source = indexToSpell(spellIds, from);
//   // const destination = indexToSpellindexToSpell(spellIds, to);

//   if (
//     fromIndex === toIndex ||
//     (fromIndex !== null && (fromIndex < 0 || fromIndex >= spellIds.length)) ||
//     (toIndex !== null && (toIndex < 0 || toIndex >= spellIds.length))
//   ) {
//     return fixedLengthCopy(spellIds, spellIds.length);
//   }
//   if (mode === 'swap') {
//     const result = fixedLengthCopy(spellIds);
//     if (fromIndex !== null && toIndex !== null) {
//       result[toIndex] = spellIds[fromIndex];
//       result[fromIndex] = spellIds[toIndex];
//     }
//     return result;
//   }
//   if (mode === 'overwrite') {
//     const result = fixedLengthCopy(spellIds);
//     if (fromIndex !== null) {
//       result[fromIndex] = null;
//     }
//     if (toIndex !== null) {
//       if (fromIndex !== null) {
//         result[toIndex] = spellIds[fromIndex];
//       } else {
//         result[toIndex] = null;
//       }
//     }
//     return result;
//   }
//   if (mode === 'before') {
//     const from = spellIds[fromIndex];
//     const result = fixedLengthCopy(
//       [
//         ...spellIds.slice(0, fromIndex),
//         ...spellIds.slice(fromIndex + 1, toIndex),
//         spellIds[fromIndex],
//         ...spellIds.slice(toIndex),
//       ],
//       spellIds.length,
//     );
//     if (fromIndex < toIndex) {
//     } else {
//       const result = fixedLengthCopy(
//         [
//           ...spellIds.slice(0, toIndex),
//           spellIds[fromIndex],
//           ...spellIds.slice(toIndex, fromIndex),
//           ...spellIds.slice(fromIndex + 1),
//         ],
//         spellIds.length,
//       );
//     }
//   }
// };

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
  cursor: {
    position: 0,
  },
} as const;

export const wandSlice = createSlice({
  name: 'wand',
  initialState,
  reducers: {
    resetWand: (state) => {
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
    insertSpellBeforeCursor: (state, { payload }): void =>
      wandSlice.caseReducers.insertSpellBefore(state, {
        ...payload,
        index: state.cursor.position + 1,
      }),
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
    insertSpellAfterCursor: (state, { payload }): void =>
      wandSlice.caseReducers.insertSpellAfter(state, {
        ...payload,
        index: state.cursor.position,
      }),
    setSpellAtIndex: (
      state,
      {
        payload: { spell, index },
      }: PayloadAction<{ index: number; spell: SpellId | null }>,
    ): void => {
      state.spellIds[index] = spell;
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
    clearSpellAtIndex: (
      state,
      { payload: { index } }: PayloadAction<{ index: number }>,
    ): void => {
      state.spellIds[index] = null;
    },
    moveCursor: (
      state,
      { payload: { moveBy: number } }: PayloadAction<{ moveBy: number }>,
    ): void => {},
    moveSpell: (
      state,
      {
        payload: { fromIndex, toIndex, mode = 'swap' },
      }: PayloadAction<{
        fromIndex: number;
        toIndex: number;
        mode?: SpellEditMode;
      }>,
    ): void => {
      if (fromIndex === toIndex) {
        return;
      }
      if (
        fromIndex >= state.wand.deck_capacity ||
        fromIndex < 0 ||
        toIndex >= state.wand.deck_capacity ||
        toIndex < 0
      ) {
        return;
      }
      if (mode === 'swap') {
        const temp = state.spellIds[fromIndex];
        state.spellIds[fromIndex] = state.spellIds[toIndex];
        state.spellIds[toIndex] = temp;
      }
      if (mode === 'overwrite') {
        const sourceSpell = state.spellIds[fromIndex];

        state.spellIds[toIndex] = sourceSpell;
        state.spellIds[fromIndex] = null;
      }
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
  insertSpellBeforeCursor,
  insertSpellAfter,
  insertSpellAfterCursor,
  moveSpell,
  moveCursor,
} = wandSlice.actions;

export const selectWandState = (state: RootState): WandState =>
  state.wand.present;
const selectWand = (state: RootState): Wand => state.wand.present.wand;
const selectSpells = (state: RootState): SpellId[] =>
  state.wand.present.spellIds;
const selectMessages = (state: RootState): string[] =>
  state.wand.present.messages;
const selectCursor = (state: RootState): Cursor => state.wand.present.cursor;

export const wandReducer = wandSlice.reducer;

export const useWandState = () => useSelector(selectWandState);

export const useWand = () => useSelector(selectWand);
export const useSpells = () => useSelector(selectSpells);
export const useMessages = () => useSelector(selectMessages);
export const useCursor = () => useSelector(selectCursor);

export const useWandSlice = () => useSliceWrapper(wandSlice, 'wand');
