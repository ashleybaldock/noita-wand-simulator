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
import { useEditMode } from './hooks';
import type { DeleteStrategy } from './EditMode';

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
  ({ shift = 'left' }: { shift?: SpellShiftDirection } = {}): AppThunk =>
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
    /* TODO - undo cursor position */
    if (shift === 'left') {
      dispatch(moveCursor({ by: -1 }));
    }
  };

export const removeSpellAfterCursor =
  ({ shift = 'left' }: { shift?: SpellShiftDirection } = {}): AppThunk =>
  (dispatch, getState): void => {
    const state = getState();
    dispatch(
      deleteSpellAtIndex({
        wandIndex: state.editor.cursorIndex,
        shift,
      }),
    );
    /* TODO - undo cursor position */
    if (shift === 'right') {
      dispatch(moveCursor({ by: 1 }));
    }
  };

/*
 * Move insert cursor by some offset, with bounds checks
 */
export const moveCursor =
  ({
    by,
    wrap = false,
  }: {
    by: number;
    select?: SpellShiftDirection;
    wrap?: boolean;
  }): AppThunk =>
  (dispatch, getState): void => {
    const state = getState();
    dispatch(
      moveCursorTo({
        to: getNewCursorPosition({
          currentPosition: state.editor.cursorIndex,
          wandLength: state.wand.present.wand.deck_capacity,
          moveBy: by,
          wrap,
        }),
      }),
    );
  };

/**
 * Remove all spells in current selection
 */
export const removeSelectedSpells =
  ({
    shiftDirection = 'left',
    deleteStrategy = 'blank',
    clear = true,
  }: {
    deleteStrategy?: DeleteStrategy;
    shiftDirection?: SpellShiftDirection;
    clear?: boolean;
  } = {}): AppThunk =>
  (dispatch, getState): void => {
    const {
      editor: { selectFrom, selectTo },
    } = getState();
    useEditMode();
    if (isMainWandIndex(selectFrom) && isMainWandIndex(selectTo)) {
      dispatch(
        deleteSpellsInRange({
          fromIndex: selectFrom,
          toIndex: selectTo,
          shiftDirection,
        }),
      );
      /* TODO - on undo restore selection */
      if (clear) {
        dispatch(clearSelection());
      }
    }
  };
