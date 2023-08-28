// import { Action } from '../../calc';
import { ActionId } from '../';
import { GroupedObject } from '../../util/combineGroups';
import { mapIter } from '../../util';

export const actionSources = ['draw', 'action', 'perk', 'multiple'] as const;

export type Action = (
  c: GunActionState,
  recursion_level: number,
  iteration: number,
) => number | void;

export type Spell = {
  id: ActionId;
  name: string;
  description: string;
  sprite: string;
  // Casting
  action: Action;
  type: ActionType;
  custom_xml_file?: string;
  related_projectiles?: [string, number?];
  related_extra_entities?: string[];
  mana?: number;
  max_uses?: number;
  uses_remaining?: number;
  never_unlimited?: boolean;
  // Info
  beta?: boolean;
  spawn_requires_flag?: string;
  spawn_manual_unlock?: boolean;
  spawn_level?: string;
  spawn_probability?: string;
  sound_loop_tag?: string;
  price: number;
  ai_never_uses?: boolean;
  is_dangerous_blast?: boolean;
  sprite_unidentified?: string;
  // deck properties
  recursive?: boolean;
  iterative?: boolean;
  deck_index?: number;
  custom_uses_logic?: never;
  is_identified?: boolean;
  inventoryitem_id?: number;
  permanently_attached?: boolean;
};

export type ActionSource = typeof actionSources[number];

const ActionTypeInfoMapDefinition = {
  projectile: {
    name: 'Projectile',
    src: 'data/spelltypes/item_bg_projectile.png',
  },
  static: {
    name: 'Static',
    src: 'data/spelltypes/item_bg_static_projectile.png',
  },
  modifier: {
    name: 'Modifier',
    src: 'data/spelltypes/item_bg_modifier.png',
  },
  multicast: {
    name: 'Multicast',
    src: 'data/spelltypes/item_bg_draw_many.png',
  },
  material: {
    name: 'Material',
    src: 'data/spelltypes/item_bg_material.png',
  },
  other: {
    name: 'Other',
    src: 'data/spelltypes/item_bg_other.png',
  },
  utility: {
    name: 'Utility',
    src: 'data/spelltypes/item_bg_utility.png',
  },
  passive: {
    name: 'Passive',
    src: 'data/spelltypes/item_bg_passive.png',
  },
} as const;

export type ActionType = keyof typeof ActionTypeInfoMapDefinition;

export type ActionTypeInfo = typeof ActionTypeInfoMapDefinition[ActionType];

export type ActionTypeName =
  typeof ActionTypeInfoMapDefinition[ActionType]['name'];

export type ActionTypeSrc =
  typeof ActionTypeInfoMapDefinition[ActionType]['src'];

export type ActionTypeInfoKey =
  keyof typeof ActionTypeInfoMapDefinition[ActionType];

export type ActionTypeInfoMap = Record<ActionType, ActionTypeInfo>;

export const actionTypeInfoMap =
  ActionTypeInfoMapDefinition as ActionTypeInfoMap;

export const greekActionIds = [
  'ALPHA',
  'GAMMA',
  'TAU',
  'OMEGA',
  'MU',
  'PHI',
  'SIGMA',
  'ZETA',
  'KAPPA',
] as const;

export type GreekActionId = Extract<typeof greekActionIds[number], ActionId>;

const greekActionIdSet: Set<string> = new Set(
  greekActionIds.filter(isValidActionId),
);

export function isGreekActionId(actionId: ActionId): actionId is GreekActionId {
  return greekActionIdSet.has(actionId);
}

export function isValidActionId(id: string): id is ActionId {
  return Object.prototype.hasOwnProperty.call(actionByIdMap, id);
}

export const iterativeActionIds = [
  'DIVIDE_2',
  'DIVIDE_3',
  'DIVIDE_4',
  'DIVIDE_10',
  'DIVIDE_12',
] as const;

export type IterativeAction = Extract<
  typeof iterativeActionIds[number],
  ActionId
>;

const iterativeActionIdSet: Set<string> = new Set(
  iterativeActionIds.filter(isValidActionId),
);
// console.log(iterativeActionIdSet);

export function isIterativeActionId(
  actionId: ActionId,
): actionId is IterativeAction {
  return iterativeActionIdSet.has(actionId);
}

export const unlockFlags = [
  ...new Set<string>(
    mapIter<Action, string>(actions.values(), ({ spawn_requires_flag }) =>
      spawn_requires_flag !== undefined
        ? {
            val: spawn_requires_flag ?? '',
            ok: true,
          }
        : { ok: false },
    ),
  ),
] as const;

export const recursiveActions = [
  ...new Set<string>(
    mapIter<Action, string>(actions.values(), ({ recursive, id }) =>
      recursive === true
        ? {
            val: id,
            ok: true,
          }
        : {
            ok: false,
          },
    ),
  ),
] as const;

/* Wands and Cast State */
export type Gun = {
  actions_per_round: number;
  shuffle_deck_when_empty: boolean;
  reload_time: number;
  deck_capacity: number;
};

export type GunActionState = {
  // action_id: ActionId;
  action_name: string;
  action_description: string;
  action_sprite_filename: string;
  action_unidentified_sprite_filename?: string;
  action_type: ActionType;
  action_spawn_level: string;
  action_spawn_probability: string;
  action_spawn_requires_flag?: string;
  action_spawn_manual_unlock: boolean;
  action_max_uses?: number;
  custom_xml_file?: string;
  action_mana_drain?: number;
  action_is_dangerous_blast?: boolean;
  action_draw_many_count: number;
  action_ai_never_uses?: boolean;
  action_never_unlimited?: boolean;
  state_shuffled: boolean;
  state_cards_drawn: number;
  state_discarded_action: boolean;
  state_destroyed_action: boolean;
  fire_rate_wait: number;
  speed_multiplier: number;
  child_speed_multiplier: number;
  dampening: number;
  explosion_radius: number;
  spread_degrees: number;
  pattern_degrees: number;
  screenshake: number;
  recoil: number;
  damage_melee_add: number;
  damage_projectile_add: number;
  damage_electricity_add: number;
  damage_fire_add: number;
  damage_explosion_add: number;
  damage_explosion: number;
  damage_ice_add: number;
  damage_slice_add: number;
  damage_healing_add: number;
  damage_curse_add: number;
  damage_drill_add: number;
  damage_critical_chance: number;
  damage_critical_multiplier: number;
  explosion_damage_to_materials: number;
  knockback_force: number;
  reload_time: number;
  lightning_count: number;
  material: string;
  material_amount: number;
  trail_material: string;
  trail_material_amount: number;
  bounces: number;
  gravity: number;
  light: number;
  blood_count_multiplier: number;
  gore_particles: number;
  ragdoll_fx: number;
  friendly_fire: boolean;
  physics_impulse_coeff: number;
  lifetime_add: number;
  sprite: string;
  extra_entities: string;
  game_effect_entities: string;
  sound_loop_tag?: string;
  projectile_file: string;
  damage_null_all: number;

  action_recursive?: boolean;
  damage_projectile_mul?: number;
};

/*
 * Evaluation & visualisation
 */
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
  action?: Spell;
  proxy?: Spell;
  trigger?: WandShot;
  deckIndex?: string | number;
};

export type GroupedProjectile = {
  entity: string;
  action?: Spell;
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
