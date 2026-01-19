import { sequentialId } from '../../util';
import type { MapTree } from '../../util/MapTree';
import type { GunActionState } from '../actionState';
import { defaultGunActionState } from '../defaultActionState';
import type { ProjectileId } from '../projectile';
import type { TriggerCondition } from '../trigger';
import type { ActionCall } from './ActionCall';
import type { WandCastProjectile } from './WandCastProjectile';

/**
 * Represents the result of a single Cast
 *
 * Contains:
 * projectiles - Record<Projectile, Count> Count of the number of each projectile comprising this Cast
 * modifiers
 */
export type WandCast = {
  id: WandCastId;
  stats: WandCastStats;
  projectiles: WandCastProjectile[];
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
  actionCallTrees: MapTree<ActionCall>[];
  castState?: GunActionState;
  manaDrain?: number;
  triggerType?: TriggerCondition;
  triggerEntity?: string;
  triggerActionDrawCount?: number;
  triggerDelayFrames?: number;
  wraps: number[];
};
export type WandCastId = number;
/**
 * Aggregate stats for this Cast
 *
 * projectiles - Record<CastProjectile, Count> Count of the number of each type of projectile comprising this Cast
 * modifiers - Record<Spell, Count>
 *   Count of the number of copies of the spells comprising this Cast
 */

export type WandCastStats = {
  projectiles: Partial<Record<ProjectileId, number>>;
};
export const getCast = (): WandCast => ({
  id: nextWandCastId(),
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
 * Serializable Form of WandCast
 */

export const nextWandCastId = sequentialId<WandCastId>();
