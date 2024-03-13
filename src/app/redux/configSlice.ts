import type { PayloadAction } from '@reduxjs/toolkit';
import type { UnlockCondition } from '../calc/unlocks';
import { unlockConditions } from '../calc/unlocks';
import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import { loadState, saveState } from '../localStorage';
import { startAppListening } from './listenerMiddleware';
import type { WritableDraft } from 'immer/dist/internal';
import { objectFromKeys } from '../util';
import type { KeyOfType } from '../util';

type ConfigBase = {
  condenseShots: boolean;
  unlimitedSpells: boolean;
  infiniteSpells: boolean;
  infiniteMoney: boolean;
  infiniteHp: boolean;
  showDivides: boolean;
  showGreekSpells: boolean;
  showDirectActionCalls: boolean;
  showDeckIndexes: boolean;
  showRecursion: boolean;
  showProxies: boolean;
  showSources: boolean;
  showDontDraw: boolean;
  swapOnMove: boolean;
  showActionTree: boolean;
  showWraps: boolean;
  showDraw: boolean;
  showSpellsInCategories: boolean;
  showBeta: boolean;
  showExtra: boolean;
  castShowChanged: boolean;
  showDurationsInFrames: boolean;
  var_money: number;
  var_hp: number;
  var_hp_max: number;
  pauseCalculations: boolean;
  endSimulationOnShotCount: number;
  endSimulationOnReloadCount: number;
  endSimulationOnRefreshCount: number;
  endSimulationOnRepeatCount: number;
  limitSimulationIterations: number;
  limitSimulationDuration: number;
  hideAccessibilityHints: boolean;
};
export type ConfigRandom = {
  'random.worldSeed': number;
  'random.frameNumber': number;
};
export type ConfigDebug = {
  'debug.dragHint': boolean;
  'debug.keyHints': boolean;
};
export type ConfigRequirements = {
  'requirements.enemies': boolean;
  'requirements.projectiles': boolean;
  'requirements.hp': boolean;
  'requirements.half': boolean;
};

export type ConfigUnlockCondition = {
  [U in UnlockCondition]: boolean;
};

export type Config = ConfigBase &
  ConfigRequirements &
  ConfigRandom &
  ConfigDebug &
  ConfigUnlockCondition;

export type ConfigSection = 'unlocks' | 'requirements' | 'debug' | 'random';

const unlocksFalse = objectFromKeys(unlockConditions, false);
const unlocksTrue = objectFromKeys(unlockConditions, true);

export type ConfigField = keyof Config;
export type ConfigToggleField = KeyOfType<Config, boolean>;
export type ConfigBooleanField = KeyOfType<Config, boolean>;
export type ConfigNumberField = KeyOfType<Config, number>;

// Define a type for the slice state
export interface ConfigState {
  config: Config;
}

// Define the initial state using that type
export const initialState: ConfigState = {
  config: {
    ...unlocksFalse,
    'debug.dragHint': false,
    'debug.keyHints': false,
    'condenseShots': true,
    'unlimitedSpells': true,
    'infiniteSpells': true,
    'infiniteMoney': true,
    'infiniteHp': true,
    'showDivides': true,
    'showGreekSpells': true,
    'showDirectActionCalls': true,
    'showDeckIndexes': true,
    'showRecursion': true,
    'showProxies': true,
    'showSources': true,
    'showDontDraw': true,
    'swapOnMove': true,
    'showActionTree': true,
    'showWraps': true,
    'showDraw': true,
    'showSpellsInCategories': true,
    'endSimulationOnShotCount': 0,
    'endSimulationOnReloadCount': 0,
    'endSimulationOnRefreshCount': 1,
    'endSimulationOnRepeatCount': 0,
    'limitSimulationIterations': 10,
    'limitSimulationDuration': 10,
    'showBeta': true,
    'showExtra': false,
    'castShowChanged': true,
    'showDurationsInFrames': false,
    'var_money': 10000,
    'var_hp': 100,
    'var_hp_max': 100,
    'requirements.enemies': false,
    'requirements.projectiles': false,
    'requirements.hp': false,
    'requirements.half': false,
    'random.worldSeed': 0,
    'random.frameNumber': 0,
    'pauseCalculations': false,
    'hideAccessibilityHints': false,
  },
};

export const configSlice = createSlice({
  name: 'config',
  initialState: () => loadState(initialState),
  reducers: {
    updateConfig: (
      state,
      action: PayloadAction<Partial<ConfigState['config']>>,
    ) => {
      state.config = { ...state.config, ...action.payload };
    },
    setConfigSetting: <T extends Config[N], N extends KeyOfType<Config, T>>(
      state: WritableDraft<ConfigState>,
      { payload: { name, newValue } }: PayloadAction<{ name: N; newValue: T }>,
    ) => {
      state.config[name] = newValue;
    },
    toggleConfigSetting: (
      state,
      { payload: { name } }: PayloadAction<{ name: ConfigToggleField }>,
    ) => {
      state.config[name] = !state.config[name];
    },
    enableAllUnlocks: (state) => {
      state.config = {
        ...state.config,
        ...unlocksTrue,
      };
    },
    disableAllUnlocks: (state) => {
      state.config = {
        ...state.config,
        ...unlocksFalse,
      };
    },
  },
});

export const {
  toggleConfigSetting,
  setConfigSetting,
  updateConfig,
  enableAllUnlocks,
  disableAllUnlocks,
} = configSlice.actions;

export const configReducer = configSlice.reducer;

/* Save config to localStorage on change */
startAppListening({
  matcher: isAnyOf(
    updateConfig,
    toggleConfigSetting,
    disableAllUnlocks,
    enableAllUnlocks,
    setConfigSetting,
  ),
  effect: (_action, listenerApi) => {
    saveState(listenerApi.getState().config);
  },
});
// TODO - when time permits, finish this refactor
//
// export type ConfigGroupName = {
//   [k in keyof Config]: Config[k] extends object ? k : never;
// }[keyof Config];

// export type NestedKeyOf<T, K = keyof T> = K extends keyof T & string
//   ? `${K}` | (T[K] extends object ? `${K}.${NestedKeyOf<T[K]>}` : never)
//   : never;

// export type PathValue<T, P extends NestedKeyOf<T>> = T extends object
//   ? P extends `${infer K}.${infer R}`
//     ? K extends keyof T
//       ? R extends NestedKeyOf<T[K]>
//         ? PathValue<T[K], R>
//         : never
//       : never
//     : P extends keyof T
//     ? T[P]
//     : never
//   : never;
// export type NestedConfigPath = Exclude<NestedKeyOf<Config>, keyof Config>;
// export type ConfigPath = disableAllUnlocks<NestedKeyOf<Config>, ConfigGroupField>;

// type ConfigPathValue = PathValue<Config, ConfigPath>;
// type ConfigMapping = {
// [Path in ConfigPath]: PathValue<Config, Path>;
// };

// const prefixedUnion = (prefix: ConfigSection, keys: Array<>) => {
//   const mapped = unlockConditions
//     .map((unlockCondition) => `${'unlocks'}.${unlockCondition}`)
//     .filter((mapped) => isPrefixed(mapped));
//   return mapped;
// };
// export type PrefixedConfig<
//   Source extends string,
//   Prefix extends ConfigSection,
// > = {
//   [U in Source as `${Prefix}.${U}`]
// };
//
//
//
//
//
//
// type PrefixedFlags<Flags extends string, Prefix extends ConfigSection> = {
// [F in Flags as `${Prefix}.${F}`]: boolean;
// };

// export type PrefixedUnlockCondition = `unlocks.${UnlockCondition}`;
// export type Prefixed<T extends UnlockCondition> = `unlocks.${T}`;

// type PrefixedConfigUnlock = PrefixedFlags<
//   (typeof unlockConditions)[number],
//   'unlocks'
// >;
// export type PrefixedConfigUnlockKey = keyof PrefixedConfigUnlock;

// export const configUnlocks = unlockConditions.map(
// <T extends UnlockCondition>(unlockCondition: T): Prefixed<T> =>
// `${'unlocks'}.${unlockCondition}`,
// );

// export type ConfigUnlock = (typeof configUnlocks)[number];

// export type ConfigUnlockBoolean = {
//   [U in ConfigUnlock]: boolean;
// };

// const objectWithBooleanKeys = <
//   const T extends ReadonlyArray<string | number>,
//   P extends ConfigSection,
// >(
//   keys: T,
//   prefix: P,
//   defaultTo: boolean = false,
// ): { [K in T[number] as `${typeof prefix}.${K}`]: boolean } => {
//   return Object.fromEntries(keys.map((k) => [k, defaultTo])) as {
//     [K in T[number] as `${typeof prefix}.${K}`]: boolean;
//   };
// };

// const keyToPrefixedKey = <
//   TA extends string,
//   T extends ReadonlyArray<TA>,
//   P extends ConfigSection,
// >(
//   keys: T,
//   prefix: P,
// ): { [K in T[number]]: `${typeof prefix}.${K}` } => {
//   return keys.map((k) => k) as {
//     [K in T[number]]: `${typeof prefix}.${K}`;
//   };
// };

// export const configUnlockConditions = keyToPrefixedKey(
//   unlockConditions,
//   'unlocks',
// );
