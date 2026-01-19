import { defaultWand } from '../../redux/Wand/presets';
import type { SpellId } from '../../redux/Wand/spellId';
import type { Gun } from '../gun';

export type SimulationConfig = {
  wand: Readonly<Gun>;
  spellIds: Readonly<SpellId>[];
  alwaysCastSpellIds: Readonly<SpellId>[];
  zetaSpellId?: Readonly<SpellId>;
  wand_cast_delay: number;
  wand_available_mana: number;
  rng_worldSeed: number;
  rng_frameNumber: number;
  req_half: boolean;
  req_hp: boolean;
  req_projectiles: boolean;
  req_enemies: boolean;
  endSimulationOnCastCount?: number;
  endSimulationOnReloadCount?: number;
  endSimulationOnRefreshCount?: number;
  limitSimulationIterations?: number;
  limitSimulationDuration?: number;
};

export const defaultSimulationConfig: SimulationConfig = {
  wand: { ...defaultWand },
  spellIds: [],
  alwaysCastSpellIds: [],
  zetaSpellId: undefined,
  wand_cast_delay: defaultWand.cast_delay,
  wand_available_mana: 1000,
  rng_worldSeed: 0,
  rng_frameNumber: 1,
  req_half: false,
  req_hp: false,
  req_projectiles: false,
  req_enemies: false,
  endSimulationOnCastCount: 30,
  endSimulationOnReloadCount: 1,
  endSimulationOnRefreshCount: 2,
  limitSimulationIterations: 200,
  limitSimulationDuration: 5000,
};

export const mergeSimulationConfigDefaults = (
  startingState: Partial<SimulationConfig>,
): Readonly<SimulationConfig> => ({
  ...defaultSimulationConfig,
  ...startingState,
});
