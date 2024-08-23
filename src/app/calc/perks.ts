import { isNotNullOrUndefined } from '../util';
import type { Sprite, SpriteName } from './sprite';

// TODO generate this from game data

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

const GameEffects = [
  'DAMAGE_MULTIPLIER',
  'LOW_HP_DAMAGE_BOOST',
  'IRON_STOMACH',
  'ABILITY_ACTIONS_MATERIALIZED',
  'PROJECTILE_HOMING',
] as const;

export type GameEffect = keyof typeof GameEffects;

const PerkDefinition = {
  always_cast: {
    sprite: `url('/data/ui_gfx/perk_icons/always_cast.png')`,
    show: false,
  },
  bleed_slime: {
    sprite: `url('/data/ui_gfx/perk_icons/bleed_slime.png')`,
    show: false,
  },
  bounce: { sprite: `url('/data/ui_gfx/perk_icons/bounce.png')` },
  cordyceps: {
    sprite: `url('/data/ui_gfx/perk_icons/cordyceps.png')`,
    show: false,
  },
  critical_hit: { sprite: `url('/data/ui_gfx/perk_icons/critical_hit.png')` },
  duplicate: { sprite: `url('/data/ui_gfx/perk_icons/duplicate.png')` },
  duplicate_projectile: {
    sprite: `url('/data/ui_gfx/perk_icons/duplicate_projectile.png')`,
  },
  extra_knockback: {
    sprite: `url('/data/ui_gfx/perk_icons/extra_knockback.png')`,
  },
  fast_projectiles: {
    sprite: `url('/data/ui_gfx/perk_icons/fast_projectiles.png')`,
  },
  iron_stomach: { sprite: `url('/data/ui_gfx/perk_icons/iron_stomach.png')` },
  food_clock: { sprite: `url('/data/ui_gfx/perk_icons/food_clock.png')` },
  glass_cannon: {
    sprite: `url('/data/ui_gfx/perk_icons/glass_cannon.png')`,
    GameEffect: `url('DAMAGE_MULTIPLIER')`,
    max: 2,
  },
  hungry_ghost: {
    sprite: `url('/data/ui_gfx/perk_icons/hungry_ghost.png')`,
    show: false,
  },
  low_hp_damage_boost: {
    sprite: `url('/data/ui_gfx/perk_icons/low_hp_damage_boost.png')`,
    GameEffect: `url('LOW_HP_DAMAGE_BOOST')`,
    max: 2,
  },
  low_recoil: { sprite: `url('/data/ui_gfx/perk_icons/low_recoil.png')` },
  lower_spread: { sprite: `url('/data/ui_gfx/perk_icons/lower_spread.png')` },
  orbit: { sprite: `url('/data/ui_gfx/perk_icons/orbit.png')` },
  projectile_eater_sector: {
    sprite: `url('/data/ui_gfx/perk_icons/projectile_eater_sector.png')`,
  },
  projectile_homing: {
    sprite: `url('/data/ui_gfx/perk_icons/projectile_homing.png')`,
  },
  projectile_homing_shooter: {
    sprite: `url('/data/ui_gfx/perk_icons/projectile_homing_shooter.png')`,
  },
  projectile_repulsion: {
    sprite: `url('/data/ui_gfx/perk_icons/projectile_repulsion.png')`,
  },
  projectile_repulsion_sector: {
    sprite: `url('/data/ui_gfx/perk_icons/projectile_repulsion_sector.png')`,
  },
  projectile_slow_field: {
    sprite: `url('/data/ui_gfx/perk_icons/projectile_slow_field.png')`,
  },
  risky_critical: {
    sprite: `url('/data/ui_gfx/perk_icons/risky_critical.png')`,
  },
  unlimited_spells: {
    sprite: `url('/data/ui_gfx/perk_icons/unlimited_spells.png')`,
  },
} as const;

export const unknownPerk = '/data/ui_gfx/perk_icons/unknown_perk.png';

export type UnknownPerk = typeof unknownPerk;

export type Perk = keyof typeof PerkDefinition;

export type PerkSprite = (typeof PerkDefinition)[Perk]['sprite'] | UnknownPerk;

type PerkInfo = {
  // name: Perk;
  sprite: PerkSprite;
  gameEffect?: GameEffect;
  max?: number;
  show?: boolean;
};

export type PerkInfoRecord = Readonly<Record<Perk, Readonly<PerkInfo>>>;

export const perkInfoRecord = PerkDefinition as PerkInfoRecord;

export const getSpriteForPerk = (perk?: Perk) =>
  isNotNullOrUndefined(perk) ? perkInfoRecord[perk].sprite : unknownPerk;

export function* perkSprites(): IterableIterator<
  readonly [SpriteName, Sprite]
> {
  for (const perkName of perks) {
    yield [perkName, { name: perkName, path: perkInfoRecord[perkName].sprite }];
  }
}
