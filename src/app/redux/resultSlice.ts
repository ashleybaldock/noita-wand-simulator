import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { useSliceWrapper } from './useSlice';
import type { SpellId } from './Wand/spellId';
import type { Wand } from './Wand/wand';
import { defaultWand } from './Wand/presets';
import type { SimulationRequestId, SimulationStats } from './SimulationRequest';
import { getEmptySimulationStats } from './SimulationRequest';
import { isNotNullOrUndefined } from '../util';
import type { SerializedClickWandResult } from '../calc/eval/clickWand';

export type ResultState = {
  stats: SimulationStats;
  lastSimulationRequested: SimulationRequestId | null;
  lastSimulationCompleted: SimulationRequestId | null;
  last: SerializedClickWandResult;
  lastWand: Wand;
  lastSpellIds: SpellId[];
  lastAlwaysIds: SpellId[];
  lastZetaId?: SpellId;
};

const initialState: ResultState = {
  stats: getEmptySimulationStats(),
  lastSimulationRequested: null,
  lastSimulationCompleted: null,
  last: {
    simulationRequestId: 0,
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
          simulationRequestId,
          wandState: { spellIds, alwaysIds, zetaId, wand },
        },
      }: PayloadAction<{
        simulationRequestId: SimulationRequestId;
        wandState: {
          spellIds: SpellId[];
          alwaysIds: SpellId[];
          zetaId?: SpellId;
          wand: Wand;
        };
      }>,
    ) => {
      console.debug(
        `new simulation requested, requestId: ${simulationRequestId} , spells:`,
        spellIds,
      );

      state.lastSimulationRequested = simulationRequestId;

      state.lastSpellIds = spellIds;
      state.lastAlwaysIds = alwaysIds;
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
      // console.log('serialized result:', result);

      if (
        isNotNullOrUndefined(state.lastSimulationCompleted) &&
        state.lastSimulationCompleted >= result.simulationRequestId
      ) {
        console.warn(
          `Igoring result for stale simulation request (id:${result.simulationRequestId})`,
        );
        state.stats.failed += 1;
        return;
      }

      state.lastSimulationCompleted = result.simulationRequestId;
      state.last = result;
    },
  },
});

export const { resetResult, newResult, newSimulation } = resultSlice.actions;

export const resultReducer = resultSlice.reducer;

export const useResultSlice = () => useSliceWrapper(resultSlice, 'result');
