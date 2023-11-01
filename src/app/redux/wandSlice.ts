import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
import { RootState } from './store';
import { Cursor, SpellEditMode, SpellId, Wand, WandState } from '../types';
import { defaultWand } from './Wand/presets';
import { useSliceWrapper } from './useSlice';
import { generateWandStateFromSearch } from './Wand/fromSearch';
import { MAX_ALWAYS } from '../util';
import { generateWikiWandV2 } from './Wand/toWiki';

export function fixedLengthCopy<T>(
  arr: readonly T[],
  size: number = arr.length,
): T[] {
  return size > arr.length
    ? [...arr, ...Array(size - arr.length).fill(null)]
    : arr.slice(0, size);
}

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
    /* Cursor shifts to the right, along with the rest of the spells on the wand
     * Permits multiple sequential insertions */
    insertSpellBeforeCursor: (
      state,
      { payload: { spell } }: PayloadAction<{ spell: SpellId }>,
    ): void => {
      wandSlice.caseReducers.insertSpellBefore(state, {
        payload: {
          spell,
          index: state.cursor.position,
        },
        type: '',
      });
      state.cursor.position += 1;
    },
    /* Cursor appears to stay in same place, spells shift to the right */
    insertSpellAfterCursor: (
      state,
      { payload: { spell } }: PayloadAction<{ spell: SpellId }>,
    ): void =>
      wandSlice.caseReducers.insertSpellBefore(state, {
        payload: {
          spell,
          index: state.cursor.position,
        },
        type: '',
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
const selectWikiExport = createSelector(selectWandState, generateWikiWandV2);

export const wandReducer = wandSlice.reducer;

export const useWandState = () => useSelector(selectWandState);

export const useWikiExport = () => useSelector(selectWikiExport);

export const useWand = () => useSelector(selectWand);
export const useSpells = () => useSelector(selectSpells);
export const useMessages = () => useSelector(selectMessages);
export const useCursor = () => useSelector(selectCursor);

export const useWandSlice = () => useSliceWrapper(wandSlice, 'wand');
