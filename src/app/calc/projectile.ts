import * as main from './__generated__/main/projectileIds';

export type ProjectileId = (typeof main.projectileIds)[number];

export const relatedProjectileIds =
  main.projectileIds as ReadonlyArray<ProjectileId>;

export type ConfigExplosion = {
  /* ProjectileComponent.config_explosion */
  damage: number;
  explosion_radius: number;
  max_durability_to_destroy: number;
  damage_mortals: number;
};

export type ProjectileComponent = {
  config_explosion?: ConfigExplosion;
  damage: number;
  speed_min: number;
  speed_max: number;
  on_death_explode: boolean;
  on_lifetime_out_explode: boolean;
  explosion_dont_damage_shooter: boolean;
  on_collision_die: boolean;
  lifetime: number;
  lifetime_randomness: number;
};

export type Projectile = {
  id: ProjectileId;
  entityName: string;
  entityTags: string[];
  baseFile: string;
} & ProjectileComponent;

/* config_explosion (Unused)
<config_explosion
never_cache="1" 
camera_shake="0.5" 
explosion_sprite="data/particles/explosion_016_slime.xml" 
explosion_sprite_lifetime="0" 
create_cell_probability="0" 
hole_destroy_liquid="0"
explosion_sprite_additive="1"
hole_enabled="1" 
ray_energy="400000"
particle_effect="0" 
physics_explosion_power.min="0.02" 
physics_explosion_power.max="0.1" 
physics_throw_enabled="1"  
shake_vegetation="1" 
sparks_count_max="20" 
sparks_count_min="7" 
sparks_enabled="0"  
material_sparks_enabled="1"
material_sparks_count_max="2"
material_sparks_count_min="0" 
light_enabled="1" 
light_r="40"
light_g="90"
light_b="10"
stains_enabled="1"
stains_radius="3"
>

/* ProjectileComponent (Unused)
    lob_min="0.5"
    lob_max="0.7"
    friction="1"
    direction_random_rad="0.01"
    on_death_gfx_leave_sprite="0" 
    velocity_sets_scale="1"
    ragdoll_force_multiplier="0.04"
    hit_particle_force_multiplier="0.1"
	muzzle_flash_file="data/entities/particles/muzzle_flashes/muzzle_flash_laser_green.xml"
    shoot_light_flash_r="120"
    shoot_light_flash_g="255"
    shoot_light_flash_b="80"
    shoot_light_flash_radius="72" 
	knockback_force="1.8"
    physics_impulse_coeff="1500"
*/
