import type { SpellType } from './spellTypes';

export type GunActionState = {
  // action_id: ActionId;
  action_name: string;
  action_description: string;
  action_sprite_filename: string;
  action_unidentified_sprite_filename?: string;
  action_type: SpellType;
  action_spawn_level?: string;
  action_spawn_probability?: string;
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
  damage_holy_add: number;
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
