import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type { SpellShiftDirection } from '../types';
import { useSliceWrapper } from './useSlice';
import type { WandEditorState } from './editorState';
import type { WandIndex } from './WandIndex';
import {
  isCursorWandIndex,
  isMainWandIndex,
  isSelectionWandIndex,
} from './WandIndex';

const initialState: WandEditorState = {
  cursorIndex: 0,
  selecting: false,
  selectFrom: null,
  selectTo: null,
} as const;

/**
 * See also: editorThunks.ts
 */
export const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    resetEditor: () => {
      return initialState;
    },
    clearSelection: (state): void => {
      state.selecting = false;
      state.selectFrom = null;
      state.selectTo = null;
    },

    /**
     * Confirm current selection bounds and end selecting mode
     */
    confirmSelection: (state): void => {
      state.selecting = false;
    },

    /**
     * Set selection bounds based on from and to index
     */
    setSelection: (
      state,
      {
        payload: { from, to, selecting = true },
      }: PayloadAction<{
        from: WandIndex;
        to: WandIndex;
        selecting?: boolean;
      }>,
    ): void => {
      state.selecting = selecting;
      if (isSelectionWandIndex(from) || isCursorWandIndex(from)) {
        state.selectFrom = isCursorWandIndex(from) ? state.cursorIndex : from;
      }
      if (isSelectionWandIndex(to) || isCursorWandIndex(to)) {
        state.selectTo = isCursorWandIndex(to) ? state.cursorIndex : to;
      }
    },

    /**
     * Change position of current selection
     * Operates based on the start index, and preserves selection length
     **/
    moveSelection: (
      state,
      { payload: { by, to } }: PayloadAction<{ by?: number; to?: number }>,
    ): void => {},

    /**
     * Set the next paste to insert the currently selected spells
     */
    copySelected: (): void => {},
    /**
     * As for copySelected, but also remove the selected spells from the wand
     */
    cutSelected: (): void => {},
    /**
     * Insert whatever was given to the last copySelected or cutSelected
     */
    pasteSelected: (): void => {},
    /**
     * Remove all spells in selection from the wand, and clear the selection
     */
    /**
     * Insert a copy of the current selection just after itself
     */
    duplicateSelected: (): void => {},
    /**
     * Group spells so they move together
     */
    groupSelected: (): void => {},
    /**
     * Ungroup group of spells
     */
    ungroupSelected: (): void => {},
    /**
     * Saves the selected spells as a new wand snippet
     */
    saveSelected: (): void => {},

    /**
     * moves cursor and updates selection
     * to: index to move cursor to,
     *  must be within the bounds of the wand
     **/
    moveCursorTo: (
      state,
      {
        payload: { to, select = 'none' },
      }: PayloadAction<{
        to?: WandIndex;
        select?: SpellShiftDirection;
      }>,
    ): void => {
      if (!isMainWandIndex(to)) {
        return;
      }
      const oldCursor = state.cursorIndex;
      const newCursor = to ?? state.cursorIndex;

      if (select === 'none') {
        state.cursorIndex = newCursor;
      } else {
        const prevFrom = state.selectFrom;
        const prevTo = state.selectTo;

        /* Adjust an existing selection */
        if (isMainWandIndex(prevFrom) && isMainWandIndex(prevTo)) {
          /* shrink selection to new start point, cursor moves with selection */
          if (newCursor === oldCursor && oldCursor === prevFrom) {
            state.selectFrom = newCursor;
            state.cursorIndex = newCursor;
          }
          /* extend selection to new start point, cursor stays still */
          if (newCursor < oldCursor && oldCursor < prevFrom) {
            state.selectFrom = oldCursor;
            state.cursorIndex = oldCursor;
          }
          /* extend selection to new start point, cursor moves with selection */
          if (newCursor < oldCursor && oldCursor === prevFrom) {
            state.selectFrom = newCursor;
            state.cursorIndex = newCursor;
          }
          /* shrink selection to new start/end point, cursor stays still */
          if (newCursor > prevFrom && newCursor < prevTo) {
            if (select === 'right') {
              state.cursorIndex = oldCursor;
              state.selectFrom = oldCursor;
            }
            if (select === 'left') {
              state.cursorIndex = oldCursor;
              state.selectTo = oldCursor - 1;
            }
          }
          /* shrink selection to new end point, cursor moves with selection */
          if (newCursor === oldCursor && oldCursor === prevTo) {
            state.selectTo = newCursor - 1;
            state.cursorIndex = newCursor;
          }
          /* extend selection to new end point, cursor stays still */
          if (newCursor > prevTo && oldCursor - 1 > prevTo) {
            state.selectTo = oldCursor - 1;
            state.cursorIndex = oldCursor;
          }
          /* extend selection to new end point, cursor moves with selection */
          if (newCursor > prevTo && oldCursor - 1 === prevTo) {
            state.selectTo = newCursor - 1;
            state.cursorIndex = newCursor;
          }
        } else if (isMainWandIndex(prevFrom)) {
          if (newCursor < prevFrom) {
            state.cursorIndex = newCursor;
            state.selectFrom = newCursor;
            state.selectTo = prevFrom;
          }
          if (newCursor === prevFrom) {
            state.cursorIndex = newCursor;
            state.selectTo = newCursor;
          }
          if (newCursor > prevFrom) {
            state.cursorIndex = newCursor;
            state.selectFrom = prevFrom;
            state.selectTo = newCursor;
          }
        }
      }
    },
  },
});

export const {
  moveCursorTo,

  duplicateSelected,
  copySelected,
  cutSelected,
  pasteSelected,
  groupSelected,
  ungroupSelected,
  saveSelected,

  moveSelection,
  clearSelection,
  setSelection,
} = editorSlice.actions;

export const editorReducer = editorSlice.reducer;

export const useEditorSlice = () => useSliceWrapper(editorSlice, 'editor');
