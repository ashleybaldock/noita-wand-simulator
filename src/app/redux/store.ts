import type { ThunkAction } from '@reduxjs/toolkit';
import type { AnyAction } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import undoable from 'redux-undo';
import { wandReducer } from './wandSlice';
import { presetsReducer } from './presetsSlice';
import { configReducer } from './configSlice';
import { editorReducer } from './editorSlice';
import { uiReducer } from './uiSlice';
import { listenerMiddleware } from './listenerMiddleware';
import type { WandState } from './Wand/wandState';

export const store = configureStore({
  reducer: {
    wand: undoable<WandState, AnyAction>(wandReducer, { limit: 200 }),
    presets: presetsReducer,
    config: configReducer,
    editor: editorReducer,
    ui: uiReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(listenerMiddleware.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  AnyAction
>;
