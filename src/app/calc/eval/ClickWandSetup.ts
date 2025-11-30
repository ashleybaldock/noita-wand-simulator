import type { Gun } from '../gun';
import type { SimulationRequestId } from '../../redux/SimulationRequest';
import type { SpellId } from '../../redux/Wand/spellId';
import type { InitialSimulationStateConfig } from './InitialStateConfig';

export type SimulationConfig = InitialSimulationStateConfig & {
  simulationRequestId: SimulationRequestId;
  wand: Readonly<Gun>;
  spellIds: Readonly<SpellId>[];
  alwaysCastSpellIds: Readonly<SpellId>[];
  zetaSpellId?: Readonly<SpellId>;
  wand_cast_delay: number;
  endSimulationOnShotCount?: number;
  endSimulationOnReloadCount?: number;
  endSimulationOnRefreshCount?: number;
  limitSimulationIterations?: number;
  limitSimulationDuration?: number;
};

export const simulationConfigDefaults: SimulationConfig = {
  endSimulationOnShotCount: 30,
  endSimulationOnReloadCount: 1,
  endSimulationOnRefreshCount: 2,
  limitSimulationIterations: 200,
  limitSimulationDuration: 5000,
};
