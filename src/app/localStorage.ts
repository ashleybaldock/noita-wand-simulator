import type { ConfigState } from './redux/configSlice';
import { tee } from './util';

export const saveState = ({ config }: ConfigState) => {
  console.info('writing state to localstorage', config);
  const serializedConfigState = JSON.stringify(config);
  try {
    localStorage.setItem('config', serializedConfigState);
  } catch (err) {
    console.warn('saveState - error writing to localstorage', err);
  }
  return serializedConfigState;
};

export const loadState = ({
  config: defaultConfig,
}: ConfigState): ConfigState => {
  try {
    const serializedConfigState =
      localStorage.getItem('config') ??
      saveState(
        tee.info(
          { config: defaultConfig },
          'Saved config not found in localstorage, using default',
        ),
      );
    return {
      config: { ...defaultConfig, ...JSON.parse(serializedConfigState) },
    };
  } catch (err) {
    console.warn('loadState - error loading config from localstorage', err);
    return { config: { ...defaultConfig } };
  }
};
