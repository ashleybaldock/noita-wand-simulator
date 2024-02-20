import type { Spell, SpellDeckInfo } from '../spell';
import type { TriggerCondition } from '../trigger';
import type { GroupedObject } from '../grouping/combineGroups';
import type { GunActionState } from '../actionState';
import type { ActionSource } from '../actionSources';
import type { TreeNode } from '../../util';

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
  wasLastToBeDrawnBeforeWrapNr?: number;
  wasLastToBeCalledBeforeWrapNr?: number;
  wrappingInto?: readonly SpellDeckInfo[];
};

export type WandShot = {
  _typeName: 'WandShot';
  projectiles: Projectile[];
  actionCallGroups: ActionCall[];
  actionCallTree: TreeNode<ActionCall>[];
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
  actionCallGroups: GroupedObject<ActionCall>[];
  actionCallTree: TreeNode<ActionCall>[];
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
