import type { SimulationRequestId } from '../../redux/SimulationRequestId';
import type { StopReason } from '../../types';
import type { SimulationConfig } from './SimulationConfig';
import type { WandSalvo } from './WandSalvo';
import type { WandShot } from './WandShot';

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
export type SimulationResult = {
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

  initialState: Readonly<SimulationConfig>;
};

export const createResult = (
  simulationRequestId: SimulationRequestId,
  initialState: Readonly<SimulationConfig>,
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
