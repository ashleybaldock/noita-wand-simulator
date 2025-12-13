import type { SimulationStats } from './SimulationStats';

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
