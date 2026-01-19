import type { SimulationRequestId } from '../../redux/SimulationRequestId';
import type { StopReason } from '../../types';
import type { SimulationConfig } from './SimulationConfig';
import type { WandSalvo } from './WandSalvo';
import type { WandCast } from './WandCast';

/**
 * Evaluation result
 *
 * Cast - result of one click, followed by cast delay
 * Salvo - one or more Casts, followed by the longer of
 *         recharge delay or the last Cast's cast delay
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

  casts: WandCast[];
  endConditions: StopReason[];
  wraps: number;
  castCount: number;
  reloadCount: number;
  refreshCount: number;
  repeatCount: number;

  initialState: Readonly<SimulationConfig>;
};

export const createResult = (
  simulationRequestId: SimulationRequestId,
  initialState: Readonly<SimulationConfig>,
): SimulationResult => ({
  simulationRequestId,
  salvos: [],
  casts: [],
  reloadTime: undefined,
  endConditions: [],
  elapsedTime: 0,
  wraps: 0,
  castCount: 0,
  reloadCount: 0,
  refreshCount: 0,
  repeatCount: 0,
  initialState,
});
