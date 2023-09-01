import { Spell } from '../spell';
import { GroupedObject } from '../grouping/combineGroups';
import { GunActionState } from '../actionState';
import { ActionSource } from '../actionSources';

/*
 * Evaluation & visualisation
 */
export type ActionCall = {
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
  projectiles: Projectile[];
  calledActions: ActionCall[];
  actionTree: TreeNode<ActionCall>[];
  castState?: GunActionState;
  manaDrain?: number;
};

export type GroupedWandShot = {
  projectiles: GroupedObject<GroupedProjectile>[];
  calledActions: GroupedObject<ActionCall>[];
  actionTree: TreeNode<ActionCall>[];
  castState?: GunActionState;
  manaDrain?: number;
};

export type Projectile = {
  entity: string;
  spell?: Spell;
  proxy?: Spell;
  trigger?: WandShot;
  deckIndex?: string | number;
};

export type GroupedProjectile = {
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
