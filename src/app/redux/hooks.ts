import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import { createSelector } from '@reduxjs/toolkit';
import type { AppDispatch, RootState } from './store';
import {
  generateWikiExample,
  generateWikiSpellSequence,
  generateWikiWandV2,
} from './Wand/toWiki';
import { generateSearchFromWandState } from './Wand/toSearch';
import type { KeyOfType } from '../util';
import {
  isBoolean,
  isNotUndefined,
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
import { getSelectionForWandIndex } from './Wand/toSelection';
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
import { isKnownSpell, type SpellId } from './Wand/spellId';
import type { ChangeEvent } from 'react';
import { useMemo } from 'react';
import type { MainWandIndex, WandIndex } from './WandIndex';
import { ZTA, isMainWandIndex } from './WandIndex';
import type { BackgoundPartLocation } from '../components/Spells/WandAction/Backgrounds/BackgroundPart';
import type { EditMode } from './EditMode';
import { setSpellAtIndex } from './wandSlice';
import type { WandCastId } from '../calc/eval/WandCast';
import {
  isUsesGoldActionId,
  isUsesHealthActionId,
  isUsesRandomActionId,
  isUsesRequirementEnemy,
  isUsesRequirementHalf,
  isUsesRequirementHp,
  isUsesRequirementProjectile,
} from '../calc/actionId';
import { getSpellByActionId } from '../calc/spells';

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
 * Spell sequence as on the wand (Includes empty slots)
 *
 * Considered to have changed if any spell is moved,
 * even if the sequence is the same
 */
const selectSpellLayout = createSelector(
  selectWandState,
  (wandState) => wandState.spellIds,
);
export const useSpellLayout = () =>
  useSelector(selectSpellLayout, sequencesMatch);

/**
 * Spell sequence as executed (Ignores empty slots)
 *
 * Considered to have changed only if order changes
 */
const selectSpellSequenceIds = createSelector(selectWandState, (wandState) =>
  wandState.spellIds.filter(isKnownSpell),
);
const selectSpellSequence = createSelector(selectSpellSequenceIds, (spellIds) =>
  spellIds.map((spellId) => getSpellByActionId(spellId)),
);
export const useSpellSequenceIds = () =>
  useSelector(selectSpellSequenceIds, sequencesMatchIgnoringHoles);
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
  selectSpellLayout,
  generateWikiSpellSequence,
);
export const useWikiSequenceExport = () => useSelector(selectWikiExportSeq);

const selectWikiExportExample = createSelector(
  selectWandState,
  generateWikiExample,
);
export const useWikiExampleExport = () => useSelector(selectWikiExportExample);

const selectWandUndoIndex = (state: RootState) => state.wand.index;

const selectURLSearch = createSelector(
  selectWandState,
  generateSearchFromWandState,
);
export const useURLSearch = (): [
  wandUndoIndex: number | undefined,
  urlSearch: string,
] => [useSelector(selectWandUndoIndex), useSelector(selectURLSearch)];

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

const selectIsHealthUsed = createSelector(selectWandState, (wandState) =>
  wandState.spellIds.some((spellId) => isUsesHealthActionId(spellId)),
);
export const useIsHealthUsed = () => useSelector(selectIsHealthUsed) ?? false;

const selectIsGoldUsed = createSelector(selectWandState, (wandState) =>
  wandState.spellIds.some((spellId) => isUsesGoldActionId(spellId)),
);
export const useIsGoldUsed = () => useSelector(selectIsGoldUsed) ?? false;

const selectIsRandomUsed = createSelector(selectWandState, (wandState) =>
  wandState.spellIds.some((spellId) => isUsesRandomActionId(spellId)),
);
export const useIsRandomUsed = () => useSelector(selectIsRandomUsed) ?? false;

const selectIsRequirementUsed = createSelector(
  selectWandState,
  (wandState) => ({
    halfUsed: wandState.spellIds.some((spellId) =>
      isUsesRequirementHalf(spellId),
    ),
    hpUsed: wandState.spellIds.some((spellId) => isUsesRequirementHp(spellId)),
    enemyUsed: wandState.spellIds.some((spellId) =>
      isUsesRequirementEnemy(spellId),
    ),
    projectileUsed: wandState.spellIds.some((spellId) =>
      isUsesRequirementProjectile(spellId),
    ),
  }),
);
export const useIsRequirementUsed = () =>
  useSelector(selectIsRequirementUsed) ?? {
    halfUsed: false,
    hpUsed: false,
    enemyUsed: false,
    projectileUsed: false,
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
  selectSpellLayout,
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

const selectEditorState = (state: RootState) => state.editor;

const selectSelections = createSelector(
  selectEditorState,
  selectSpellLayout,
  ({ selectFrom, selectTo }, spellIds): WandSelectionSet[] =>
    spellIds.map((_, wandIndex) =>
      getSelectionForWandIndex(wandIndex, selectFrom, selectTo),
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
  return enableSelection &&
    isMainWandIndex(wandIndex) &&
    isNotUndefined(selections[wandIndex])
    ? selections[wandIndex][location]
    : defaultWandSelection;
};

const selectSelecting = createSelector(
  selectEditorState,
  ({ selectFrom }): boolean => selectFrom !== null,
);

export const useSelecting = () => useSelector(selectSelecting);

export const useEditMode = (): EditMode => {
  // const { shift, alt, ctrl, meta } = useKeyState();
  // const { 'editor.swapOnMove': swapOnMove } = useConfig();

  return {
    insert: /* shift, */ 'push' /* pull, */,
    direction: /*left, */ 'right',
    replace: 'swap' /* replace, shift, push, pull */,
    overflow: 'truncate' /*, virtual, expand, forbid */,
    delete: 'blank' /* shift */,
    cursor: 'fixed' /*, follow */,
  };
};

///****************************************/
//**            resultSlice             **/
/****************************************/

export const selectLastResultState = (state: RootState) => state.result.last;

export const useLatestResult = () => {
  return useAppSelector(selectLastResultState);
};
export const useCastLookup = () => {
  const { casts } = useAppSelector(selectLastResultState);
  return useMemo(() => new Map(casts.map((cast) => [cast.id, cast])), [casts]);
};

export const useCast = (castId: WandCastId) => useCastLookup().get(castId);
