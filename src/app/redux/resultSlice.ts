import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type {
  ClickWandResult,
  SerializedClickWandResult,
} from '../calc/eval/clickWand';
import { useSliceWrapper } from './useSlice';
import type { SpellId } from './Wand/spellId';
import type { Wand } from './Wand/wand';
import { defaultWand } from './Wand/presets';

export type ResultState = {
  last: SerializedClickWandResult;
  lastWand: Wand;
  lastSpellIds: SpellId[];
  lastAlwaysIds: SpellId[];
  lastZetaId?: SpellId;
};

const initialState: ResultState = {
  last: {
    shots: [],
    reloadTime: undefined,
    endConditions: [],
    elapsedTime: 0,
    wraps: 0,
    shotCount: 0,
    reloadCount: 0,
    refreshCount: 0,
    repeatCount: 0,
  },
  lastWand: defaultWand,
  lastSpellIds: [],
  lastZetaId: null,
  lastAlwaysIds: [],
} as const;

export const resultSlice = createSlice({
  name: 'result',
  initialState,
  reducers: {
    resetResult: () => {
      return initialState;
    },
    newSimulation: (
      state,
      {
        payload: {
          wandState: { spellIds, alwaysIds, zetaId, wand },
        },
      }: PayloadAction<{
        wandState: {
          spellIds: SpellId[];
          alwaysIds: SpellId[];
          zetaId?: SpellId;
          wand: Wand;
        };
      }>,
    ) => {
      console.log('simulaton started:', spellIds);

      state.lastAlwaysIds = alwaysIds;
      state.lastSpellIds = spellIds;
      state.lastZetaId = zetaId;
      state.lastWand = wand;
    },
    newResult: (
      state,
      {
        payload: { result },
      }: PayloadAction<{
        result: SerializedClickWandResult;
      }>,
    ) => {
      console.log('serialized result:', result);

      state.last = result;
    },
  },
});

export const { resetResult, newResult, newSimulation } = resultSlice.actions;

export const resultReducer = resultSlice.reducer;

export const useResultSlice = () => useSliceWrapper(resultSlice, 'result');
