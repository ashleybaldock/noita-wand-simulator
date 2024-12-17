import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import type { AppDispatch, RootState } from './store';
import { createSelector } from 'reselect';
import {
  generateWikiExample,
  generateWikiSpellSequence,
  generateWikiWandV2,
} from './Wand/toWiki';
import { generateSearchFromWandState } from './Wand/toSearch';
import type { KeyOfType } from '../util';
import {
  isBoolean,
  isNumber,
  sequencesMatch,
  sequencesMatchIgnoringHoles,
} from '../util';
import type { WandSelectionSet } from './Wand/wandSelection';
import {
  defaultWandSelection,
  defaultWandSelectionSet,
  type WandSelection,
} from './Wand/wandSelection';
import { getSelectionForId } from './Wand/toSelection';
import type { Config, ConfigToggleField } from './configSlice';
import {
  setConfigSetting,
  toggleConfigSetting,
  updateConfig,
} from './configSlice';
import type { UIState, UIToggle } from './uiSlice';
import { flipUiToggle, setUiToggle } from './uiSlice';
import type { CaretStyle } from '../components/Spells/WandAction/Backgrounds/Caret';
import { defaultCaret } from '../components/Spells/WandAction/Backgrounds/Caret';
import type { SpellId } from './Wand/spellId';
import type { ChangeEvent } from 'react';
import { useMemo } from 'react';
import type { MainWandIndex, WandIndex } from './WandIndex';
import { ZTA, isMainWandIndex } from './WandIndex';
import type { BackgoundPartLocation } from '../components/Spells/WandAction/Backgrounds/BackgroundPart';
import { useKeyState } from '../context/KeyStateContext';
import type { EditMode } from './EditMode';
import { setSpellAtIndex } from './wandSlice';
import type { WandShotId } from '../calc/eval/WandShot';

// Typed versions of `useDispatch` and `useSelector`
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

export const useSimulationStatus = () => useUIToggle('simulationRunning');

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
  changeHandler: (e: ChangeEvent<HTMLInputElement>) => void,
] => {
  const dispatch = useAppDispatch();
  return [
    useAppSelector(selectConfig).config[fieldName],
    (newValue: Config[N]) =>
      dispatch(setConfigSetting({ name: fieldName, newValue })),
    () => dispatch(toggleConfigSetting({ name: fieldName })),
    (e: ChangeEvent<HTMLInputElement>) => {
      dispatch(
        updateConfig({
          [fieldName]: e.target.checked,
        }),
      );
    },
  ];
};

export const useConfigSetting = <
  T extends Config[N],
  N extends KeyOfType<Config, T>,
>(
  fieldName: N,
): [
  value: Config[N],
  set: (newValue: T) => void,
  changeHandler: (e: ChangeEvent<HTMLInputElement>) => void,
] => {
  const dispatch = useAppDispatch();
  return [
    useAppSelector(selectConfig).config[fieldName],
    (newValue: T) => dispatch(setConfigSetting({ name: fieldName, newValue })),
    (e: ChangeEvent<HTMLInputElement>) => {
      if (isNumber(e.currentTarget.value)) {
        dispatch(
          updateConfig({
            [fieldName]: Number.parseInt(e.target.value),
          }),
        );
      }
      if (isBoolean(e.currentTarget.value)) {
        dispatch(
          updateConfig({
            [fieldName]: e.target.checked,
          }),
        );
      }
    },
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

/**
 * Full Spell sequence (Including empty slots)
 */
const selectSpellSequence = createSelector(
  selectWandState,
  (wandState) => wandState.spellIds,
);

/**
 * Spell sequence as on the wand (Includes empty slots)
 *
 * Considered to have changed if any spell is moved,
 * even if the sequence is the same
 */
export const useSpellLayout = () =>
  useSelector(selectSpellSequence, sequencesMatch);

/**
 * Spell sequence as executed (Ignores empty slots)
 *
 * Considered to have changed only if order changes
 */
export const useSpellSequence = () =>
  useSelector(selectSpellSequence, sequencesMatchIgnoringHoles);

const selectMessages = createSelector(
  selectWandState,
  (wandState) => wandState.messages,
);
export const useMessages = () => useSelector(selectMessages);

const selectWikiExportWand = createSelector(
  selectWandState,
  generateWikiWandV2,
);
export const useWikiExportWand = () => useSelector(selectWikiExportWand);

const selectWikiExportSeq = createSelector(
  selectSpellSequence,
  generateWikiSpellSequence,
);
export const useWikiSequenceExport = () => useSelector(selectWikiExportSeq);

const selectWikiExportExample = createSelector(
  selectWandState,
  generateWikiExample,
);
export const useWikiExampleExport = () => useSelector(selectWikiExportExample);

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
  setZetaSpellId: (spellId: SpellId) => void,
] => {
  const dispatch = useAppDispatch();
  return [
    useSelector(selectIsZetaOnWand) ?? false,
    useSelector(selectZeta) ?? null,
    (spellId: SpellId) =>
      dispatch(setSpellAtIndex({ wandIndex: ZTA, spellId })),
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
  useSelector(selectAlwaysCastSpells, sequencesMatch);

///****************************************/
//**            editorSlice             **/
/****************************************/

const selectCursorIndex = (state: RootState) => state.editor.cursorIndex;

const selectCarets = createSelector(
  selectCursorIndex,
  selectSpellSequence,
  (cursorIndex, spellIds): CaretStyle[] =>
    spellIds.map(
      (_, wandIndex: MainWandIndex): CaretStyle =>
        cursorIndex === wandIndex ? 'caret' : 'none',
    ),
);

export const useCarets = () => useSelector(selectCarets);

/*
 * Returns caret info for the 'between' spell locations
 * i.e. for 'before' spell index 1, return the caret info for 'after' spell 0 as well
 */
export const useCaret = (wandIndex: WandIndex): CaretStyle => {
  const cursors = useSelector(selectCarets);
  if (isMainWandIndex(wandIndex)) {
    return cursors[wandIndex] ?? defaultCaret['before'];
  }
  return defaultCaret['before'];
};

const selectSelectionExtents = (state: RootState) => ({
  selectFrom: state.editor.selectFrom,
  selectTo: state.editor.selectTo,
});

const selectSelections = createSelector(
  selectSelectionExtents,
  selectSpellSequence,
  ({ selectFrom, selectTo }, spellIds): WandSelectionSet[] =>
    spellIds.map((_, wandIndex) =>
      getSelectionForId(wandIndex, selectFrom, selectTo),
    ),
);
export const useSelections = () => useSelector(selectSelections);

export const useSelectionSet = (wandIndex: WandIndex): WandSelectionSet => {
  const selections = useSelections();
  return isMainWandIndex(wandIndex)
    ? selections[wandIndex]
    : defaultWandSelectionSet;
};

export const useSelection = (
  wandIndex: WandIndex,
  location: BackgoundPartLocation,
): WandSelection => {
  const selections = useSelections();
  const { 'editor.enableSelection': enableSelection } = useConfig();
  return enableSelection && isMainWandIndex(wandIndex)
    ? selections[wandIndex][location]
    : defaultWandSelection;
};

const selectSelecting = createSelector(
  selectSelectionExtents,
  ({ selectFrom }): boolean => selectFrom !== null,
);

export const useSelecting = () => useSelector(selectSelecting);

export const useEditMode = (): EditMode => {
  const { shift, alt, ctrl, meta } = useKeyState();
  const { 'editor.swapOnMove': swapOnMove } = useConfig();

  return {
    insert: 'push',
    direction: 'right',
    replace: 'swap',
    overflow: 'truncate',
    delete: 'blank',
    cursor: 'fixed',
  };
};

///****************************************/
//**            resultSlice             **/
/****************************************/

export const selectResultState = (state: RootState) => state.result.last;

const selectResult = createSelector(
  selectResultState,
  (resultState) => resultState,
);
export const useLatestResult = () => {
  return useAppSelector(selectResult);
};
export const useShotLookup = () => {
  const { shots } = useAppSelector(selectResult);
  return useMemo(() => new Map(shots.map((shot) => [shot.id, shot])), [shots]);
};

export const useShot = (shotId: WandShotId) => useShotLookup().get(shotId);
