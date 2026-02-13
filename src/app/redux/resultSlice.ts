import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { useSliceWrapper } from './useSlice';
import type { SpellId } from './Wand/spellId';
import type { Wand } from './Wand/wand';
import { defaultWand } from './Wand/presets';
import type { SimulationRequestId } from './SimulationRequestId';
import type { SimulationStats } from './SimulationStats';
import { getEmptySimulationStats } from './SimulationStats';
import { isNotNullOrUndefined } from '../util';
import type { SerializedSimulationResult } from '../calc/eval/clickWand';
import { defaultSimulationConfig } from '../calc/eval/SimulationConfig';

export type ResultState = {
  stats: SimulationStats;
  lastSimulationRequested: SimulationRequestId | null;
  lastSimulationCompleted: SimulationRequestId | null;
  lastStartTime: DOMHighResTimeStamp | null;
  lastEndTime: DOMHighResTimeStamp | null;
  last: SerializedSimulationResult;
  lastWand: Wand;
  lastSpellIds: SpellId[];
  lastAlwaysIds: SpellId[];
  lastZetaId?: SpellId;
};

const initialState: ResultState = {
  stats: getEmptySimulationStats(),
  lastSimulationRequested: null,
  lastSimulationCompleted: null,
  lastStartTime: null,
  lastEndTime: null,
  last: {
    initialState: defaultSimulationConfig,
    simulationRequestId: 0,
    salvos: [],
    casts: [],
    reloadTime: undefined,
    endConditions: [],
    elapsedTime: 0,
    wraps: 0,
    castCount: 0,
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
          startTime,
        },
      }: PayloadAction<{
        simulationRequestId: SimulationRequestId;
        wandState: {
          spellIds: SpellId[];
          alwaysIds: SpellId[];
          zetaId?: SpellId;
          wand: Wand;
        };
        startTime: DOMHighResTimeStamp;
      }>,
    ) => {
      console.debug(
        `new simulation requested, requestId: ${simulationRequestId} , spells:`,
        spellIds,
      );

      state.lastSimulationRequested = simulationRequestId;
      state.lastStartTime = startTime;

      state.lastSpellIds = spellIds;
      state.lastAlwaysIds = alwaysIds;
      state.lastZetaId = zetaId;
      state.lastWand = wand;
    },
    newResult: (
      state,
      {
        payload: { result, endTime },
      }: PayloadAction<{
        result: SerializedSimulationResult;
        endTime: DOMHighResTimeStamp;
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
      state.lastEndTime = endTime;
      state.last = result;
    },
  },
});

export const { resetResult, newResult, newSimulation } = resultSlice.actions;

export const resultReducer = resultSlice.reducer;

export const useResultSlice = () => useSliceWrapper(resultSlice, 'result');
