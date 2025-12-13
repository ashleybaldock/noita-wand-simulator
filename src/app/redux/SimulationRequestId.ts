/**
 * Session-Unique ID to identify a simulation request
 */

import { sequentialId } from '../util';
import type { SimulationRequestId } from './SimulationRequestId';

export type SimulationRequestId = number;
export const nextSimulationRequestId = sequentialId<SimulationRequestId>();
