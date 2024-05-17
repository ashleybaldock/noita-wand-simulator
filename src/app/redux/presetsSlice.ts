import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type { Preset, PresetGroup } from './Wand/preset';
import { defaultPresets } from './Wand/presets';

// Define a type for the slice state
interface PresetsState {
  presets: PresetGroup[];
}

// Define the initial state using that type
const initialState: PresetsState = {
  presets: defaultPresets,
};

export const presetsSlice = createSlice({
  name: 'presets',
  initialState,
  reducers: {
    setPresets: (state, action: PayloadAction<PresetGroup[]>) => {
      state.presets = action.payload;
    },
  },
});

export const { setPresets } = presetsSlice.actions;

export const presetsReducer = presetsSlice.reducer;
