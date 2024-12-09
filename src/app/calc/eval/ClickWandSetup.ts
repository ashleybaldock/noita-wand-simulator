import type { Gun } from '../gun';
import type { SimulationRequestId } from '../../redux/SimulationRequest';
import type { SpellId } from '../../redux/Wand/spellId';

export type ClickWandSetup = {
  simulationRequestId: SimulationRequestId;
  wand: Readonly<Gun>;
  spellIds: Readonly<SpellId>[];
  alwaysCastSpellIds: Readonly<SpellId>[];
  zetaSpellId?: Readonly<SpellId>;
  req_enemies: boolean;
  req_projectiles: boolean;
  req_hp: boolean;
  req_half: boolean;
  rng_frameNumber: number;
  rng_worldSeed: number;
  wand_available_mana: number;
  wand_cast_delay: number;
  endSimulationOnShotCount: number;
  endSimulationOnReloadCount: number;
  endSimulationOnRefreshCount: number;
  // endSimulationOnRepeatCount: number;
  limitSimulationIterations: number;
  limitSimulationDuration: number;
};
