import type { SpellId } from './Wand/spellId';
import {
  deleteSpellAtIndex,
  insertSpellAfter,
  insertSpellBefore,
} from './wandSlice';
import type { AppThunk } from './store';
import { moveCursorTo } from './editorSlice';
import type { SpellShiftDirection } from '../types';
import { getNewCursorPosition } from './editorUtils';

/* Cursor shifts to the right, along with the rest
 *  of the spells on the wand
 * Permits multiple sequential insertions */
export const insertSpellBeforeCursor =
  ({ spellId }: { spellId: SpellId }): AppThunk =>
  (dispatch, getState): void => {
    const state = getState();

    dispatch(
      insertSpellBefore({
        spell: spellId,
        index: state.editor.cursorIndex,
      }),
    );
    dispatch(
      moveCursorTo({
        to: getNewCursorPosition({
          currentPosition: state.editor.cursorIndex,
          wandLength: state.wand.present.wand.deck_capacity,
          moveBy: 1,
        }),
      }),
    );
  };

/**
 * Cursor appears to stay in same place,
 *  spells shift to the right
 */
export const insertSpellAfterCursor =
  ({ spellId }: { spellId: SpellId }): AppThunk =>
  (dispatch, getState): void => {
    const state = getState();
    dispatch(
      insertSpellAfter({
        spell: spellId,
        index: state.editor.cursorIndex,
      }),
    );
  };

export const removeSpellBeforeCursor =
  ({ shift = 'left' }: { shift: SpellShiftDirection }): AppThunk =>
  (dispatch, getState): void => {
    const state = getState();
    dispatch(
      deleteSpellAtIndex({
        index:
          state.editor.cursorIndex > 0
            ? state.editor.cursorIndex - 1
            : state.wand.present.wand.deck_capacity,
        shift,
      }),
    );
  };

export const removeSpellAfterCursor =
  ({ shift = 'left' }: { shift: SpellShiftDirection }): AppThunk =>
  (dispatch, getState): void => {
    const state = getState();
    dispatch(
      deleteSpellAtIndex({
        index: state.editor.cursorIndex,
        shift,
      }),
    );
  };

export const moveCursor =
  ({
    by,
    always = false,
  }: {
    by: number;
    always?: boolean;
    select?: SpellShiftDirection;
  }): AppThunk =>
  (dispatch, getState): void => {
    const state = getState();
    dispatch(
      moveCursorTo({
        to: getNewCursorPosition({
          currentPosition: state.editor.cursorIndex,
          wandLength: state.wand.present.wand.deck_capacity,
          moveBy: by,
        }),
      }),
    );
  };
