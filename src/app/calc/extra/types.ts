import { extra_modifiers } from '../gun_extra_modifiers';

export function ConfigGunActionInfo_Init<T extends GunActionState>(source: T) {
  return ConfigGunActionInfo_Copy(source, defaultGunActionState);
}

export function ConfigGunActionInfo_Copy<T extends GunActionState>(
  source: T,
  dest: T,
): void {
  // dest.action_id = source.action_id;
  dest.action_name = source.action_name;
  dest.action_description = source.action_description;
  dest.action_sprite_filename = source.action_sprite_filename;
  dest.action_unidentified_sprite_filename =
    source.action_unidentified_sprite_filename;
  dest.action_type = source.action_type;
  dest.action_spawn_level = source.action_spawn_level;
  dest.action_spawn_probability = source.action_spawn_probability;
  dest.action_spawn_requires_flag = source.action_spawn_requires_flag;
  dest.action_spawn_manual_unlock = source.action_spawn_manual_unlock;
  dest.action_max_uses = source.action_max_uses;
  dest.custom_xml_file = source.custom_xml_file;
  dest.action_mana_drain = source.action_mana_drain;
  dest.action_is_dangerous_blast = source.action_is_dangerous_blast;
  dest.action_draw_many_count = source.action_draw_many_count;
  dest.action_ai_never_uses = source.action_ai_never_uses;
  dest.action_never_unlimited = source.action_never_unlimited;
  dest.state_shuffled = source.state_shuffled;
  dest.state_cards_drawn = source.state_cards_drawn;
  dest.state_discarded_action = source.state_discarded_action;
  dest.state_destroyed_action = source.state_destroyed_action;
  dest.fire_rate_wait = source.fire_rate_wait;
  dest.speed_multiplier = source.speed_multiplier;
  dest.child_speed_multiplier = source.child_speed_multiplier;
  dest.dampening = source.dampening;
  dest.explosion_radius = source.explosion_radius;
  dest.spread_degrees = source.spread_degrees;
  dest.pattern_degrees = source.pattern_degrees;
  dest.screenshake = source.screenshake;
  dest.recoil = source.recoil;
  dest.damage_melee_add = source.damage_melee_add;
  dest.damage_projectile_add = source.damage_projectile_add;
  dest.damage_electricity_add = source.damage_electricity_add;
  dest.damage_fire_add = source.damage_fire_add;
  dest.damage_explosion_add = source.damage_explosion_add;
  dest.damage_explosion = source.damage_explosion;
  dest.damage_ice_add = source.damage_ice_add;
  dest.damage_slice_add = source.damage_slice_add;
  dest.damage_healing_add = source.damage_healing_add;
  dest.damage_curse_add = source.damage_curse_add;
  dest.damage_drill_add = source.damage_drill_add;
  dest.damage_critical_chance = source.damage_critical_chance;
  dest.damage_critical_multiplier = source.damage_critical_multiplier;
  dest.damage_null_all = source.damage_null_all;
  dest.explosion_damage_to_materials = source.explosion_damage_to_materials;
  dest.knockback_force = source.knockback_force;
  dest.reload_time = source.reload_time;
  dest.lightning_count = source.lightning_count;
  dest.material = source.material;
  dest.material_amount = source.material_amount;
  dest.trail_material = source.trail_material;
  dest.trail_material_amount = source.trail_material_amount;
  dest.bounces = source.bounces;
  dest.gravity = source.gravity;
  dest.light = source.light;
  dest.blood_count_multiplier = source.blood_count_multiplier;
  dest.gore_particles = source.gore_particles;
  dest.ragdoll_fx = source.ragdoll_fx;
  dest.friendly_fire = source.friendly_fire;
  dest.physics_impulse_coeff = source.physics_impulse_coeff;
  dest.lifetime_add = source.lifetime_add;
  dest.sprite = source.sprite;
  dest.extra_entities = source.extra_entities;
  dest.game_effect_entities = source.game_effect_entities;
  dest.sound_loop_tag = source.sound_loop_tag;
  dest.projectile_file = source.projectile_file;
}

export type Shot = {
  num_of_cards_to_draw: number;
  state: GunActionState;
};

export type ModifierName = keyof typeof extra_modifiers;

export type ShotEffects = {
  recoil_knockback: number;
};

export type ComponentID = string;
export type EntityID = string;
