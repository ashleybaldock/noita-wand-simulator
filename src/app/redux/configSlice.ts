import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { useAppSelector } from './hooks';
import { RootState } from './store';
import { loadState } from '../localStorage';
import { useSelector } from 'react-redux';
import { NestedKeyOf } from '../util/types';

// Define a type for the slice state
export interface ConfigState {
  results: {
    test: string;
    showDivides: boolean;
    showGreekSpells: boolean;
    showDirectActionCalls: boolean;
    showDeckIndexes: boolean;
    showRecursion: boolean;
    showIteration: boolean;
    showProxies: boolean;
    showSources: boolean;
    showDontDraw: boolean;
    condenseShots: boolean;
    endSimulationOnRefresh: boolean;
  };
  ui: {
    showActionTree: boolean;
    pauseCalculations: boolean;
    swapOnMove: boolean;
    showSpellsInCategories: boolean;
    showBeta: boolean;
  };
  unlocks: {
    [key: string]: boolean;
  };
  world: {
    unlimitedSpells: boolean;
    infiniteSpells: boolean;
    infiniteMoney: boolean;
    infiniteHp: boolean;
    var_money: number;
    var_hp: number;
    var_hp_max: number;
    worldSeed: number;
    frameNumber: number;
  };
  requirements: {
    enemies: boolean;
    projectiles: boolean;
    hp: boolean;
    half: boolean;
  };
}

// Define the initial state using that type
export const initialState: ConfigState = {
  results: {
    test: '',
    showDivides: true,
    showGreekSpells: true,
    showDirectActionCalls: true,
    showDeckIndexes: true,
    showRecursion: true,
    showIteration: true,
    showProxies: true,
    showSources: true,
    showDontDraw: true,
    condenseShots: true,
    endSimulationOnRefresh: true,
  },
  ui: {
    pauseCalculations: false,
    swapOnMove: true,
    showBeta: true,
    showSpellsInCategories: true,
    showActionTree: true,
  },
  unlocks: {
    card_unlocked_black_hole: false,
    card_unlocked_everything: false,
    card_unlocked_exploding_deer: false,
    card_unlocked_tentacle: false,
    card_unlocked_spiral_shot: false,
    card_unlocked_funky: false,
    card_unlocked_bomb_holy: false,
    card_unlocked_bomb_holy_giga: false,
    card_unlocked_crumbling_earth: false,
    card_unlocked_material_cement: false,
    card_unlocked_nuke: false,
    card_unlocked_nukegiga: false,
    card_unlocked_firework: false,
    card_unlocked_destruction: false,
    card_unlocked_musicbox: false,
    card_unlocked_pyramid: false,
    card_unlocked_maths: false,
    card_unlocked_mestari: false,
    card_unlocked_necromancy: false,
    card_unlocked_sea_lava: false,
    card_unlocked_cloud_thunder: false,
    card_unlocked_dragon: false,
    card_unlocked_ocarina: false,
    card_unlocked_kantele: false,
    card_unlocked_alchemy: false,
    card_unlocked_duplicate: false,
    card_unlocked_divide: false,
    card_unlocked_rain: false,
    card_unlocked_paint: false,
    card_unlocked_rainbow_trail: false,
    card_unlocked_homing_wand: false,
    card_unlocked_fish: false,
  },
  world: {
    unlimitedSpells: true,
    infiniteSpells: true,
    infiniteMoney: true,
    infiniteHp: true,
    var_money: 10000,
    var_hp: 100,
    var_hp_max: 100,
    worldSeed: 0,
    frameNumber: 0,
  },
  requirements: {
    enemies: false,
    projectiles: false,
    hp: false,
    half: false,
  },
};

export const configSlice = createSlice({
  name: 'config',
  initialState: () => loadState(initialState),
  reducers: {
    updateConfig: (state, action: PayloadAction<Partial<ConfigState>>) => {
      state = { ...state, ...action.payload };
    },
    updateKey: (state, action) => {},
  },
});

type ConfigSection = keyof ConfigState;

export type ConfigItemPath = Exclude<NestedKeyOf<ConfigState>, ConfigSection>;

function getConfigItem<ConfigState>(object: ConfigState, path: ConfigItemPath) {
  const keys = path.split('.');
  let result = object;
  for (const key of keys) {
    result = result[key];
  }
  return result;
}

type Vals<T> = T[keyof T];

// export type PathValue<T, P extends NestedKeyOf<T>> = T extends Object
//   ? P extends `${infer K}.${infer R}`
//     ? K extends keyof T
//       ? R extends NestedKeyOf<T[K]>
//         ? [P, PathValue<T[K], R>[1]]
//         : never
//       : never
//     : P extends keyof T
//       ? [P, T[P]]
//       : never
//   : never;

export type PathValue<T, P extends NestedKeyOf<T>> = T extends Object
  ? P extends `${infer K}.${infer R}`
    ? K extends keyof T
      ? R extends NestedKeyOf<T[K]>
        ? PathValue<T[K], R>
        : never
      : never
    : P extends keyof T
      ? T[P]
      : never
  : never;


type ConfigItemPathTypes = PathValue<ConfigState, ConfigItemPath>;
type ConfigMapping = {
  [ConfigItemPathType in ConfigItemPath]: PathValue<ConfigState, ConfigItemPathType>
}

export const { updateConfig } = configSlice.actions;

export const selectConfig = (state: RootState): ConfigState => state.config;

const selectResults = (state: RootState) => state.config.results;
const selectUnlocks = (state: RootState) => state.config.unlocks;
const selectUIConfig = (state: RootState) => state.config.ui;
const selectWorld = (state: RootState) => state.config.world;
const selectRequirements = (state: RootState) => state.config.requirements;

type ConfigField<T> = {
  path: ConfigItemPath;
  displayName: string;
  type: 'boolean' | 'string' | 'number';
  get: (config: ConfigState['config']) => T;
  set: (config: ConfigState['config'], v: T) => void;
};

export function useConfig(
  path: ConfigItemPath,
): ConfigState[ConfigSection] {

  return {
    useAppSelector(selectConfig)[section];
  };
}

// function useConfig<T>(
//   section: keyof ConfigState
// ): {
//   return useSelector(ConfigState[section]);
// }

export const useResultsConfig = () => useSelector(selectResults);
export const useWorldConfig = () => useSelector(selectWorld);
export const useFeatureConfig = () => useSelector(selectUnlocks);
export const useUIConfig = () => useSelector(selectUIConfig);
export const useRequirementsConfig = () => useSelector(selectRequirements);

export const configReducer = configSlice.reducer;
