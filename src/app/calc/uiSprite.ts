import type { Sprite, SpriteName } from './sprite';

const uiSpriteDefinition = [
  ['icon.copy', 'var(--icon-copy)'],
  ['icon.redo', `url('/data/redo.png')`],
  ['icon.undo', `url('/data/undo.png')`],
  ['icon.save', 'var(--icon-save)'],
  ['icon.reset', 'var(--icon-reset)'],
  ['icon.clear', 'var(--icon-clear)'],
  ['icon.load', 'var(--icon-load)'],
  ['icon.search', 'var(--icon-search)'],
  ['icon.export', `url('/data/export.png')`],
  ['icon.lock', 'var(--icon-lock)'],
  ['icon.unlock', 'var(--icon-unlock)'],
  ['icon.config', 'var(--icon-config)'],
  ['icon.download.png', `var(--icon-download-png)`],
  ['icon.hamburger.menu', `var(--icon-hamburger-menu)`],

  ['icon.config.heart2', `url('/data/config/heart2.png')`],
  ['icon.config.die2', `url('/data/config/die2.png')`],
  ['icon.config.req', `url('/data/config/req.png')`],
  ['icon.config.goldnugget2', `url('/data/config/goldnugget2.png')`],

  ['icon.chevron.u', 'var(--icon-arrow-u-chev)'],
  ['icon.chevron.d', 'var(--icon-arrow-d-chev)'],
  ['icon.chevron.l', 'var(--icon-arrow-l-chev)'],
  ['icon.chevron.r', 'var(--icon-arrow-r-chev)'],
  ['icon.chevron.u2', 'var(--icon-arrow-u-chev2)'],
  ['icon.chevron.d2', 'var(--icon-arrow-d-chev2)'],
  ['icon.chevron.l2', 'var(--icon-arrow-l-chev2)'],
  ['icon.chevron.r2', 'var(--icon-arrow-r-chev2)'],
  ['icon.chevron.u2x', 'var(--icon-arrow-u-chev2x)'],
  ['icon.chevron.d2x', 'var(--icon-arrow-d-chev2x)'],
  ['icon.chevron.l2x', 'var(--icon-arrow-l-chev2x)'],
  ['icon.chevron.r2x', 'var(--icon-arrow-r-chev2x)'],

  ['icon.trigger', 'var(--icon-trigger)'],
  ['icon.trigger.disabled', 'var(--icon-trigger-disabled)'],
  ['icon.timer', 'var(--icon-timer)'],
  ['icon.timer.disabled', 'var(--icon-timer-disabled)'],
  ['icon.expiration', 'var(--icon-expiration)'],
  ['icon.expiration.disabled', 'var(--icon-expiration-disabled)'],

  ['icon.manadrain', `url('/data/wand/icon_mana_drain.png')`],
  ['icon.reloadtime', `url('/data/wand/icon_reload_time-s.png')`],
  ['icon.castdelay', `url('/data/wand/icon_fire_rate_wait.png')`],
  ['icon.lifetime', `url('/data/wand/icon_lifetime.png')`],
  ['icon.lifetime.infinite', '--icon-infinite-lifetime'],
  ['icon.spread', `url('/data/wand/icon_spread_degrees.png')`],
  ['icon.tshape', `url('/data/icons/t_shape.png')`],
  ['icon.bounces', `url('/data/wand/icon_bounces.png')`],
  ['icon.speedmulti', `url('/data/wand/icon_speed_multiplier.png')`],
  ['icon.speedbonus', `url('/data/wand/icon_speed_bonus.png')`],
  ['icon.stain.wet', `url('/data/status/wet.png')`],
  ['icon.stain.oiled', `url('/data/status/oiled.png')`],
  ['icon.stain.bloody', `url('/data/status/bloody.png')`],
  ['icon.stain.burning', `url('/data/status/burning.png')`],
  ['icon.critchance', `url('/data/wand/icon_damage_critical_chance.png')`],
  ['icon.danger', `url('/data/warnings/icon_danger.png')`],
  ['icon.zerodamage', `url('/data/ui_gfx/gun_actions/zero_damage.png')`],
  ['icon.explosionradius', `url('/data/wand/icon_explosion_radius.png')`],
  ['icon.recoil', `url('/data/wand/icon_recoil.png')`],
  ['icon.knockback', `url('/data/wand/icon_knockback.png')`],
  ['icon.trail.oil', `url('/data/trail/trail_oil.png')`],
  ['icon.trail.water', `url('/data/trail/trail_water.png')`],
  ['icon.trail.acid', `url('/data/trail/trail_acid.png')`],
  ['icon.trail.poison', `url('/data/trail/trail_posion.png')`],
  ['icon.trail.fire', `url('/data/trail/trail_Fire.png')`],

  ['icon.damage.curse', `url('/data/damagetypes/dmg_curse.png')`],
  ['icon.damage.drill', `url('/data/damagetypes/dmg_drill.png')`],
  ['icon.damage.electricity', `url('/data/damagetypes/dmg_electricity.png')`],
  ['icon.damage.explosion', `url('/data/damagetypes/dmg_explosion.png')`],
  ['icon.damage.fire', `url('/data/damagetypes/dmg_fire.png')`],
  ['icon.damage.heal', `url('/data/damagetypes/dmg_heal.png')`],
  ['icon.damage.holy', `url('/data/damagetypes/dmg_holy.png')`],
  ['icon.damage.ice', `url('/data/damagetypes/dmg_ice.png')`],
  ['icon.damage.lackofair', `url('/data/damagetypes/dmg_lackofair.png')`],
  ['icon.damage.material', `url('/data/damagetypes/dmg_material.png')`],
  ['icon.damage.melee', `url('/data/damagetypes/dmg_melee.png')`],
  ['icon.damage.midas', `url('/data/damagetypes/dmg_midas.png')`],
  [
    'icon.damage.physics-blackhole',
    `url('/data/damagetypes/dmg_physics-blackhole.png')`,
  ],
  [
    'icon.damage.physics-crush',
    `url('/data/damagetypes/dmg_physics-crush.png')`,
  ],
  [
    'icon.damage.physics-impact',
    `url('/data/damagetypes/dmg_physics-impact.png')`,
  ],
  ['icon.damage.poison', `url('/data/damagetypes/dmg_poison.png')`],
  ['icon.damage.projectile', `url('/data/damagetypes/dmg_projectile.png')`],
  ['icon.damage.radioactive', `url('/data/damagetypes/dmg_radioactive.png')`],
  ['icon.damage.slice', `url('/data/damagetypes/dmg_slice.png')`],

  [
    'icon.spelltype.projectile',
    `url('/data/spelltypes/svg/item_bg_projectile.svg')`,
  ],
  [
    'icon.spelltype.static',
    `url('/data/spelltypes/svg/item_bg_static_projectile.svg')`,
  ],
  [
    'icon.spelltype.modifier',
    `url('/data/spelltypes/svg/item_bg_modifier.svg')`,
  ],
  [
    'icon.spelltype.multicast',
    `url('/data/spelltypes/svg/item_bg_draw_many.svg')`,
  ],
  [
    'icon.spelltype.material',
    `url('/data/spelltypes/svg/item_bg_material.svg')`,
  ],
  ['icon.spelltype.other', `url('/data/spelltypes/svg/item_bg_other.svg')`],
  ['icon.spelltype.utility', `url('/data/spelltypes/svg/item_bg_utility.svg')`],
  ['icon.spelltype.passive', `url('/data/spelltypes/svg/item_bg_passive.svg')`],
  ['icon.spell.unidentified', `url('/data/spellUnidentified.png')`],
] as const;

export type UiSpriteName = (typeof uiSpriteDefinition)[number][0];
export type UiSpritePath = (typeof uiSpriteDefinition)[number][1];

export function* uiSprites(): IterableIterator<readonly [SpriteName, Sprite]> {
  for (const [spriteName, spritePath] of uiSpriteDefinition) {
    yield [spriteName, { name: spriteName, path: spritePath }];
  }
}
