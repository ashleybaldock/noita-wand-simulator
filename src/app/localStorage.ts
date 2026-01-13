import type { ConfigState } from './redux/configSlice';

export const loadState = (defaultState: ConfigState): ConfigState => {
  try {
    const serializedState = localStorage.getItem('state');
    if (serializedState === null) {
      console.info('Saved state not found in LocalStorage, using default');
      return defaultState;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.warn('loadState - error loading from localstorage', err);
    return defaultState;
  }
};

export const saveState = (state: ConfigState) => {
  try {
    console.warn('writing state to localstorage', state);
    const serializedState = JSON.stringify(state);
    localStorage.setItem('state', serializedState);
  } catch (err) {
    console.warn('saveState - error writing to localstorage', err);
  }
};
