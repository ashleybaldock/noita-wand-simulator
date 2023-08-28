import { ConfigState } from './redux/configSlice';

export const loadState = (defaultState: ConfigState): ConfigState => {
  try {
    const serializedState = localStorage.getItem('state');
    if (serializedState === null) {
      return defaultState;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return defaultState;
  }
};

export const saveState = (state: ConfigState) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('state', serializedState);
  } catch (err) {
    // Ignore write errors.
  }
};
