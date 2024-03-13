import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import type { AppDispatch, RootState } from './store';
import { createSelector } from 'reselect';
import { generateWikiWandV2 } from './Wand/toWiki';
import { generateSearchFromWandState } from './Wand/toSearch';
import type { KeyOfType } from '../util';
import { compareSequence, compareSequenceIgnoringGaps } from '../util';
import type { WandSelection } from './Wand/wandSelection';
import { getSelectionForId } from './Wand/toSelection';
import type { Config, ConfigToggleField } from './configSlice';
import { setConfigSetting, toggleConfigSetting } from './configSlice';
import type { UIState, UIToggle } from './uiSlice';
import { flipUiToggle, setUiToggle } from './uiSlice';
import type { Cursor } from '../components/Spells/WandAction/Cursor';
import type { SpellId } from './Wand/spellId';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

///****************************************/
//**              uiSlice               **/
/****************************************/

const selectUI = (state: RootState) => state.ui;
export const useUI = () => useAppSelector(selectUI);

export const useUIToggle = <TN extends UIToggle>(
  name: TN,
): [
  value: UIState[TN],
  set: (newValue: UIState[TN]) => void,
  flip: () => void,
] => {
  const dispatch = useAppDispatch();
  return [
    useAppSelector(selectUI)[name],
    (newValue: UIState[TN]) => dispatch(setUiToggle({ name, newValue })),
    () => dispatch(flipUiToggle({ name })),
  ];
};

///****************************************/
//**            configSlice             **/
/****************************************/

const selectConfig = (state: RootState) => state.config;
export const useConfig = () => useAppSelector(selectConfig).config;

export const useConfigToggle = <N extends ConfigToggleField>(
  fieldName: N,
): [
  value: Config[N],
  set: (newValue: Config[N]) => void,
  toggle: () => void,
] => {
  const dispatch = useAppDispatch();
  return [
    useAppSelector(selectConfig).config[fieldName],
    (newValue: Config[N]) =>
      dispatch(setConfigSetting({ name: fieldName, newValue })),
    () => dispatch(toggleConfigSetting({ name: fieldName })),
  ];
};

export const useConfigSetting = <
  T extends Config[N],
  N extends KeyOfType<Config, T>,
>(
  fieldName: N,
): [value: Config[N], set: (newValue: T) => void] => {
  const dispatch = useAppDispatch();
  return [
    useAppSelector(selectConfig).config[fieldName],
    (newValue: T) => dispatch(setConfigSetting({ name: fieldName, newValue })),
  ];
};

export const useKeyhints = (): [
  value: boolean,
  toggle: () => void,
  set: (newValue: boolean) => void,
] => {
  const dispatch = useAppDispatch();
  return [
    useAppSelector(selectConfig).config['debug.keyHints'],
    () => dispatch(toggleConfigSetting({ name: 'debug.keyHints' })),
    (newValue: boolean) =>
      dispatch(setConfigSetting({ name: 'debug.keyHints', newValue })),
  ];
};

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

/**
 * Special case for Zeta's slot
 */
const selectZeta = createSelector(
  selectWandState,
  (wandState) => wandState.zetaId,
);
const selectIsZetaOnWand = createSelector(selectWandState, (wandState) =>
  wandState.spellIds.some((spellId) => spellId === 'ZETA'),
);
export const useZeta = (): [
  zetaOnWand: boolean,
  zetaSpellId: SpellId | null,
  // setZetaSpellId: (spellId: SpellId) => void,
] => {
  // const dispatch = useAppDispatch();
  return [
    useSelector(selectIsZetaOnWand) ?? false,
    useSelector(selectZeta) ?? null,
    // (spellId: SpellId) =>
    //   dispatch(setSpellAtIndex({ wandIndex: ZTA, spellId })),
  ];
};

/**
 * Always Cast Spell sequence
 */
const selectAlwaysCastSpells = createSelector(
  selectWandState,
  (wandState) => wandState.alwaysIds,
);

export const useAlwaysCastLayout = () =>
  useSelector(selectAlwaysCastSpells, compareSequence);

/**
 * Full Spell sequence
 */
const selectSpells = createSelector(
  selectWandState,
  (wandState) => wandState.spellIds,
);

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

const selectCursors = createSelector(
  selectCursorIndex,
  selectSpells,
  (cursorIndex, spellIds): Cursor[] =>
    spellIds.map(
      (_, wandIndex): Cursor => ({
        position:
          cursorIndex === wandIndex
            ? 'before'
            : cursorIndex === wandIndex + 1
            ? 'after'
            : 'none',
        style: 'caret',
      }),
    ),
);

export const useCursors = () => useSelector(selectCursors);

// const selectCursor = createSelector(
//   selectCursors,

// export const useCursor = (wandIndex: WandIndex): Cursor => {
//   if (isMainWandIndex(wandIndex)) {
//     return cursor[wandIndex];
//   }
//   return { position: 'none', style: 'none' };
// };

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
