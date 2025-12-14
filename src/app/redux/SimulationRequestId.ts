/**
 * Session-Unique ID to identify a simulation request
 */

import { sequentialId } from '../util';

export type SimulationRequestId = number;
export const nextSimulationRequestId = sequentialId<SimulationRequestId>();
