import type { Action, ThunkAction } from '@reduxjs/toolkit';
import { configureStore } from '@reduxjs/toolkit';
import undoable from 'redux-undo';
import { wandReducer } from './wandSlice';
import { presetsReducer } from './presetsSlice';
import { configReducer } from './configSlice';
import { editorReducer } from './editorSlice';
import { uiReducer } from './uiSlice';
import { listenerMiddleware, startAppListening } from './listenerMiddleware';
import type { WandState } from './Wand/wandState';
import { resultReducer } from './resultSlice';
import { startUpdateListener } from './updateResultListener';

export const store = configureStore({
  reducer: {
    wand: undoable<WandState, Action>(wandReducer, { limit: 200 }),
    presets: presetsReducer,
    config: configReducer,
    editor: editorReducer,
    ui: uiReducer,
    result: resultReducer,
  },

  middleware: (getDefaultMiddleware) => {
    startUpdateListener(startAppListening);
    return getDefaultMiddleware().prepend(listenerMiddleware.middleware);
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
