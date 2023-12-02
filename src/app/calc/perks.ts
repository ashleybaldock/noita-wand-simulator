import { isNotNullOrUndefined } from '../util';

export const perks = [
  'always_cast',
  'bleed_slime',
  'bounce',
  'cordyceps',
  'critical_hit',
  'duplicate',
  'duplicate_projectile',
  'extra_knockback',
  'fast_projectiles',
  'food_clock',
  'glass_cannon',
  'hungry_ghost',
  'low_hp_damage_boost',
  'low_recoil',
  'lower_spread',
  'orbit',
  'projectile_eater_sector',
  'projectile_homing',
  'projectile_homing_shooter',
  'projectile_repulsion',
  'projectile_repulsion_sector',
  'projectile_slow_field',
  'risky_critical',
  'unlimited_spells',
] as const;

const PerkDefinition = {
  always_cast: { sprite: '/data/ui_gfx/perk_icons/always_cast.png' },
  bleed_slime: { sprite: '/data/ui_gfx/perk_icons/bleed_slime.png' },
  bounce: { sprite: '/data/ui_gfx/perk_icons/bounce.png' },
  cordyceps: { sprite: '/data/ui_gfx/perk_icons/cordyceps.png' },
  critical_hit: { sprite: '/data/ui_gfx/perk_icons/critical_hit.png' },
  duplicate: { sprite: '/data/ui_gfx/perk_icons/duplicate.png' },
  duplicate_projectile: {
    sprite: '/data/ui_gfx/perk_icons/duplicate_projectile.png',
  },
  extra_knockback: { sprite: '/data/ui_gfx/perk_icons/extra_knockback.png' },
  fast_projectiles: { sprite: '/data/ui_gfx/perk_icons/fast_projectiles.png' },
  food_clock: { sprite: '/data/ui_gfx/perk_icons/food_clock.png' },
  glass_cannon: { sprite: '/data/ui_gfx/perk_icons/glass_cannon.png' },
  hungry_ghost: { sprite: '/data/ui_gfx/perk_icons/hungry_ghost.png' },
  low_hp_damage_boost: {
    sprite: '/data/ui_gfx/perk_icons/low_hp_damage_boost.png',
  },
  low_recoil: { sprite: '/data/ui_gfx/perk_icons/low_recoil.png' },
  lower_spread: { sprite: '/data/ui_gfx/perk_icons/lower_spread.png' },
  orbit: { sprite: '/data/ui_gfx/perk_icons/orbit.png' },
  projectile_eater_sector: {
    sprite: '/data/ui_gfx/perk_icons/projectile_eater_sector.png',
  },
  projectile_homing: {
    sprite: '/data/ui_gfx/perk_icons/projectile_homing.png',
  },
  projectile_homing_shooter: {
    sprite: '/data/ui_gfx/perk_icons/projectile_homing_shooter.png',
  },
  projectile_repulsion: {
    sprite: '/data/ui_gfx/perk_icons/projectile_repulsion.png',
  },
  projectile_repulsion_sector: {
    sprite: '/data/ui_gfx/perk_icons/projectile_repulsion_sector.png',
  },
  projectile_slow_field: {
    sprite: '/data/ui_gfx/perk_icons/projectile_slow_field.png',
  },
  risky_critical: { sprite: '/data/ui_gfx/perk_icons/risky_critical.png' },
  unlimited_spells: { sprite: '/data/ui_gfx/perk_icons/unlimited_spells.png' },
} as const;

export type Perk = keyof typeof PerkDefinition;

type PerkInfo = {
  sprite: typeof PerkDefinition[Perk]['sprite'];
};

export type PerkInfoRecord = Readonly<Record<Perk, Readonly<PerkInfo>>>;

export const perkInfoRecord = PerkDefinition as PerkInfoRecord;

export const getSpriteForPerk = (perk?: Perk) =>
  isNotNullOrUndefined(perk)
    ? perkInfoRecord[perk].sprite
    : '/data/ui_gfx/perk_icons/unknown_perk.png';
