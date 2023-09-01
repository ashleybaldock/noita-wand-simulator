import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
import { RootState } from './store';
import { SpellId, Wand, WandState } from '../types';
import { defaultWand } from './presets';
import { generateWandStateFromSearch } from './util';

export function fixedLengthCopy<T>(arr: T[], size: number): T[] {
  return size > arr.length
    ? [...arr, ...Array(size - arr.length).fill(null)]
    : arr.slice(0, size);
}

const { wand, spellIds, messages } = generateWandStateFromSearch(
  window.location.search,
);

// TODO these could be surfaced in the UI for debugging wand urls
console.debug(messages);

const initialState: WandState = {
  wand: {
    ...defaultWand,
    ...wand,
  },
  spellIds: fixedLengthCopy(
    spellIds,
    wand.deck_capacity ?? defaultWand.deck_capacity,
  ),
  messages: messages || [],
};

export const wandSlice = createSlice({
  name: 'wand',
  initialState,
  reducers: {
    setWand: (
      state,
      action: PayloadAction<{ wand: Wand; spells?: SpellId[] }>,
    ) => {
      const { wand, spells } = action.payload;
      state.wand = wand;

      if (spells) {
        state.spellIds = spells;
      }

      state.spellIds = fixedLengthCopy(state.spellIds, wand.deck_capacity);
    },
    setSpells: (state, action: PayloadAction<SpellId[]>) => {
      state.spellIds = action.payload;

      state.spellIds = fixedLengthCopy(
        state.spellIds,
        state.wand.deck_capacity,
      );
    },
    setSpellAtIndex: (
      state,
      action: PayloadAction<{ spell: SpellId | null; index: number }>,
    ) => {
      const { spell, index } = action.payload;
      state.spellIds[index] = spell;
    },
    moveSpell: (
      state,
      action: PayloadAction<{ fromIndex: number; toIndex: number }>,
    ) => {
      const { fromIndex, toIndex } = action.payload;
      const sourceSpell = state.spellIds[fromIndex];

      state.spellIds[toIndex] = sourceSpell;
      state.spellIds[fromIndex] = null;
    },
    swapSpells: (
      state,
      action: PayloadAction<{ fromIndex: number; toIndex: number }>,
    ) => {
      const { fromIndex, toIndex } = action.payload;
      const sourceSpell = state.spellIds[fromIndex];
      const targetSpell = state.spellIds[toIndex];

      state.spellIds[toIndex] = sourceSpell;
      state.spellIds[fromIndex] = targetSpell;
    },
  },
});

export const { setWand, setSpells, setSpellAtIndex, moveSpell, swapSpells } =
  wandSlice.actions;

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
