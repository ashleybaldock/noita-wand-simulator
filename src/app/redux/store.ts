import { configureStore } from '@reduxjs/toolkit';
import undoable from 'redux-undo';
import { wandReducer, selectWandState } from './wandSlice';
import { presetsReducer } from './presetsSlice';
import { configReducer } from './configSlice';
import { generateSearchFromWandState } from './Wand/toSearch';

export const store = configureStore({
  reducer: {
    wand: undoable(wandReducer),
    presets: presetsReducer,
    config: configReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export function observeStore<T>(
  select: (rootState: RootState) => T,
  onChange: (newState: T) => void,
) {
  let currentState: T;

  function handleChange() {
    const nextState = select(store.getState());
    if (nextState !== currentState) {
      currentState = nextState;
      onChange(currentState);
    }
  }

  const unsubscribe = store.subscribe(handleChange);
  handleChange();
  return unsubscribe;
}

observeStore(selectWandState, (state) => {
  const newSearch = generateSearchFromWandState(state);
  const currentSearch = window.location.search;

  if (currentSearch !== newSearch) {
    const url = new URL(window.location.href);
    url.search = newSearch;
    window.history.pushState({}, '', url.toString());
  }
});
