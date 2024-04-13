import type { TriggerCondition } from '../trigger';
// import type { GroupedObject } from '../grouping/combineGroups';
import type { GunActionState } from '../actionState';
import type { TreeNode } from '../../util';
import type { ActionCall } from './ActionCall';
import type { SpellDeckInfo } from '../spell';

/*
 * Evaluation & visualisation
 */

// export type GroupedWandShot = {
//   _typeName: 'WandShot';
//   projectiles: GroupedObject<GroupedProjectile>[];
//   actionCallGroups: GroupedObject<ActionCall>[];
//   actionCallTree: TreeNode<ActionCall>[];
//   castState?: GunActionState;
//   manaDrain?: number;
//   triggerType?: TriggerCondition;
// };

// export type GroupedProjectile = {
//   _typeName: 'Projectile';
//   entity: string;
//   spell?: SpellDeckInfo;
//   proxy?: SpellDeckInfo;
//   trigger?: GroupedWandShot;
//   deckIndex?: string | number;
// };
