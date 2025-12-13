import type { SimulationRequestId } from '../../redux/SimulationRequest';
import type { MapTree } from '../../util/MapTree';
import type { SpellDeckInfo } from '../spell';
import type { ActionCall } from './ActionCall';
import {
  mergeSimulationConfigDefaults,
  type SimulationConfig,
} from './InitialStateConfig';
import { type SimulationResult, createResult } from './SimulationResult';
import { getShot, type WandShot } from './WandShot';

export type SimulationState = {
  simulationRequestId: SimulationRequestId;
  wand_available_mana: number;
  currentShot: WandShot;
  parentShot: WandShot | undefined;
  currentShotStack: WandShot[];
  lastCalledAction: ActionCall | undefined;
  lastDrawnAndCalledAction: ActionCall | undefined;
  lastPlayed: Readonly<SpellDeckInfo> | undefined;
  alwaysCastsPlayed: SpellDeckInfo[];
  calledActions: ActionCall[];
  validSourceCalledActions: ActionCall[];
  currentNode: MapTree<ActionCall> | undefined;
  rootNodes: MapTree<ActionCall>[];
} & SimulationConfig;

export const resetSimulationState = (
  initialState: Partial<SimulationConfig>,
  simulationRequestId: SimulationRequestId,
): {
  state: SimulationState;
  result: SimulationResult;
} => {
  const configuredInitialState = mergeSimulationConfigDefaults(initialState);
  return {
    state: {
      ...configuredInitialState,
      calledActions: [],
      validSourceCalledActions: [],
      currentShotStack: [],
      rootNodes: [],
      currentNode: undefined,
      currentShot: getShot(),
      lastCalledAction: undefined,
      lastDrawnAndCalledAction: undefined,
      lastPlayed: undefined,
      alwaysCastsPlayed: [],
      parentShot: undefined,
      simulationRequestId: simulationRequestId,
    },
    result: createResult(simulationRequestId, configuredInitialState),
  };
};
