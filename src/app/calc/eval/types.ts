import { Action, GunActionState } from '../extra/types';
import { GroupedObject } from '../../util/combineGroups';

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
  action?: Action;
  proxy?: Action;
  trigger?: WandShot;
  deckIndex?: string | number;
};

export type GroupedProjectile = {
  entity: string;
  action?: Action;
  proxy?: Action;
  trigger?: GroupedWandShot;
  deckIndex?: string | number;
};

export const actionSources = ['draw', 'action', 'perk', 'multiple'] as const;

export type ActionSource = typeof actionSources[number];

export type ActionCall = {
  action: Action;
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

export type Requirements = {
  enemies: boolean;
  projectiles: boolean;
  hp: boolean;
  half: boolean;
};
