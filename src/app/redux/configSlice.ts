import type { PayloadAction, WritableDraft } from '@reduxjs/toolkit';
import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import type { UnlockCondition } from '../calc/unlocks';
import { unlockConditions, unlockInfo } from '../calc/unlocks';
import { loadState, saveState } from '../localStorage';
import type { KeyOfType } from '../util';
import { objectEntries, objectFromKeys, objectKeys } from '../util';
import { startAppListening } from './listenerMiddleware';
import type { Tip } from '../components/Tooltips/tooltipId';

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
  showIteration: boolean;
  showProxies: boolean;
  showSources: boolean;
  showDontDraw: boolean;
  showActionTree: boolean;
  showWraps: boolean;
  showDraw: boolean;
  showSpellsInCategories: boolean;
  showLockedSpellPlaceholders: boolean;
  showExtra: boolean;
  showChargeUsage: boolean;
  castShowChanged: boolean;
  showDurationsInFrames: boolean;
  var_money: number;
  var_hp: number;
  var_hp_max: number;
  pauseCalculations: boolean;
  endSimulationOnCastCount: number;
  endSimulationOnReloadCount: number;
  endSimulationOnRefreshCount: number;
  endSimulationOnRepeatCount: number;
  limitSimulationIterations: number;
  limitSimulationDuration: number;
  hideAccessibilityHints: boolean;
  mirrorControls: boolean;
  swapOnMove: boolean;
};
export type ConfigEditing = {
  'editor.swapOnMove': boolean;
  'editor.enableSelection': boolean;
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
  ConfigEditing &
  ConfigDebug &
  ConfigUnlockCondition;

export type ConfigSection = 'unlocks' | 'requirements' | 'debug' | 'random';

const unlocksFalse = objectFromKeys(unlockConditions, false);
const unlocksTrue = objectFromKeys(unlockConditions, true);

export type ConfigInfo = {
  readonly name: string;
  readonly tip?: Tip;
  readonly group?: string;
  readonly customYes?: string;
  readonly customNo?: string;
};

export const configInfoDefinition: Record<keyof Config, ConfigInfo> = {
  ...unlockInfo,
  condenseShots: {
    name: 'Combine Repeated Actions',
  },
  unlimitedSpells: {
    name: 'Unlimited Spells',
    tip: { kind: 'uihint', id: 'unlimited_spells' },
  },
  infiniteSpells: {
    name: 'Ignore spell charge limits',
  },
  infiniteMoney: {
    name: 'Infinte Gold',
  },
  infiniteHp: {
    name: 'Infinite Hp considered to be ∞',
  },
  showDivides: {
    name: 'Show Divide By Spells',
  },
  showGreekSpells: {
    name: 'Show Greek Spells',
  },
  showDirectActionCalls: {
    name: 'Show Direct Action Calls',
  },
  showDeckIndexes: {
    name: 'Show Deck Indexes',
  },
  showRecursion: {
    name: 'Show Recursion',
    tip: { kind: 'uihint', id: 'Reursion ' },
  },
  showIteration: {
    name: 'Show Iteration',
    tip: { kind: 'uihint', id: 'ActionProxyAnnotation' },
  },
  showProxies: {
    name: 'Show Projectile Proxies',
    tip: { kind: 'uihint', id: 'ActionProxyAnnotation' },
  },
  showSources: {
    name: 'Show Action Sources',
    tip: { kind: 'uihint', id: 'ActionSourceAnnotation' },
  },
  showDontDraw: {
    name: 'Show Draw Inhibition',
    tip: { kind: 'uihint', id: 'DontDrawAnnotation' },
  },
  showActionTree: {
    name: 'Show Action Tree',
  },
  showWraps: {
    name: 'Show where wand wraps happen',
    tip: { kind: 'uihint', id: 'WrapAnnotation' },
  },
  showDraw: {
    name: 'Show draw',
    tip: { kind: 'uihint', id: 'DrawAnnotation' },
  },
  showSpellsInCategories: {
    name: 'Show Spells in Categories',
  },
  showLockedSpellPlaceholders: {
    name: 'Display placeholder for locked spells',
  },
  showExtra: {
    name: 'Show Debug Spells',
  },
  showChargeUsage: {
    name: 'Highlight spells that consume charges',
  },
  castShowChanged: {
    name: 'Hide Unaltered State Variables',
  },
  showDurationsInFrames: {
    name: 'Show Durations in Frames',
  },
  var_money: {
    name: 'Amount of money to use for spells that consider it',
  },
  var_hp: {
    name: 'Amount of hp to use for spells that consider it',
  },
  var_hp_max: {
    name: 'Max hp value to use for spells that consider it',
  },
  pauseCalculations: {
    name: 'Pause Simulation',
  },
  endSimulationOnCastCount: {
    name: 'End after this many casts',
  },
  endSimulationOnReloadCount: {
    name: 'End after this many reloads',
  },
  endSimulationOnRefreshCount: {
    name: 'End after this many calls of Wand Refresh',
  },
  endSimulationOnRepeatCount: {
    name: 'End when wand starts to repeat',
  },
  limitSimulationIterations: {
    name: 'End after this many simulation iterations',
  },
  limitSimulationDuration: {
    name: 'Limit total runtime of each simulation',
  },
  hideAccessibilityHints: {
    name: 'Hide hints on input fields',
  },
  mirrorControls: {
    name: 'UI elements swap sides',
  },
  swapOnMove: {
    name: 'Swap Spell Position on move',
  },
  'requirements.enemies': {
    name: 'requirement enemies',
  },
  'requirements.projectiles': {
    name: 'requirement projectiles',
  },
  'requirements.hp': {
    name: 'requirement hp',
  },
  'requirements.half': {
    name: 'requirement every other',
  },
  'random.worldSeed': {
    name: 'world seed value given to spells that request it',
  },
  'random.frameNumber': {
    name: 'frame number value given to spells that request it',
  },
  'editor.swapOnMove': {
    name: 'Swap Spell Position on move',
  },
  'editor.enableSelection': {
    name: 'Enable Selection',
  },
  'debug.dragHint': {
    name: 'Debug: Show hints when dragging',
  },
  'debug.keyHints': {
    name: 'Debug: Show key hints',
  },
} as const;

export type ConfigInfoRecord = Record<keyof Config, ConfigInfo>;

const configInfoRecord = configInfoDefinition as ConfigInfoRecord;

export const configInfoMap = new Map<keyof Config, ConfigInfo>([
  ...objectEntries(configInfoRecord),
]);

export const configAffectsSimulation: Record<keyof Config, boolean> = {
  card_unlocked_alchemy: false,
  card_unlocked_black_hole: false,
  card_unlocked_bomb_holy: false,
  card_unlocked_bomb_holy_giga: false,
  card_unlocked_cessation: false,
  card_unlocked_cloud_thunder: false,
  card_unlocked_crumbling_earth: false,
  card_unlocked_destruction: false,
  card_unlocked_divide: false,
  card_unlocked_dragon: false,
  card_unlocked_duplicate: false,
  card_unlocked_everything: false,
  card_unlocked_exploding_deer: false,
  card_unlocked_firework: false,
  card_unlocked_fish: false,
  card_unlocked_funky: false,
  card_unlocked_homing_wand: false,
  card_unlocked_kantele: false,
  card_unlocked_material_cement: false,
  card_unlocked_maths: false,
  card_unlocked_mestari: false,
  card_unlocked_musicbox: false,
  card_unlocked_necromancy: false,
  card_unlocked_nuke: false,
  card_unlocked_nukegiga: false,
  card_unlocked_ocarina: false,
  card_unlocked_paint: false,
  card_unlocked_piss: false,
  card_unlocked_polymorph: false,
  card_unlocked_pyramid: false,
  card_unlocked_rain: false,
  card_unlocked_rainbow_trail: false,
  card_unlocked_sea_lava: false,
  card_unlocked_sea_mimic: false,
  card_unlocked_spiral_shot: false,
  card_unlocked_tentacle: false,
  card_unlocked_touch_grass: false,
  condenseShots: false,
  unlimitedSpells: true,
  infiniteSpells: true,
  infiniteMoney: true,
  infiniteHp: true,
  showDivides: false,
  showGreekSpells: false,
  showDirectActionCalls: false,
  showDeckIndexes: false,
  showRecursion: false,
  showIteration: false,
  showProxies: false,
  showSources: false,
  showDontDraw: false,
  showActionTree: false,
  showWraps: false,
  showDraw: false,
  showSpellsInCategories: false,
  showLockedSpellPlaceholders: false,
  showExtra: false,
  showChargeUsage: false,
  castShowChanged: false,
  showDurationsInFrames: false,
  var_money: true,
  var_hp: true,
  var_hp_max: true,
  pauseCalculations: true,
  endSimulationOnCastCount: true,
  endSimulationOnReloadCount: true,
  endSimulationOnRefreshCount: true,
  endSimulationOnRepeatCount: true,
  limitSimulationIterations: true,
  limitSimulationDuration: true,
  hideAccessibilityHints: false,
  mirrorControls: false,
  swapOnMove: false,
  'requirements.enemies': true,
  'requirements.projectiles': true,
  'requirements.hp': true,
  'requirements.half': true,
  'random.worldSeed': true,
  'random.frameNumber': true,
  'editor.swapOnMove': false,
  'editor.enableSelection': false,
  'debug.dragHint': false,
  'debug.keyHints': false,
} as const;

const configKeysAffectingSimulation = objectKeys(
  configAffectsSimulation,
).filter((k) => configAffectsSimulation[k]);

export const configsMatchForSimulation = (a: Config, b: Config): boolean =>
  configKeysAffectingSimulation.every((key) => a[key] === b[key]);

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
    condenseShots: true,
    unlimitedSpells: true,
    infiniteSpells: true,
    infiniteMoney: true,
    infiniteHp: true,
    showDivides: true,
    showGreekSpells: true,
    showDirectActionCalls: true,
    showDeckIndexes: true,
    showRecursion: true,
    showIteration: true,
    showProxies: true,
    showSources: true,
    showDontDraw: true,
    swapOnMove: true,
    showActionTree: true,
    showWraps: true,
    showDraw: true,
    showSpellsInCategories: true,
    showLockedSpellPlaceholders: true,
    endSimulationOnCastCount: 0,
    endSimulationOnReloadCount: 0,
    endSimulationOnRefreshCount: 1,
    endSimulationOnRepeatCount: 0,
    limitSimulationIterations: 10,
    limitSimulationDuration: 10,
    showExtra: false,
    showChargeUsage: true,
    castShowChanged: true,
    showDurationsInFrames: false,
    var_money: 10000,
    var_hp: 100,
    var_hp_max: 100,
    'requirements.enemies': false,
    'requirements.projectiles': false,
    'requirements.hp': false,
    'requirements.half': false,
    'random.worldSeed': 0,
    'random.frameNumber': 0,
    pauseCalculations: false,
    hideAccessibilityHints: false,
    mirrorControls: false,
    'editor.swapOnMove': true,
    'editor.enableSelection': true,
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
