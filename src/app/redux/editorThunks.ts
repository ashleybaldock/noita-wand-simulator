import type { SpellId } from './Wand/spellId';
import { clearSelection, moveCursorTo } from './editorSlice';
import type { SpellShiftDirection } from '../types';
import { getNewCursorPosition } from './editorUtils';
import type { AppThunk } from './store';
import {
  deleteSpellAtIndex,
  deleteSpellsInRange,
  moveSpell,
} from './wandSlice';
import { isMainWandIndex } from './WandIndex';

/* Cursor shifts to the right, along with the rest
 *  of the spells on the wand
 * Permits multiple sequential insertions */
export const insertSpellBeforeCursor =
  ({ spellId }: { spellId: SpellId }): AppThunk =>
  (dispatch, getState): void => {
    const state = getState();

    dispatch(
      moveSpell({
        spellId,
        toIndex: state.editor.cursorIndex,
        fromIndex: undefined,
        mode: 'before',
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
      moveSpell({
        spellId: spellId,
        toIndex: state.editor.cursorIndex,
        fromIndex: undefined,
        mode: 'after',
      }),
    );
  };

export const removeSpellBeforeCursor =
  ({ shift = 'left' }: { shift: SpellShiftDirection }): AppThunk =>
  (dispatch, getState): void => {
    const state = getState();
    dispatch(
      deleteSpellAtIndex({
        wandIndex:
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
        wandIndex: state.editor.cursorIndex,
        shift,
      }),
    );
  };

export const moveCursor =
  ({ by }: { by: number; select?: SpellShiftDirection }): AppThunk =>
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

/**
 * Remove all spells in current selection
 *
 * TODO - if deleting spells from a selection
 *        make undo restore the selection
 */
export const removeSelectedSpells =
  ({
    shift = 'none',
    clear = true,
  }: {
    shift?: SpellShiftDirection;
    clear?: boolean;
  }): AppThunk =>
  (dispatch, getState): void => {
    const {
      editor: { selectFrom, selectTo },
    } = getState();
    if (isMainWandIndex(selectFrom) && isMainWandIndex(selectTo)) {
      dispatch(
        deleteSpellsInRange({
          fromIndex: selectFrom,
          toIndex: selectTo,
          shift,
        }),
      );
      if (clear) {
        dispatch(clearSelection);
      }
    }
  };
