import type { SimulationRequestId } from '../../redux/SimulationRequest';
import type { MapTree } from '../../util/MapTree';
import type { SpellDeckInfo } from '../spell';
import type { ActionCall } from './ActionCall';
import { createResult } from './SimulationResult';
import type { SimulationResult } from './SimulationResult';
import {
  mergeInitialStateConfigDefaults,
  type InitialSimulationStateConfig,
} from './InitialStateConfig';
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
} & InitialSimulationStateConfig;

export const resetSimulationState = (
  initialState: Partial<InitialSimulationStateConfig>,
  simulationRequestId: SimulationRequestId,
): {
  state: SimulationState;
  result: SimulationResult;
} => {
  const configuredInitialState = mergeInitialStateConfigDefaults(initialState);
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
