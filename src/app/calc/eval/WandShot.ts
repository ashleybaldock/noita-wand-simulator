import type { GunActionState } from '../actionState';
import type { TriggerCondition } from '../trigger';
import type { ActionCall } from './ActionCall';
import type { TreeNode } from '../../util/TreeNode';
import type { ChangeFields } from '../../util';
import { sequentialId } from '../../util';
import { defaultGunActionState } from '../defaultActionState';
import type { EvalTree } from './serialize';
import type { ProjectileId } from '../projectile';
import type { WandShotProjectile } from './WandShotProjectile';

export type WandShotId = number;

/**
 * Aggregate stats for this Shot
 *
 * projectiles - Record<ShotProjectile, Count> Count of the number of each type of projectile comprising this Shot
 * modifiers - Record<Spell, Count>
 *   Count of the number of copies of the spells comprising this Shot
 */
type WandShotStats = {
  projectiles: Partial<Record<ProjectileId, number>>;
};
/**
 * Represents the result of a single Shot
 *
 * Contains:
 * projectiles - Record<Projectile, Count> Count of the number of each projectile comprising this shot
 * modifiers
 */
export type WandShot = {
  id: WandShotId;
  stats: WandShotStats;
  projectiles: WandShotProjectile[];
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
  stats: {
    projectiles: {},
  },
});

/*
 * Serializable Form of WandShot
 */
export const nextWandShotId = sequentialId<WandShotId>();
export type WandShotResult = ChangeFields<
  WandShot,
  {
    actionCallTrees: EvalTree[];
  }
>;
