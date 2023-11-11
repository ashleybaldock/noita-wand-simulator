import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
import { RootState } from './store';
import {
  Cursor,
  SpellId,
  Wand,
  WandState,
  SpellEditMode,
  SpellShiftDirection,
  SelectionIndex,
  WandSelection,
} from '../types';
import { defaultWand } from './Wand/presets';
import { useSliceWrapper } from './useSlice';
import { generateWandStateFromSearch } from './Wand/fromSearch';
import { isNotNullOrUndefined, isNumber, isString, MAX_ALWAYS } from '../util';
import { generateWikiWandV2 } from './Wand/toWiki';
import { getSelectionForId } from './Wand/toSelection';

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
  editor: {
    cursorIndex: 0,
    selectFrom: null,
    selectTo: null,
  },
} as const;

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
    /* Cursor shifts to the right, along with the rest of the spells on the wand
     * Permits multiple sequential insertions */
    insertSpellBeforeCursor: (
      state,
      { payload: { spell } }: PayloadAction<{ spell: SpellId }>,
    ): void => {
      wandSlice.caseReducers.insertSpellBefore(state, {
        payload: {
          spell,
          index: state.editor.cursorIndex,
        },
        type: '',
      });
      state.editor.cursorIndex += 1;
    },
    /* Cursor appears to stay in same place, spells shift to the right */
    insertSpellAfterCursor: (
      state,
      { payload: { spell } }: PayloadAction<{ spell: SpellId }>,
    ): void =>
      wandSlice.caseReducers.insertSpellBefore(state, {
        payload: {
          spell,
          index: state.editor.cursorIndex,
        },
        type: '',
      }),
    removeSpellBeforeCursor: (
      state,
      {
        payload: { shift = 'left' },
      }: PayloadAction<{ shift?: SpellShiftDirection }>,
    ): void =>
      wandSlice.caseReducers.deleteSpellAtIndex(state, {
        payload: {
          index:
            state.editor.cursorIndex > 0
              ? state.editor.cursorIndex - 1
              : state.wand.deck_capacity,
          shift,
        },
        type: '',
      }),
    removeSpellAfterCursor: (
      state,
      {
        payload: { shift = 'left' },
      }: PayloadAction<{ shift?: SpellShiftDirection }>,
    ): void =>
      wandSlice.caseReducers.deleteSpellAtIndex(state, {
        payload: {
          index: state.editor.cursorIndex,
          shift,
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
    deleteSpellAtIndex: (
      state,
      {
        payload: { index, shift = 'none' },
      }: PayloadAction<{ index: number; shift: SpellShiftDirection }>,
    ): void => {
      if (shift === 'none') {
        state.spellIds[index] = null;
      }
      if (shift === 'left') {
        state.spellIds = fixedLengthCopy(
          [
            ...state.spellIds.slice(0, index),
            ...state.spellIds.slice(index + 1),
          ],
          state.wand.deck_capacity,
        );
      }
      if (shift === 'right') {
        state.spellIds = fixedLengthCopy(
          [
            null,
            ...state.spellIds.slice(0, index),
            ...state.spellIds.slice(index + 1),
          ],
          state.wand.deck_capacity,
        );
      }
    },
    clearSelection: (state): void => {
      state.editor.selectFrom = null;
      state.editor.selectTo = null;
    },
    deleteSelection: (
      state,
      {
        payload: { shift = 'none' },
      }: PayloadAction<{ shift?: SpellShiftDirection }>,
    ): void => {
      state.editor.selectFrom = null;
      state.editor.selectTo = null;
    },
    setSelection: (
      state,
      {
        payload: { from, to },
      }: PayloadAction<{ from: SelectionIndex; to: SelectionIndex }>,
    ): void => {
      if (isNotNullOrUndefined(from)) {
        if (isString(from) && from === 'cursor') {
          state.editor.selectFrom = state.editor.cursorIndex;
        }
        if (isNumber(from)) {
          state.editor.selectFrom = from;
        }
      }
      if (isNotNullOrUndefined(to)) {
        if (isString(to) && to === 'cursor') {
          state.editor.selectTo = state.editor.cursorIndex - 1;
        }
        if (isNumber(to)) {
          state.editor.selectTo = to;
        }
      }
    },
    moveSelection: (
      state,
      { payload: { by, to } }: PayloadAction<{ by?: number; to?: number }>,
    ): void => {},
    /*
     * moveCursor()
     * to: specific index; by: relative to current cursorIndex
     * If both specified, performs 'to', then 'by'
     */
    moveCursor: (
      state,
      {
        payload: { by, to, select = 'none' },
      }: PayloadAction<{
        by?: number;
        to?: number;
        select?: SpellShiftDirection;
      }>,
    ): void => {
      const oldCursor = state.editor.cursorIndex;
      let newCursor = state.editor.cursorIndex;
      if (isNotNullOrUndefined(to)) {
        newCursor = Math.min(Math.max(0, to), state.wand.deck_capacity + 1);
      }
      if (isNotNullOrUndefined(by)) {
        const currentCursorPosition = state.editor.cursorIndex;
        const proposedCursorPosition = currentCursorPosition + by;
        const wrappedCursorPosition =
          (proposedCursorPosition + state.wand.deck_capacity + 1) %
          (state.wand.deck_capacity + 1);
        newCursor = wrappedCursorPosition;
      }

      if (select === 'none') {
        state.editor.cursorIndex = newCursor;
      } else {
        const prevFrom = state.editor.selectFrom;
        const prevTo = state.editor.selectTo;

        /* Adjust an existing selection */
        if (isNotNullOrUndefined(prevFrom) && isNotNullOrUndefined(prevTo)) {
          console.log(prevFrom, prevTo, oldCursor, newCursor);
          /* shrink selection to new start point, cursor moves with selection */
          if (newCursor === oldCursor && oldCursor === prevFrom) {
            console.log('a', newCursor, oldCursor);
            state.editor.selectFrom = newCursor;
            state.editor.cursorIndex = newCursor;
          }
          /* extend selection to new start point, cursor stays still */
          if (newCursor < oldCursor && oldCursor < prevFrom) {
            state.editor.selectFrom = oldCursor;
            state.editor.cursorIndex = oldCursor;
          }
          /* extend selection to new start point, cursor moves with selection */
          if (newCursor < oldCursor && oldCursor === prevFrom) {
            state.editor.selectFrom = newCursor;
            state.editor.cursorIndex = newCursor;
          }
          /* shrink selection to new start/end point, cursor stays still */
          if (newCursor > prevFrom && newCursor < prevTo) {
            if (select === 'right') {
              state.editor.cursorIndex = oldCursor;
              state.editor.selectFrom = oldCursor;
            }
            if (select === 'left') {
              state.editor.cursorIndex = oldCursor;
              state.editor.selectTo = oldCursor - 1;
            }
          }
          /* shrink selection to new end point, cursor moves with selection */
          if (newCursor === oldCursor && oldCursor === prevTo) {
            state.editor.selectTo = newCursor - 1;
            state.editor.cursorIndex = newCursor;
          }
          /* extend selection to new end point, cursor stays still */
          if (newCursor > prevTo && oldCursor - 1 > prevTo) {
            state.editor.selectTo = oldCursor - 1;
            state.editor.cursorIndex = oldCursor;
          }
          /* extend selection to new end point, cursor moves with selection */
          if (newCursor > prevTo && oldCursor - 1 === prevTo) {
            state.editor.selectTo = newCursor - 1;
            state.editor.cursorIndex = newCursor;
          }
        } else if (isNotNullOrUndefined(prevFrom)) {
          if (newCursor < prevFrom) {
            state.editor.cursorIndex = newCursor;
            state.editor.selectFrom = newCursor;
            state.editor.selectTo = prevFrom;
          }
          if (newCursor === prevFrom) {
            state.editor.cursorIndex = newCursor;
            state.editor.selectTo = newCursor;
          }
          if (newCursor > prevFrom) {
            state.editor.cursorIndex = newCursor;
            state.editor.selectFrom = prevFrom;
            state.editor.selectTo = newCursor;
          }
        }
      }
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
  removeSpellBeforeCursor,
  insertSpellAfter,
  insertSpellAfterCursor,
  removeSpellAfterCursor,
  moveSelection,
  clearSelection,
  deleteSelection,
  setSelection,
  moveCursor,
  moveSpell,
} = wandSlice.actions;

export const selectWandState = (state: RootState): WandState =>
  state.wand.present;
const selectWand = (state: RootState): Wand => state.wand.present.wand;
const selectSpells = (state: RootState): SpellId[] =>
  state.wand.present.spellIds;
const selectMessages = (state: RootState): string[] =>
  state.wand.present.messages;
const selectCursor = createSelector(
  selectWandState,
  ({ spellIds, editor: { cursorIndex } }: WandState): Cursor[] =>
    spellIds.map((_, wandIndex) => ({
      position:
        cursorIndex === wandIndex
          ? 'before'
          : cursorIndex === wandIndex + 1
          ? 'after'
          : 'none',
      style: 'insert',
    })),
);
const selectSelection = createSelector(
  selectWandState,
  ({
    spellIds,
    editor: { selectFrom, selectTo },
  }: WandState): WandSelection[] =>
    spellIds.map((_, wandIndex) =>
      getSelectionForId(wandIndex, selectFrom, selectTo),
    ),
);
const selectSelecting = createSelector(
  selectWandState,
  ({ editor: { selectFrom } }: WandState): boolean => selectFrom !== null,
);
const selectWikiExport = createSelector(selectWandState, generateWikiWandV2);

export const wandReducer = wandSlice.reducer;

export const useWandState = () => useSelector(selectWandState);

export const useWikiExport = () => useSelector(selectWikiExport);

export const useWand = () => useSelector(selectWand);

export const useSpells = () => useSelector(selectSpells);

export const useMessages = () => useSelector(selectMessages);

export const useCursor = () => useSelector(selectCursor);

export const useSelection = () => useSelector(selectSelection);

export const useSelecting = () => useSelector(selectSelecting);

export const useWandSlice = () => useSliceWrapper(wandSlice, 'wand');
