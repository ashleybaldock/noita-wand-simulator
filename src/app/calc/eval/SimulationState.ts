import type { SimulationRequestId } from '../../redux/SimulationRequestId';
import type { MapTree } from '../../util/MapTree';
import type { TreeNode } from '../../util/Tree';
import type { SpellDeckInfo } from '../spell';
import type { ActionCall } from './ActionCall';
import { mergeSimulationConfigDefaults } from './SimulationConfig';
import type { SimulationConfig } from './SimulationConfig';
import { type SimulationResult, createResult } from './SimulationResult';
import { getCast, type WandCast } from './WandCast';

export type SimulationState = {
  simulationRequestId: SimulationRequestId;
  wand_available_mana: number;
  currentCastScope: WandCast;
  parentCastScope: WandCast | undefined;
  currentCastStack: WandCast[];
  calledActions: ActionCall[];
  lastCalledAction: ActionCall | undefined;
  lastDrawnAndCalledAction: ActionCall | undefined;
  lastPlayed: Readonly<SpellDeckInfo> | undefined;
  alwaysCastsPlayed: SpellDeckInfo[];
  validSourceCalledActions: ActionCall[];
  currentNode: TreeNode<ActionCall> | undefined;
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
      simulationRequestId: simulationRequestId,
      currentCastScope: getCast(),
      parentCastScope: undefined,
      currentCastStack: [],
      calledActions: [],
      lastCalledAction: undefined,
      lastDrawnAndCalledAction: undefined,
      lastPlayed: undefined,
      alwaysCastsPlayed: [],
      validSourceCalledActions: [],
      currentNode: undefined,
      rootNodes: [],
    },
    result: createResult(simulationRequestId, configuredInitialState),
  };
};
