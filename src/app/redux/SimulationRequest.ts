import type { ActionCallSequenceId } from '../calc/eval/ActionCall';
import { sequentialId } from '../util';

/**
 * Session-Unique ID to identify a simulation request
 */
export type SimulationRequestId = number;

export const nextSimulationRequestId = sequentialId<SimulationRequestId>();

export type SimulationStats = {
  requested: number;
  completed: number;
  failed: number;
  skipped: number;
};

export const getEmptySimulationStats = (): SimulationStats => ({
  requested: 0,
  completed: 0,
  failed: 0,
  skipped: 0,
});
