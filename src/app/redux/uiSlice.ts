import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type { KeyOfType } from '../util';

// Define a type for the slice state
export interface UIState {
  simulationRunning: boolean;
  showModalConfigEditor: boolean;
  showWandPresets: boolean;
  showKeyHints: boolean;
}

export type UIToggle = KeyOfType<UIState, boolean>;

// Define the initial state using that type
export const initialState: UIState = {
  simulationRunning: false,
  showModalConfigEditor: false,
  showWandPresets: false,
  showKeyHints: false,
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setUiToggle: (
      state,
      {
        payload: { name, newValue },
      }: PayloadAction<{ name: UIToggle; newValue: boolean }>,
    ) => {
      state[name] = newValue;
    },
    flipUiToggle: (
      state,
      { payload: { name } }: PayloadAction<{ name: UIToggle }>,
    ) => {
      state[name] = !state[name];
    },
  },
});

export const { setUiToggle, flipUiToggle } = uiSlice.actions;

export const uiReducer = uiSlice.reducer;
