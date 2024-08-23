import type { ShotProjectile } from './ShotProjectile';
import type { GunActionState } from '../actionState';
import type { TriggerCondition } from '../trigger';
import type { ActionCall } from './ActionCall';
import type { TreeNode } from '../../util/TreeNode';
import { sequentialId } from '../../util';
import { defaultGunActionState } from '../defaultActionState';

export type WandShotId = number;

export type WandShot = {
  id: WandShotId;
  projectiles: ShotProjectile[];
  actionCalls: ActionCall[];
  /**
   * Ordered list of actionCallTree root nodes,
   * each representing:
   *
   * A Top-level non-trigger spell (0 children)
   *
   * A Top-level trigger spell (children can be single nodes,
   * or subtrees for nested triggers)
   *
   * actionCallTrees[actionCallTrees.length] is the action tree
   * currently being evaluated
   */
  actionCallTrees: TreeNode<ActionCall>[];
  castState?: GunActionState;
  manaDrain?: number;
  triggerType?: TriggerCondition;
  triggerEntity?: string;
  triggerActionDrawCount?: number;
  triggerDelayFrames?: number;
  wraps: number[];
};

export const getShot = (): WandShot => ({
  id: nextWandShotId(),
  projectiles: [],
  actionCalls: [],
  /**
   * Ordered list of tree root nodes,
   * each representing:
   *
   * A Top-level non-trigger spell (0 children)
   *
   * A Top-level trigger spell (children can be single nodes,
   * or subtrees for nested triggers)
   *
   * actionCallTrees[actionCallTrees.length] is the action tree
   * currently being evaluated
   */
  actionCallTrees: [],
  castState: { ...defaultGunActionState },
  wraps: [],
});

export const nextWandShotId = sequentialId<WandShotId>();
