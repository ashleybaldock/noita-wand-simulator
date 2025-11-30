import type { SimulationRequestId } from '../../redux/SimulationRequest';
import type { StopReason } from '../../types';
import type { InitialSimulationStateConfig } from './InitialStateConfig';
import type { WandSalvo } from './WandSalvo';
import type { WandShot } from './WandShot';

export type SimulationResult = {
  /**
   * Evaluation result
   *
   * Shot - result of one click, followed by cast delay
   * Salvo - one or more shots, followed by the longer of
   *         recharge delay or the last shot's cast delay
   *
   * Each of which has:
   *
   * - a list of projectiles
   * - a tree representing the action call sequence
   * - a set containing action call counts
   *
   */
  simulationRequestId: SimulationRequestId;
  salvos: WandSalvo[];
  reloadTime: number | undefined;
  elapsedTime: number;

  shots: WandShot[];
  endConditions: StopReason[];
  wraps: number;
  shotCount: number;
  reloadCount: number;
  refreshCount: number;
  repeatCount: number;

  initialState: Readonly<InitialSimulationStateConfig>;
};

export const createResult = (
  simulationRequestId: SimulationRequestId,
  initialState: Readonly<InitialSimulationStateConfig>,
) => ({
  simulationRequestId,
  salvos: [],
  shots: [],
  reloadTime: undefined,
  endConditions: [],
  elapsedTime: 0,
  wraps: 0,
  shotCount: 0,
  reloadCount: 0,
  refreshCount: 0,
  repeatCount: 0,
  initialState,
});
