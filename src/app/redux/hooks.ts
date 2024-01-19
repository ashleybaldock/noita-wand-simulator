import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import type { AppDispatch, RootState } from './store';
import { createSelector } from 'reselect';
import { generateWikiWandV2 } from './Wand/toWiki';
import { generateSearchFromWandState } from './Wand/toSearch';
import { compareSequence, compareSequenceIgnoringGaps } from '../util';
import type { Cursor } from '../components/Spells/WandAction/types';
import type { WandSelection } from './Wand/wandSelection';
import { getSelectionForId } from './Wand/toSelection';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

///****************************************/
//**            configSlice             **/
/****************************************/

const selectConfig = (state: RootState) => state.config;
export const useConfig = () => useAppSelector(selectConfig).config;

///****************************************/
//**           presetsSlice             **/
/****************************************/

const selectPresets = (state: RootState) => state.presets;
export const usePresets = () => useAppSelector(selectPresets).presets;

///****************************************/
//**             wandSlice              **/
/****************************************/

export const selectWandState = (state: RootState) => state.wand.present;

const selectWand = createSelector(
  selectWandState,
  (wandState) => wandState.wand,
);
export const useWand = () => useSelector(selectWand);

const selectWikiExport = createSelector(selectWandState, generateWikiWandV2);
export const useWikiExport = () => useSelector(selectWikiExport);

const selectURLSearch = createSelector(
  selectWandState,
  generateSearchFromWandState,
);
export const useURLSearch = () => useSelector(selectURLSearch);

const selectSpells = createSelector(
  selectWandState,
  (wandState) => wandState.spellIds,
);

/**
 * Full Spell sequence
 */
export const useSpellLayout = () => useSelector(selectSpells, compareSequence);

/**
 * Spell sequence
 * - Considered to have changed only if order changes
 */
export const useSpellSequence = () =>
  useSelector(selectSpells, compareSequenceIgnoringGaps);

const selectMessages = createSelector(
  selectWandState,
  (wandState) => wandState.messages,
);
export const useMessages = () => useSelector(selectMessages);

///****************************************/
//**            editorSlice             **/
/****************************************/

const selectCursorIndex = (state: RootState) => state.editor.cursorIndex;

const selectCursor = createSelector(
  selectCursorIndex,
  selectSpells,
  (cursorIndex, spellIds): Cursor[] =>
    spellIds.map((_, wandIndex) => ({
      position:
        cursorIndex === wandIndex
          ? 'before'
          : cursorIndex === wandIndex + 1
          ? 'after'
          : 'none',
      style: 'caret',
    })),
);

export const useCursor = () => useSelector(selectCursor);

const selectSelectionExtents = (state: RootState) => ({
  selectFrom: state.editor.selectFrom,
  selectTo: state.editor.selectTo,
});

const selectSelection = createSelector(
  selectSelectionExtents,
  selectSpells,
  ({ selectFrom, selectTo }, spellIds): WandSelection[] =>
    spellIds.map((_, wandIndex) =>
      getSelectionForId(wandIndex, selectFrom, selectTo),
    ),
);
export const useSelection = () => useSelector(selectSelection);
const selectSelecting = createSelector(
  selectSelectionExtents,
  ({ selectFrom }): boolean => selectFrom !== null,
);

export const useSelecting = () => useSelector(selectSelecting);
