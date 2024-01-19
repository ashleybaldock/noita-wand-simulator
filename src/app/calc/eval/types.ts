import type { Spell } from '../spell';
import type { TriggerCondition } from '../trigger';
import type { GroupedObject } from '../grouping/combineGroups';
import type { GunActionState } from '../actionState';
import type { ActionSource } from '../actionSources';

/*
 * Evaluation & visualisation
 */
export type ActionCall = {
  _typeName: 'ActionCall';
  spell: Spell;
  source: ActionSource;
  currentMana: number;
  deckIndex?: string | number;
  recursion?: number;
  iteration?: number;
  dont_draw_actions?: boolean;
  lastDrawnBeforeWrap?: number;
  lastCalledBeforeWrap?: number;
};

export type TreeNode<T> = {
  value: T;
  parent?: TreeNode<T>;
  children: TreeNode<T>[];
};

export type WandShot = {
  _typeName: 'WandShot';
  projectiles: Projectile[];
  calledActions: ActionCall[];
  actionTree: TreeNode<ActionCall>[];
  castState?: GunActionState;
  manaDrain?: number;
  triggerType?: TriggerCondition;
  triggerEntity?: string;
  triggerActionDrawCount?: number;
  triggerDelayFrames?: number;
  wraps: number[];
};

export type GroupedWandShot = {
  _typeName: 'WandShot';
  projectiles: GroupedObject<GroupedProjectile>[];
  calledActions: GroupedObject<ActionCall>[];
  actionTree: TreeNode<ActionCall>[];
  castState?: GunActionState;
  manaDrain?: number;
  triggerType?: TriggerCondition;
};

export type Projectile = {
  _typeName: 'Projectile';
  entity: string;
  spell?: Spell;
  proxy?: Spell;
  trigger?: WandShot;
  deckIndex?: string | number;
};

export type GroupedProjectile = {
  _typeName: 'Projectile';
  entity: string;
  spell?: Spell;
  proxy?: Spell;
  trigger?: GroupedWandShot;
  deckIndex?: string | number;
};

export type Requirements = {
  enemies: boolean;
  projectiles: boolean;
  hp: boolean;
  half: boolean;
};
