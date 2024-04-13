import type { ShotProjectile } from './ShotProjectile';
import type { GunActionState } from '../actionState';
import type { TriggerCondition } from '../trigger';
import type { ActionCall } from './ActionCall';
import type { TreeNode } from '../../util/TreeNode';
import { sequentialId } from '../../util';

export type WandShotId = number;

export type WandShot = {
  _typeName: 'WandShot';
  id: WandShotId;
  projectiles: ShotProjectile[];
  actionCallGroups: ActionCall[];
  actionCallTrees: TreeNode<ActionCall>[];
  castState?: GunActionState;
  manaDrain?: number;
  triggerType?: TriggerCondition;
  triggerEntity?: string;
  triggerActionDrawCount?: number;
  triggerDelayFrames?: number;
  wraps: number[];
};

export const nextWandShotId = sequentialId<WandShotId>();
