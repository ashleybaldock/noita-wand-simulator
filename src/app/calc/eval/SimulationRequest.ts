import type { SimulationRequestId } from '../../redux/SimulationRequestId';
import type { SimulationConfig } from './SimulationConfig';

export type SimulationRequest = SimulationConfig & {
  simulationRequestId: SimulationRequestId;
};
