import type { StopReason } from '../../types';
import type { WandShot } from './WandShot';
import type { SimulationRequestId } from '../../redux/SimulationRequest';

export type ClickWandResult = {
  /**
   * Ordered list of WandShots
   *
   * Each of which has:
   *
   * - a list of projectiles
   * - a tree representing the action call sequence
   * - a set containing action call counts
   *
   */
  simulationRequestId: SimulationRequestId;
  shots: WandShot[];
  reloadTime: number | undefined;
  endConditions: StopReason[];
  elapsedTime: number;
  wraps: number;
  shotCount: number;
  reloadCount: number;
  refreshCount: number;
  repeatCount: number;
};
