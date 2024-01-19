import type { ThunkAction } from '@reduxjs/toolkit';
import type { Action } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import undoable from 'redux-undo';
import { wandReducer } from './wandSlice';
import { presetsReducer } from './presetsSlice';
import { configReducer } from './configSlice';
import { editorReducer } from './editorSlice';

export const store = configureStore({
  reducer: {
    wand: undoable(wandReducer),
    presets: presetsReducer,
    config: configReducer,
    editor: editorReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action
>;
