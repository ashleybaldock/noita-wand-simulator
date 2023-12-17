import { Spell } from '../spell';
import { TriggerCondition } from '../trigger';
import { GroupedObject } from '../grouping/combineGroups';
import { GunActionState } from '../actionState';
import { ActionSource } from '../actionSources';

export type ComponentID = string;
export type EntityID = number;
export type Entity = object;
export type InventoryItemID = number | undefined;
export type Component = object;
export type EntityTransform = [x: number, y: number];

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
