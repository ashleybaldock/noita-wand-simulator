import type { Sprite, SpriteName } from './sprite';

const uiSpriteDefinition = [
  ['icon.copy', 'var(--icon-copy)'],
  ['icon.redo', 'var(--icon-redo)'],
  ['icon.undo', 'var(--icon-undo)'],
  ['icon.save', 'var(--icon-save)'],
  ['icon.reset', 'var(--icon-reset)'],
  ['icon.clear', 'var(--icon-clear)'],
  ['icon.load', 'var(--icon-load)'],
  ['icon.search', 'var(--icon-search)'],
  ['icon.export', 'var(--icon-export)'],
  ['icon.lock', 'var(--icon-lock)'],
  ['icon.unlock', 'var(--icon-unlock)'],
  ['icon.config', 'var(--icon-config)'],
  ['icon.download.png', 'var(--icon-download-png)'],
  ['icon.hamburger.menu', 'var(--icon-hamburger-menu)'],

  ['icon.xmlfile', 'var(--icon-xmlfile)'],

  ['icon.config.heart2', 'var(--icon-config-heart2)'],
  ['icon.config.die2', 'var(--icon-config-die2)'],
  ['icon.config.req', 'var(--icon-config-req)'],
  ['icon.config.goldnugget2', 'var(--icon-config-goldnugget2)'],

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

  ['icon.arrowhead.r', 'var(--icon-arrowhead-right)'],

  ['icon.unlimitedspells', 'var(--icon-perk-unlimited)'],
  ['icon.neverunlimited', 'var(--icon-never-unlimited)'],

  ['icon.trigger', 'var(--icon-trigger)'],
  ['icon.trigger.disabled', 'var(--icon-trigger-disabled)'],
  ['icon.timer', 'var(--icon-timer)'],
  ['icon.timer.disabled', 'var(--icon-timer-disabled)'],
  ['icon.expiration', 'var(--icon-expiration)'],
  ['icon.expiration.disabled', 'var(--icon-expiration-disabled)'],

  ['icon.manadrain', 'var(--icon-manadrain)'],
  ['icon.reloadtime', 'var(--icon-reloadtime)'],
  ['icon.castdelay', 'var(--icon-castdelay)'],

  ['icon.lifetime', 'var(--icon-lifetime)'],
  ['icon.lifetime.infinite', 'var(--icon-infinite-lifetime)'],
  ['icon.spread', 'var(--icon-spread)'],
  ['icon.tshape', 'var(--icon-tshape)'],
  ['icon.bounces', 'var(--icon-bounces)'],

  ['icon.speed.base', 'var(--icon-speed-base)'],
  ['icon.speed.initial', 'var(--icon-speed-initial)'],
  ['icon.speed.multi', 'var(--icon-speed-multi)'],
  ['icon.speed.bonus', 'var(--icon-speed-damage-bonus)'],

  ['icon.stain.wet', 'var(--icon-stain-wet)'],
  ['icon.stain.oiled', 'var(--icon-stain-oiled)'],
  ['icon.stain.bloody', 'var(--icon-stain-bloody)'],
  ['icon.stain.burning', 'var(--icon-stain-burning)'],

  ['icon.critchance', 'var(--icon-critchance)'],
  ['icon.critbonus', 'var(--icon-crit-damage-bonus)'],
  ['icon.danger', 'var(--icon-danger)'],
  ['icon.zerodamage', 'var(--icon-damage-nulled)'],
  ['icon.explosionradius', 'var(--icon-explosionradius)'],
  ['icon.radiusbonus', 'var(--icon-radius-damage-bonus)'],
  ['icon.recoil', 'var(--icon-recoil)'],
  ['icon.knockback', 'var(--icon-knockback)'],

  ['icon.trail.oil', 'var(--icon-trail-oil)'],
  ['icon.trail.water', 'var(--icon-trail-water)'],
  ['icon.trail.acid', 'var(--icon-trail-acid)'],
  ['icon.trail.poison', 'var(--icon-trail-poison)'],
  ['icon.trail.fire', 'var(--icon-trail-fire)'],

  ['icon.wand.shuffle', `url('/data/wand/icon_gun_shuffle.png')`],
  ['icon.wand.capacity', `url('/data/wand/icon_gun_capacity.png')`],
  ['icon.wand.spellscast', `url('/data/wand/icon_gun_actions_per_round.png')`],
  ['icon.wand.reloadtime', `url('/data/wand/icon_gun_reload_time.png')`],
  ['icon.wand.castdelay', `url('/data/wand/icon_fire_rate_wait.png')`],
  ['icon.wand.manamax', `url('/data/wand/icon_mana_max.png')`],
  ['icon.wand.regen', `url('/data/wand/icon_mana_charge_speed.png')`],
  ['icon.wand.spread', `url('data/wand/icon_spread_degrees.png')`],
  ['icon.wand.speed', `url('data/wand/icon_speed_multiplier.png')`],
  ['icon.maxuses'],
  `url('data/wand/icon_action_max_uses.png')`,
  ['icon.remaininguses'],
  `url('data/wand/icon_action_max_uses.png')`,

  ['icon.recursion'],
  `url('data/eval/icon_recursion.png')`,
  ['icon.iteration'],
  `url('data/eval/icon_iteration.png')`,

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

  ['icon.projectile.unidentified', `url('/data/projectile_unidentified.png')`],
] as const;

export type UiSpriteName = (typeof uiSpriteDefinition)[number][0];
export type UiSpritePath = (typeof uiSpriteDefinition)[number][1];

export function* uiSprites(): IterableIterator<readonly [SpriteName, Sprite]> {
  for (const [spriteName, spritePath] of uiSpriteDefinition) {
    yield [spriteName, { name: spriteName, path: spritePath }];
  }
}
