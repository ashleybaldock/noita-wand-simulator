import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
import { RootState } from './store';
import { SpellEditMode, SpellId, Wand, WandState } from '../types';
import { defaultWand } from './Wand/presets';
import { useSliceWrapper } from './useSlice';
import { generateWandStateFromSearch } from './Wand/fromSearch';
import { MAX_ALWAYS } from '../util';

export function fixedLengthCopy<T>(arr: T[], size: number): T[] {
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
    },
  },
});

export const {
  setWand,
  resetWand,
  clearSpells,
  setSpells,
  setSpellAtIndex,
  moveSpell,
} = wandSlice.actions;

export const selectWandState = (state: RootState): WandState =>
  state.wand.present;
const selectWand = (state: RootState): Wand => state.wand.present.wand;
const selectSpells = (state: RootState): SpellId[] =>
  state.wand.present.spellIds;
const selectMessages = (state: RootState): string[] =>
  state.wand.present.messages;

export const wandReducer = wandSlice.reducer;

export const useWandState = () => useSelector(selectWandState);

export const useWand = () => useSelector(selectWand);
export const useSpells = () => useSelector(selectSpells);
export const useMessages = () => useSelector(selectMessages);

export const useWandSlice = () => useSliceWrapper(wandSlice, 'wand');
