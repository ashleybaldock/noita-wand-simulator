import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type { SpellShiftDirection, SelectionIndex } from '../types';
import { useSliceWrapper } from './useSlice';
import { isNotNullOrUndefined, isNumber, isString } from '../util';
import type { WandEditorState } from './editorState';

const initialState: WandEditorState = {
  cursorIndex: 0,
  selectFrom: 4,
  selectTo: 9,
} as const;

export const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    resetEditor: () => {
      return initialState;
    },
    // TODO
    clearSelection: (state): void => {
      state.selectFrom = null;
      state.selectTo = null;
    },
    // TODO
    deleteSelection: (
      state,
      {
        payload: { shift = 'none' },
      }: PayloadAction<{ shift?: SpellShiftDirection }>,
    ): void => {
      state.selectFrom = null;
      state.selectTo = null;
    },
    // TODO
    setSelection: (
      state,
      {
        payload: { from, to },
      }: PayloadAction<{ from: SelectionIndex; to: SelectionIndex }>,
    ): void => {
      if (isNotNullOrUndefined(from)) {
        if (isString(from) && from === 'cursor') {
          state.selectFrom = state.cursorIndex;
        }
        if (isNumber(from)) {
          state.selectFrom = from;
        }
      }
      if (isNotNullOrUndefined(to)) {
        if (isString(to) && to === 'cursor') {
          state.selectTo = state.cursorIndex - 1;
        }
        if (isNumber(to)) {
          state.selectTo = to;
        }
      }
    },
    // TODO
    moveSelection: (
      state,
      { payload: { by, to } }: PayloadAction<{ by?: number; to?: number }>,
    ): void => {},

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
        to?: number;
        select?: SpellShiftDirection;
      }>,
    ): void => {
      const oldCursor = state.cursorIndex;
      const newCursor = to ?? state.cursorIndex;

      if (select === 'none') {
        state.cursorIndex = newCursor;
      } else {
        const prevFrom = state.selectFrom;
        const prevTo = state.selectTo;

        /* Adjust an existing selection */
        if (isNotNullOrUndefined(prevFrom) && isNotNullOrUndefined(prevTo)) {
          console.log(prevFrom, prevTo, oldCursor, newCursor);
          /* shrink selection to new start point, cursor moves with selection */
          if (newCursor === oldCursor && oldCursor === prevFrom) {
            console.log('a', newCursor, oldCursor);
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
        } else if (isNotNullOrUndefined(prevFrom)) {
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

  moveSelection,
  clearSelection,
  deleteSelection,
  setSelection,
} = editorSlice.actions;

export const editorReducer = editorSlice.reducer;

export const useEditorSlice = () => useSliceWrapper(editorSlice, 'editor');
