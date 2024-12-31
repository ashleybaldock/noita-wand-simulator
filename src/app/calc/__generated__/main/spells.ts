/* Auto-generated file - last built: 2024-12-26T16:38:01.626135 */

import type { GunActionState } from '../../actionState';
import type { Spell } from '../../spell';
import { ipairs, luaFor } from '../../lua/loops';
import {
  hand,
  deck,
  discarded,
  shot_effects,
  current_reload_time,
  setCurrentReloadTime,
  mana,
  setMana,
  setDontDrawActions,
  force_stop_draws,
  setForceStopDraws,
  clearHand,
  clearDeck,
  add_projectile,
  add_projectile_trigger_hit_world,
  add_projectile_trigger_timer,
  add_projectile_trigger_death,
  draw_actions,
  check_recursion,
  ACTION_DRAW_RELOAD_TIME_INCREASE,
  move_discarded_to_deck,
  order_deck,
  reflecting,
  call_action,
  find_the_wand_held,
} from "../../gun";
import {
  EntityGetWithTag,
  GetUpdatedEntityID,
  EntityGetComponent,
  EntityGetFirstComponent,
  ComponentGetValue2,
  ComponentSetValue2,
  EntityInflictDamage,
  ActionUsesRemainingChanged,
  EntityGetTransform,
  EntityLoad,
  EntityGetAllChildren,
  EntityGetName,
  EntityHasTag,
  EntityGetFirstComponentIncludingDisabled,
  EntityGetInRadiusWithTag,
  GlobalsGetValue,
  GlobalsSetValue,
  Random,
  SetRandomSeed,
  GameGetFrameNum,
  StartReload,
  OnNotEnoughManaForAction,
  HasFlagPersistent,

} from "../../eval/dispatch";




const actions: Spell[] = [
  
  
  {
    id: "BOMB",
    name: "$action_bomb",
    description: "$actiondesc_bomb",
    sprite: "var(--sprite-action-bomb)",
    sprite_unidentified: "data/ui_gfx/gun_actions/bomb_unidentified.png",
    related_projectiles: ["data/entities/projectiles/bomb.xml"],
    type: "projectile",
    spawn_level: "0,1,2,3,4,5,6",
    spawn_probability: "1,1,1,1,0.5,0.5,0.1",
    price: 200,
    mana: 25,
    max_uses: 3,
    custom_xml_file: "data/entities/misc/custom_cards/bomb.xml",
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/bomb.xml")
      c.fire_rate_wait = c.fire_rate_wait + 100
    },
  },
  {
    id: "LIGHT_BULLET",
    name: "$action_light_bullet",
    description: "$actiondesc_light_bullet",
    sprite: "var(--sprite-action-light-bullet)",
    sprite_unidentified: "data/ui_gfx/gun_actions/light_bullet_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/light_bullet.xml"],
    type: "projectile",
    spawn_level: "0,1,2",
    spawn_probability: "2,1,0.5",
    price: 100,
    mana: 5,
    
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/light_bullet.xml")
      c.fire_rate_wait = c.fire_rate_wait + 3
      c.screenshake = c.screenshake + 0.5
      c.spread_degrees = c.spread_degrees - 1.0
      c.damage_critical_chance = c.damage_critical_chance + 5
    },
  },
  {
    id: "LIGHT_BULLET_TRIGGER",
    name: "$action_light_bullet_trigger",
    description: "$actiondesc_light_bullet_trigger",
    sprite: "var(--sprite-action-light-bullet-trigger)",
    sprite_unidentified: "data/ui_gfx/gun_actions/light_bullet_trigger_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/light_bullet.xml"],
    type: "projectile",
    spawn_level: "0,1,2,3",
    spawn_probability: "1,0.5,0.5,0.5",
    price: 140,
    mana: 10,
    
    action: function(c: GunActionState) {
      c.fire_rate_wait = c.fire_rate_wait + 3
      c.screenshake = c.screenshake + 0.5
      c.damage_critical_chance = c.damage_critical_chance + 5
      add_projectile_trigger_hit_world("data/entities/projectiles/deck/light_bullet.xml", 1)
    },
  },
  {
    id: "LIGHT_BULLET_TRIGGER_2",
    name: "$action_light_bullet_trigger_2",
    description: "$actiondesc_light_bullet_trigger_2",
    sprite: "var(--sprite-action-light-bullet-trigger-2)",
    related_projectiles: ["data/entities/projectiles/deck/light_bullet_blue.xml"],
    type: "projectile",
    spawn_level: "2,3,5,6,10",
    spawn_probability: "1,0.5,1,1,0.2",
    price: 250,
    mana: 15,
    
    action: function(c: GunActionState) {
      c.fire_rate_wait = c.fire_rate_wait + 4
      c.screenshake = c.screenshake + 1
      c.damage_critical_chance = c.damage_critical_chance + 5
      add_projectile_trigger_hit_world("data/entities/projectiles/deck/light_bullet_blue.xml", 2)
    },
  },
  {
    id: "LIGHT_BULLET_TIMER",
    name: "$action_light_bullet_timer",
    description: "$actiondesc_light_bullet_timer",
    sprite: "var(--sprite-action-light-bullet-timer)",
    sprite_unidentified: "data/ui_gfx/gun_actions/light_bullet_timer_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/light_bullet.xml"],
    type: "projectile",
    spawn_level: "1,2,3",
    spawn_probability: "0.5,0.5,0.75",
    price: 140,
    mana: 10,
    
    action: function(c: GunActionState) {
      c.fire_rate_wait = c.fire_rate_wait + 3
      c.screenshake = c.screenshake + 0.5
      c.damage_critical_chance = c.damage_critical_chance + 5
      add_projectile_trigger_timer("data/entities/projectiles/deck/light_bullet.xml", 10, 1)
    },
  },
  {
    id: "BULLET",
    name: "$action_bullet",
    description: "$actiondesc_bullet",
    sprite: "var(--sprite-action-bullet)",
    sprite_unidentified: "data/ui_gfx/gun_actions/bullet_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/bullet.xml"],
    type: "projectile",
    spawn_level: "1,2,3,4,5",
    spawn_probability: "1,1,1,0.8,0.5",
    price: 150,
    mana: 20,
    
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/bullet.xml")
      c.fire_rate_wait = c.fire_rate_wait + 4
      c.screenshake = c.screenshake + 2
      c.spread_degrees = c.spread_degrees + 2.0
      c.damage_critical_chance = c.damage_critical_chance + 5
      shot_effects.recoil_knockback = shot_effects.recoil_knockback + 23.0
    },
  },
  {
    id: "BULLET_TRIGGER",
    name: "$action_bullet_trigger",
    description: "$actiondesc_bullet_trigger",
    sprite: "var(--sprite-action-bullet-trigger)",
    sprite_unidentified: "data/ui_gfx/gun_actions/bullet_trigger_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/bullet.xml"],
    type: "projectile",
    spawn_level: "1,2,3,4,5",
    spawn_probability: "0.5,0.5,0.5,0.6,0.5",
    price: 190,
    mana: 35,
    
    action: function(c: GunActionState) {
      c.fire_rate_wait = c.fire_rate_wait + 4
      c.screenshake = c.screenshake + 2
      c.spread_degrees = c.spread_degrees + 2.0
      c.damage_critical_chance = c.damage_critical_chance + 5
      add_projectile_trigger_hit_world("data/entities/projectiles/deck/bullet.xml", 1)
      shot_effects.recoil_knockback = shot_effects.recoil_knockback + 23.0
    },
  },
  {
    id: "BULLET_TIMER",
    name: "$action_bullet_timer",
    description: "$actiondesc_bullet_timer",
    sprite: "var(--sprite-action-bullet-timer)",
    sprite_unidentified: "data/ui_gfx/gun_actions/bullet_timer_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/bullet.xml"],
    type: "projectile",
    spawn_level: "2,3,4,5,6",
    spawn_probability: "0.5,0.5,0.5,0.5,0.6",
    price: 190,
    mana: 35,
    
    action: function(c: GunActionState) {
      c.fire_rate_wait = c.fire_rate_wait + 4
      c.screenshake = c.screenshake + 2
      c.spread_degrees = c.spread_degrees + 2.0
      c.damage_critical_chance = c.damage_critical_chance + 5
      add_projectile_trigger_timer("data/entities/projectiles/deck/bullet.xml", 10, 1)
      shot_effects.recoil_knockback = shot_effects.recoil_knockback + 23.0
    },
  },
  {
    id: "HEAVY_BULLET",
    name: "$action_heavy_bullet",
    description: "$actiondesc_heavy_bullet",
    sprite: "var(--sprite-action-heavy-bullet)",
    sprite_unidentified: "data/ui_gfx/gun_actions/heavy_bullet_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/bullet_heavy.xml"],
    type: "projectile",
    spawn_level: "1,2,3,4,5,6",
    spawn_probability: "0.5,1,1,1,1,1",
    price: 200,
    mana: 30,
    
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/bullet_heavy.xml")
      c.fire_rate_wait = c.fire_rate_wait + 7
      c.screenshake = c.screenshake + 2.5
      c.spread_degrees = c.spread_degrees + 5.0
      c.damage_critical_chance = c.damage_critical_chance + 5
      
      shot_effects.recoil_knockback = shot_effects.recoil_knockback + 50.0
    },
  },
  {
    id: "HEAVY_BULLET_TRIGGER",
    name: "$action_heavy_bullet_trigger",
    description: "$actiondesc_heavy_bullet_trigger",
    sprite: "var(--sprite-action-heavy-bullet-trigger)",
    sprite_unidentified: "data/ui_gfx/gun_actions/heavy_bullet_trigger_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/bullet_heavy.xml"],
    type: "projectile",
    spawn_level: "2,3,4,5,6",
    spawn_probability: "0.5,0.5,0.5,0.7,0.5",
    price: 240,
    mana: 40,
    
    action: function(c: GunActionState) {
      c.fire_rate_wait = c.fire_rate_wait + 7
      c.screenshake = c.screenshake + 2.5
      c.spread_degrees = c.spread_degrees + 5.0
      c.damage_critical_chance = c.damage_critical_chance + 5
      
      add_projectile_trigger_hit_world("data/entities/projectiles/deck/bullet_heavy.xml", 1)
      shot_effects.recoil_knockback = shot_effects.recoil_knockback + 50.0
    },
  },
  {
    id: "HEAVY_BULLET_TIMER",
    name: "$action_heavy_bullet_timer",
    description: "$actiondesc_heavy_bullet_timer",
    sprite: "var(--sprite-action-heavy-bullet-timer)",
    sprite_unidentified: "data/ui_gfx/gun_actions/heavy_bullet_timer_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/bullet_heavy.xml"],
    type: "projectile",
    spawn_level: "2,3,4,5,6",
    spawn_probability: "0.5,0.5,0.5,0.5,0.7",
    price: 240,
    mana: 40,
    
    action: function(c: GunActionState) {
      c.fire_rate_wait = c.fire_rate_wait + 7
      c.screenshake = c.screenshake + 2.5
      c.spread_degrees = c.spread_degrees + 5.0
      c.damage_critical_chance = c.damage_critical_chance + 5
      
      add_projectile_trigger_timer("data/entities/projectiles/deck/bullet_heavy.xml", 10, 1)
      shot_effects.recoil_knockback = shot_effects.recoil_knockback + 50.0
    },
  },
  {
    id: "AIR_BULLET",
    name: "$action_air_bullet",
    description: "$actiondesc_air_bullet",
    sprite: "var(--sprite-action-air-bullet)",
    sprite_unidentified: "data/ui_gfx/gun_actions/air_bullet_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/light_bullet_air.xml"],
    type: "projectile",
    spawn_level: "1,2",
    spawn_probability: "1,1",
    price: 80,
    mana: 5,
    
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/light_bullet_air.xml")
      c.fire_rate_wait = c.fire_rate_wait + 3
      
      c.spread_degrees = c.spread_degrees - 2.0
      
    },
  },
  {
    id: "SLOW_BULLET",
    name: "$action_slow_bullet",
    description: "$actiondesc_slow_bullet",
    sprite: "var(--sprite-action-slow-bullet)",
    sprite_unidentified: "data/ui_gfx/gun_actions/slow_bullet_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/bullet_slow.xml"],
    type: "projectile",
    spawn_level: "1,2,3,4",
    spawn_probability: "1,1,1,1",
    price: 160,
    mana: 30,
    
    custom_xml_file: "data/entities/misc/custom_cards/bullet_slow.xml",
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/bullet_slow.xml")
      c.fire_rate_wait = c.fire_rate_wait + 6
      c.screenshake = c.screenshake + 2
      c.spread_degrees = c.spread_degrees + 3.6
      shot_effects.recoil_knockback = shot_effects.recoil_knockback + 20.0
    },
  },
  {
    id: "SLOW_BULLET_TRIGGER",
    name: "$action_slow_bullet_trigger",
    description: "$actiondesc_slow_bullet_trigger",
    sprite: "var(--sprite-action-slow-bullet-trigger)",
    sprite_unidentified: "data/ui_gfx/gun_actions/slow_bullet_trigger_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/bullet_slow.xml"],
    type: "projectile",
    spawn_level: "1,2,3,4,5",
    spawn_probability: "0.5,0.5,0.5,0.5,1",
    price: 200,
    mana: 50,
    
    custom_xml_file: "data/entities/misc/custom_cards/bullet_slow.xml",
    action: function(c: GunActionState) {
      c.fire_rate_wait = c.fire_rate_wait + 25
      c.screenshake = c.screenshake + 2
      c.spread_degrees = c.spread_degrees + 10
      add_projectile_trigger_hit_world("data/entities/projectiles/deck/bullet_slow.xml", 1)
      shot_effects.recoil_knockback = shot_effects.recoil_knockback + 20.0
    },
  },
  {
    id: "SLOW_BULLET_TIMER",
    name: "$action_slow_bullet_timer",
    description: "$actiondesc_slow_bullet_timer",
    sprite: "var(--sprite-action-slow-bullet-timer)",
    sprite_unidentified: "data/ui_gfx/gun_actions/slow_bullet_timer_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/bullet_slow.xml"],
    type: "projectile",
    spawn_level: "1,2,3,4,5,6",
    spawn_probability: "0.5,0.5,0.5,0.5,1,1",
    price: 200,
    mana: 50,
    
    custom_xml_file: "data/entities/misc/custom_cards/bullet_slow.xml",
    action: function(c: GunActionState) {
      c.fire_rate_wait = c.fire_rate_wait + 6
      c.screenshake = c.screenshake + 2
      c.spread_degrees = c.spread_degrees + 3.6
      add_projectile_trigger_timer("data/entities/projectiles/deck/bullet_slow.xml", 100, 1)
      shot_effects.recoil_knockback = shot_effects.recoil_knockback + 20.0
    },
  },
  {
    id: "HOOK",
    name: "$action_hook",
    description: "$actiondesc_hook",
    sprite: "var(--sprite-action-hook)",
    sprite_unidentified: "data/ui_gfx/gun_actions/bullet_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/hook.xml"],
    type: "projectile",
    spawn_level: "1,2,3,4,5",
    spawn_probability: "0.1,0.3,0.4,0.2,0.1",
    price: 120,
    mana: 30,
    
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/hook.xml")
      c.fire_rate_wait = c.fire_rate_wait + 12
      shot_effects.recoil_knockback = shot_effects.recoil_knockback + 10.0
    },
  },
  {
    id: "BLACK_HOLE",
    name: "$action_black_hole",
    description: "$actiondesc_black_hole",
    sprite: "var(--sprite-action-black-hole)",
    sprite_unidentified: "data/ui_gfx/gun_actions/black_hole_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/black_hole.xml"],
    type: "projectile",
    spawn_level: "0,2,4,5",
    spawn_probability: "0.8,0.8,0.8,0.8",
    price: 200,
    mana: 180,
    max_uses: 3,
    never_unlimited: true,
    custom_xml_file: "data/entities/misc/custom_cards/black_hole.xml",
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/black_hole.xml")
      c.fire_rate_wait = c.fire_rate_wait + 80
      c.screenshake = c.screenshake + 20
    },
  },
  {
    id: "BLACK_HOLE_DEATH_TRIGGER",
    name: "$action_black_hole_death_trigger",
    description: "$actiondesc_black_hole_death_trigger",
    sprite: "var(--sprite-action-black-hole-death-trigger)",
    sprite_unidentified: "data/ui_gfx/gun_actions/black_hole_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/black_hole.xml"],
    type: "projectile",
    spawn_level: "2,4,5,6",
    spawn_probability: "0.5,0.5,0.5,0.5",
    price: 220,
    mana: 200,
    max_uses: 3,
    never_unlimited: true,
    custom_xml_file: "data/entities/misc/custom_cards/black_hole.xml",
    action: function(c: GunActionState) {
      add_projectile_trigger_death("data/entities/projectiles/deck/black_hole.xml", 1)
      c.fire_rate_wait = c.fire_rate_wait + 90
      c.screenshake = c.screenshake + 20
    },
  },
  {
    id: "WHITE_HOLE",
    name: "$action_white_hole",
    description: "$actiondesc_white_hole",
    sprite: "var(--sprite-action-white-hole)",
    sprite_unidentified: "data/ui_gfx/gun_actions/black_hole_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/white_hole.xml"],
    type: "projectile",
    spawn_level: "0,2,4,6,10",
    spawn_probability: "0.05,0.05,0.1,0.2,0.5",
    price: 200,
    mana: 180,
    max_uses: 3,
    never_unlimited: true,
    custom_xml_file: "data/entities/misc/custom_cards/white_hole.xml",
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/white_hole.xml")
      c.fire_rate_wait = c.fire_rate_wait + 80
      c.screenshake = c.screenshake + 20
    },
  },
  {
    id: "BLACK_HOLE_BIG",
    name: "$action_black_hole_big",
    description: "$actiondesc_black_hole_big",
    sprite: "var(--sprite-action-black-hole-big)",
    sprite_unidentified: "data/ui_gfx/gun_actions/black_hole_big_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/black_hole_big.xml"],
    type: "static",
    spawn_level: "1,3,5,6,10",
    spawn_probability: "0.8,0.8,0.8,0.8,0.5",
    price: 320,
    mana: 240,
    max_uses: 6,
    custom_xml_file: "data/entities/misc/custom_cards/black_hole_big.xml",
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/black_hole_big.xml")
      c.fire_rate_wait = c.fire_rate_wait + 80
      c.screenshake = c.screenshake + 10
    },
  },
  {
    id: "WHITE_HOLE_BIG",
    name: "$action_white_hole_big",
    description: "$actiondesc_white_hole_big",
    sprite: "var(--sprite-action-white-hole-big)",
    sprite_unidentified: "data/ui_gfx/gun_actions/black_hole_big_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/white_hole_big.xml"],
    type: "static",
    spawn_level: "1,3,5,6,10",
    spawn_probability: "0.05,0.05,0.1,0.4,0.2",
    price: 320,
    mana: 240,
    max_uses: 6,
    custom_xml_file: "data/entities/misc/custom_cards/white_hole_big.xml",
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/white_hole_big.xml")
      c.fire_rate_wait = c.fire_rate_wait + 80
      c.screenshake = c.screenshake + 10
    },
  },
  {
    id: "BLACK_HOLE_GIGA",
    name: "$action_black_hole_giga",
    description: "$actiondesc_black_hole_giga",
    sprite: "var(--sprite-action-black-hole-giga)",
    sprite_unidentified: "data/ui_gfx/gun_actions/black_hole_big_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/black_hole_giga.xml"],
    spawn_requires_flag: "card_unlocked_black_hole",
    type: "static",
    spawn_level: "10",
    spawn_probability: "1",
    price: 600,
    mana: 500,
    max_uses: 6,
    never_unlimited: true,
    custom_xml_file: "data/entities/misc/custom_cards/black_hole_giga.xml",
    action: function(c: GunActionState) {
      let black_holes = EntityGetWithTag(this.id,  "black_hole_giga" )
      
      if ( black_holes.length < 3 )  {
        add_projectile("data/entities/projectiles/deck/black_hole_giga.xml")
        c.fire_rate_wait = c.fire_rate_wait + 120
        setCurrentReloadTime(current_reload_time + 100)
        c.screenshake = c.screenshake + 40
      }
    },
  },
  {
    id: "WHITE_HOLE_GIGA",
    name: "$action_white_hole_giga",
    description: "$actiondesc_white_hole_giga",
    sprite: "var(--sprite-action-white-hole-giga)",
    sprite_unidentified: "data/ui_gfx/gun_actions/black_hole_big_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/white_hole_giga.xml"],
    spawn_requires_flag: "card_unlocked_black_hole",
    type: "static",
    spawn_level: "10",
    spawn_probability: "1",
    price: 600,
    mana: 500,
    max_uses: 6,
    never_unlimited: true,
    custom_xml_file: "data/entities/misc/custom_cards/white_hole_giga.xml",
    action: function(c: GunActionState) {
      let black_holes = EntityGetWithTag(this.id,  "black_hole_giga" )
      
      if ( black_holes.length < 3 )  {
        add_projectile("data/entities/projectiles/deck/white_hole_giga.xml")
        c.fire_rate_wait = c.fire_rate_wait + 120
        setCurrentReloadTime(current_reload_time + 100)
        c.screenshake = c.screenshake + 40
      }
    },
  },
  {
    id: "TENTACLE_PORTAL",
    name: "$action_tentacle_portal",
    description: "$actiondesc_tentacle_portal",
    sprite: "var(--sprite-action-tentacle-portal)",
    sprite_unidentified: "data/ui_gfx/gun_actions/slimeball_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/tentacle_portal.xml"],
    type: "projectile",
    spawn_level: "1,2,3,4,10",
    spawn_probability: "0.4,0.4,0.4,0.5,0.2",
    price: 220,
    mana: 140,
    max_uses: 5,
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/tentacle_portal.xml")
      c.fire_rate_wait = c.fire_rate_wait + 30
    },
  },
  
  {
    id: "SPITTER",
    name: "$action_spitter",
    description: "$actiondesc_spitter",
    sprite: "var(--sprite-action-spitter)",
    sprite_unidentified: "data/ui_gfx/gun_actions/spitter_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/spitter.xml"],
    type: "projectile",
    spawn_level: "0,1,2,3",
    spawn_probability: "1,1,1,0.5",
    price: 110,
    mana: 5,
    
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/spitter.xml")
      
      c.fire_rate_wait = c.fire_rate_wait - 1
      c.screenshake = c.screenshake + 0.1
      c.dampening = 0.1
      c.spread_degrees = c.spread_degrees + 6.0
    },
  },
  {
    id: "SPITTER_TIMER",
    name: "$action_spitter_timer",
    description: "$actiondesc_spitter_timer",
    sprite: "var(--sprite-action-spitter-timer)",
    sprite_unidentified: "data/ui_gfx/gun_actions/spitter_timer_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/spitter.xml"],
    type: "projectile",
    spawn_level: "0,1,2,3",
    spawn_probability: "0.5,0.5,0.5,1",
    price: 140,
    mana: 10,
    
    action: function(c: GunActionState) {
      
      c.fire_rate_wait = c.fire_rate_wait - 1
      c.screenshake = c.screenshake + 0.1
      c.dampening = 0.1
      c.spread_degrees = c.spread_degrees + 6.0
      add_projectile_trigger_timer("data/entities/projectiles/deck/spitter.xml", 40, 1)
    },
  },
  {
    id: "SPITTER_TIER_2",
    name: "$action_spitter_tier_2",
    description: "$actiondesc_spitter_tier_2",
    sprite: "var(--sprite-action-spitter-tier-2)",
    sprite_unidentified: "data/ui_gfx/gun_actions/spitter_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/spitter_tier_2.xml"],
    type: "projectile",
    spawn_level: "2,3,4,5",
    spawn_probability: "1,1,1,0.5",
    price: 190,
    mana: 25,
    
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/spitter_tier_2.xml")
      
      c.fire_rate_wait = c.fire_rate_wait - 2
      c.screenshake = c.screenshake + 1.1
      c.dampening = 0.2
      c.spread_degrees = c.spread_degrees + 7.5
    },
  },
  {
    id: "SPITTER_TIER_2_TIMER",
    name: "$action_spitter_tier_2_timer",
    description: "$actiondesc_spitter_tier_2_timer",
    sprite: "var(--sprite-action-spitter-tier-2-timer)",
    sprite_unidentified: "data/ui_gfx/gun_actions/spitter_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/spitter_tier_2.xml"],
    type: "projectile",
    spawn_level: "2,3,4,5",
    spawn_probability: "0.5,0.5,0.5,1",
    price: 220,
    mana: 30,
    
    action: function(c: GunActionState) {
      add_projectile_trigger_timer("data/entities/projectiles/deck/spitter_tier_2.xml", 40, 1)
      
      c.fire_rate_wait = c.fire_rate_wait - 2
      c.screenshake = c.screenshake + 1.1
      c.dampening = 0.2
      c.spread_degrees = c.spread_degrees + 7.5
    },
  },
  {
    id: "SPITTER_TIER_3",
    name: "$action_spitter_tier_3",
    description: "$actiondesc_spitter_tier_3",
    sprite: "var(--sprite-action-spitter-tier-3)",
    sprite_unidentified: "data/ui_gfx/gun_actions/spitter_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/spitter_tier_3.xml"],
    type: "projectile",
    spawn_level: "3,4,5,6",
    spawn_probability: "0.8,0.8,1,1",
    price: 240,
    mana: 40,
    
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/spitter_tier_3.xml")
      
      c.fire_rate_wait = c.fire_rate_wait - 4
      c.screenshake = c.screenshake + 3.1
      c.dampening = 0.3
      c.spread_degrees = c.spread_degrees + 9.0
    },
  },
  {
    id: "SPITTER_TIER_3_TIMER",
    name: "$action_spitter_tier_3_timer",
    description: "$actiondesc_spitter_tier_3_timer",
    sprite: "var(--sprite-action-spitter-tier-3-timer)",
    sprite_unidentified: "data/ui_gfx/gun_actions/spitter_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/spitter_tier_3.xml"],
    type: "projectile",
    spawn_level: "4,5,6",
    spawn_probability: "0.5,0.65,0.5",
    price: 260,
    mana: 45,
    
    action: function(c: GunActionState) {
      add_projectile_trigger_timer("data/entities/projectiles/deck/spitter_tier_3.xml", 40, 1)
      
      c.fire_rate_wait = c.fire_rate_wait - 4
      c.screenshake = c.screenshake + 3.1
      c.dampening = 0.3
      c.spread_degrees = c.spread_degrees + 9.0
    },
  },
  {
    id: "BUBBLESHOT",
    name: "$action_bubbleshot",
    description: "$actiondesc_bubbleshot",
    sprite: "var(--sprite-action-bubbleshot)",
    sprite_unidentified: "data/ui_gfx/gun_actions/bubbleshot_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/bubbleshot.xml"],
    type: "projectile",
    spawn_level: "0,1,2,3",
    spawn_probability: "1,0.6,1,0.5",
    price: 100,
    mana: 5,
    
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/bubbleshot.xml")
      
      c.fire_rate_wait = c.fire_rate_wait - 5
      c.dampening = 0.1
    },
  },
  {
    id: "BUBBLESHOT_TRIGGER",
    name: "$action_bubbleshot_trigger",
    description: "$actiondesc_bubbleshot_trigger",
    sprite: "var(--sprite-action-bubbleshot-trigger)",
    sprite_unidentified: "data/ui_gfx/gun_actions/bubbleshot_trigger_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/bubbleshot.xml"],
    type: "projectile",
    spawn_level: "1,2,3",
    spawn_probability: "0.5,0.5,1",
    price: 120,
    mana: 16,
    
    action: function(c: GunActionState) {
      
      c.fire_rate_wait = c.fire_rate_wait - 5
      c.dampening = 0.1
      add_projectile_trigger_hit_world("data/entities/projectiles/deck/bubbleshot.xml", 1)
    },
  },
  {
    id: "DISC_BULLET",
    name: "$action_disc_bullet",
    description: "$actiondesc_disc_bullet",
    sprite: "var(--sprite-action-disc-bullet)",
    sprite_unidentified: "data/ui_gfx/gun_actions/disc_bullet_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/disc_bullet.xml"],
    type: "projectile",
    spawn_level: "0,2,4",
    spawn_probability: "1,1,0.6",
    price: 120,
    mana: 20,
    
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/disc_bullet.xml")
      
      c.fire_rate_wait = c.fire_rate_wait + 10
      c.spread_degrees = c.spread_degrees + 2.0
      shot_effects.recoil_knockback = 20.0
    },
  },
  {
    id: "DISC_BULLET_BIG",
    name: "$action_disc_bullet_big",
    description: "$actiondesc_disc_bullet_big",
    sprite: "var(--sprite-action-disc-bullet-big)",
    sprite_unidentified: "data/ui_gfx/gun_actions/disc_bullet_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/disc_bullet_big.xml"],
    type: "projectile",
    spawn_level: "0,2,4",
    spawn_probability: "0.6,0.7,0.8",
    price: 180,
    mana: 38,
    
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/disc_bullet_big.xml")
      
      c.fire_rate_wait = c.fire_rate_wait + 20
      c.spread_degrees = c.spread_degrees + 3.4
      shot_effects.recoil_knockback = shot_effects.recoil_knockback + 20.0
    },
  },
  {
    id: "DISC_BULLET_BIGGER",
    name: "$action_omega_disc_bullet",
    description: "$actiondesc_omega_disc_bullet",
    sprite: "var(--sprite-action-disc-bullet-bigger)",
    sprite_unidentified: "data/ui_gfx/gun_actions/disc_bullet_unidentified.png",
    spawn_requires_flag: "card_unlocked_everything",
    related_projectiles: ["data/entities/projectiles/deck/disc_bullet_bigger.xml"],
    type: "projectile",
    spawn_level: "2,3,5,10",
    spawn_probability: "0.1,0.6,1,0.4",
    price: 270,
    mana: 70,
    
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/disc_bullet_bigger.xml")
      
      c.fire_rate_wait = c.fire_rate_wait + 40
      c.spread_degrees = c.spread_degrees + 6.4
      shot_effects.recoil_knockback = shot_effects.recoil_knockback + 30.0
      c.damage_projectile_add = c.damage_projectile_add + 0.2
    },
  },
  {
    id: "BOUNCY_ORB",
    name: "$action_bouncy_orb",
    description: "$actiondesc_bouncy_orb",
    sprite: "var(--sprite-action-bouncy-orb)",
    sprite_unidentified: "data/ui_gfx/gun_actions/disc_bullet_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/bouncy_orb.xml"],
    type: "projectile",
    spawn_level: "0,2,4",
    spawn_probability: "1,1,1",
    price: 120,
    mana: 20,
    
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/bouncy_orb.xml")
      
      c.fire_rate_wait = c.fire_rate_wait + 10
      shot_effects.recoil_knockback = 20.0
    },
  },
  {
    id: "BOUNCY_ORB_TIMER",
    name: "$action_bouncy_orb_timer",
    description: "$actiondesc_bouncy_orb_timer",
    sprite: "var(--sprite-action-bouncy-orb-timer)",
    sprite_unidentified: "data/ui_gfx/gun_actions/disc_bullet_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/bouncy_orb.xml"],
    type: "projectile",
    spawn_level: "0,2,4",
    spawn_probability: "0.5,0.5,0.5",
    price: 150,
    mana: 50,
    
    action: function(c: GunActionState) {
      add_projectile_trigger_timer("data/entities/projectiles/deck/bouncy_orb.xml",200,1)
      
      c.fire_rate_wait = c.fire_rate_wait + 10
      shot_effects.recoil_knockback = 20.0
    },
  },
  {
    id: "RUBBER_BALL",
    name: "$action_rubber_ball",
    description: "$actiondesc_rubber_ball",
    sprite: "var(--sprite-action-rubber-ball)",
    sprite_unidentified: "data/ui_gfx/gun_actions/rubber_ball_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/rubber_ball.xml"],
    type: "projectile",
    spawn_level: "0,1,6",
    spawn_probability: "1,1,0.2",
    price: 60,
    mana: 5,
    
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/rubber_ball.xml")
      
      c.fire_rate_wait = c.fire_rate_wait - 2
      c.spread_degrees = c.spread_degrees - 1.0
    },
  },
  {
    id: "ARROW",
    name: "$action_arrow",
    description: "$actiondesc_arrow",
    sprite: "var(--sprite-action-arrow)",
    sprite_unidentified: "data/ui_gfx/gun_actions/arrow_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/arrow.xml"],
    type: "projectile",
    spawn_level: "1,2,4,5",
    spawn_probability: "1,1,0.6,0.3",
    price: 140,
    mana: 15,
    
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/arrow.xml")
      
      c.fire_rate_wait = c.fire_rate_wait + 10
      c.spread_degrees = c.spread_degrees - 20
      shot_effects.recoil_knockback = 30.0
    },
  },
  {
    id: "POLLEN",
    name: "$action_pollen",
    description: "$actiondesc_pollen",
    sprite: "var(--sprite-action-pollen)",
    sprite_unidentified: "data/ui_gfx/gun_actions/arrow_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/pollen.xml"],
    type: "projectile",
    spawn_level: "0,1,3,4",
    spawn_probability: "0.6,1,1,0.6",
    price: 110,
    mana: 10,
    
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/pollen.xml")
      
      c.fire_rate_wait = c.fire_rate_wait + 2
      c.spread_degrees = c.spread_degrees + 20
    },
  },
  {
    id: "LANCE",
    name: "$action_lance",
    description: "$actiondesc_lance",
    sprite: "var(--sprite-action-lance)",
    sprite_unidentified: "data/ui_gfx/gun_actions/lance_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/lance.xml"],
    type: "projectile",
    spawn_level: "1,2,5,6",
    spawn_probability: "0.9,1,0.8,1",
    price: 180,
    mana: 30,
    
    custom_xml_file: "data/entities/misc/custom_cards/lance.xml",
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/lance.xml")
      
      c.fire_rate_wait = c.fire_rate_wait + 20
      c.spread_degrees = c.spread_degrees - 20
      shot_effects.recoil_knockback = 60.0
    },
  },
  {
    id: "LANCE_HOLY",
    name: "$action_holy",
    description: "$actiondesc_holy",
    sprite: "var(--sprite-action-lance-holy)",
    sprite_unidentified: "data/ui_gfx/gun_actions/lance_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/lance_holy.xml"],
    type: "projectile",
    spawn_level: "3,5,6",
    spawn_probability: "0.5,0.8,1",
    price: 250,
    mana: 120,
    
    custom_xml_file: "data/entities/misc/custom_cards/lance_holy.xml",
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/lance_holy.xml")
      
      c.fire_rate_wait = c.fire_rate_wait + 30
      c.spread_degrees = c.spread_degrees - 10
      shot_effects.recoil_knockback = 60.0
    },
  },
  {
    id: "ROCKET",
    name: "$action_rocket",
    description: "$actiondesc_rocket",
    sprite: "var(--sprite-action-rocket)",
    sprite_unidentified: "data/ui_gfx/gun_actions/rocket_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/rocket.xml"],
    type: "projectile",
    spawn_level: "1,2,3,4,5",
    spawn_probability: "1,1,1,0.5,0.3",
    price: 220,
    mana: 70,
    max_uses: 10,
    custom_xml_file: "data/entities/misc/custom_cards/rocket.xml",
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/rocket.xml")
      c.fire_rate_wait = c.fire_rate_wait + 60
      
      c.ragdoll_fx = 2
      shot_effects.recoil_knockback = 120.0
    },
  },
  {
    id: "ROCKET_TIER_2",
    name: "$action_rocket_tier_2",
    description: "$actiondesc_rocket_tier_2",
    sprite: "var(--sprite-action-rocket-tier-2)",
    sprite_unidentified: "data/ui_gfx/gun_actions/rocket_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/rocket_tier_2.xml"],
    type: "projectile",
    spawn_level: "2,3,4,5,6",
    spawn_probability: "0.5,1,1,0.8,0.5",
    price: 240,
    mana: 90,
    max_uses: 8,
    custom_xml_file: "data/entities/misc/custom_cards/rocket_tier_2.xml",
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/rocket_tier_2.xml")
      c.fire_rate_wait = c.fire_rate_wait + 90
      
      c.ragdoll_fx = 2
      shot_effects.recoil_knockback = 160.0
    },
  },
  {
    id: "ROCKET_TIER_3",
    name: "$action_rocket_tier_3",
    description: "$actiondesc_rocket_tier_3",
    sprite: "var(--sprite-action-rocket-tier-3)",
    sprite_unidentified: "data/ui_gfx/gun_actions/rocket_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/rocket_tier_3.xml"],
    type: "projectile",
    spawn_level: "2,3,4,5,6",
    spawn_probability: "0.25,0.5,1,1,1",
    price: 250,
    mana: 120,
    max_uses: 6,
    custom_xml_file: "data/entities/misc/custom_cards/rocket_tier_3.xml",
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/rocket_tier_3.xml")
      c.fire_rate_wait = c.fire_rate_wait + 120
      
      c.ragdoll_fx = 2
      shot_effects.recoil_knockback = 180.0
    },
  },
  {
    id: "GRENADE",
    name: "$action_grenade",
    description: "$actiondesc_grenade",
    sprite: "var(--sprite-action-grenade)",
    sprite_unidentified: "data/ui_gfx/gun_actions/grenade_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/grenade.xml"],
    type: "projectile",
    spawn_level: "0,1,2,3,4",
    spawn_probability: "1,1,0.5,0.25,0.2",
    price: 170,
    mana: 50,
    max_uses: 25,
    custom_xml_file: "data/entities/misc/custom_cards/grenade.xml",
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/grenade.xml")
      c.fire_rate_wait = c.fire_rate_wait + 30
      c.screenshake = c.screenshake + 4.0
      c.child_speed_multiplier = c.child_speed_multiplier * 0.75
      
      shot_effects.recoil_knockback = 80.0
    },
  },
  {
    id: "GRENADE_TRIGGER",
    name: "$action_grenade_trigger",
    description: "$actiondesc_grenade_trigger",
    sprite: "var(--sprite-action-grenade-trigger)",
    sprite_unidentified: "data/ui_gfx/gun_actions/grenade_trigger_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/grenade.xml"],
    type: "projectile",
    spawn_level: "0,1,2,3,4,5",
    spawn_probability: "0.5,0.5,0.2,0.5,0.5,1",
    price: 210,
    max_uses: 25,
    custom_xml_file: "data/entities/misc/custom_cards/grenade_trigger.xml",
    mana: 50,
    action: function(c: GunActionState) {
      c.fire_rate_wait = c.fire_rate_wait + 30
      c.screenshake = c.screenshake + 4.0
      
      c.child_speed_multiplier = c.child_speed_multiplier * 0.75
      add_projectile_trigger_hit_world("data/entities/projectiles/deck/grenade.xml", 1)
      shot_effects.recoil_knockback = 80.0
    },
  },
  {
    id: "GRENADE_TIER_2",
    name: "$action_grenade_tier_2",
    description: "$actiondesc_grenade_tier_2",
    sprite: "var(--sprite-action-grenade-tier-2)",
    sprite_unidentified: "data/ui_gfx/gun_actions/grenade_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/grenade_tier_2.xml"],
    type: "projectile",
    spawn_level: "1,2,3,4,5",
    spawn_probability: "0.5,1,1,1,0.5",
    price: 220,
    mana: 90,
    max_uses: 20,
    custom_xml_file: "data/entities/misc/custom_cards/grenade_tier_2.xml",
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/grenade_tier_2.xml")
      c.fire_rate_wait = c.fire_rate_wait + 50
      c.screenshake = c.screenshake + 8.0
      c.child_speed_multiplier = c.child_speed_multiplier * 0.75
      
      shot_effects.recoil_knockback = 120.0
    },
  },
  {
    id: "GRENADE_TIER_3",
    name: "$action_grenade_tier_3",
    description: "$actiondesc_grenade_tier_3",
    sprite: "var(--sprite-action-grenade-tier-3)",
    sprite_unidentified: "data/ui_gfx/gun_actions/grenade_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/grenade_tier_3.xml"],
    type: "projectile",
    spawn_level: "1,2,3,4,5",
    spawn_probability: "0.25,0.5,0.75,1,1",
    price: 220,
    mana: 90,
    max_uses: 20,
    custom_xml_file: "data/entities/misc/custom_cards/grenade_tier_3.xml",
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/grenade_tier_3.xml")
      c.fire_rate_wait = c.fire_rate_wait + 80
      c.screenshake = c.screenshake + 15.0
      c.child_speed_multiplier = c.child_speed_multiplier * 0.9
      
      shot_effects.recoil_knockback = 140.0
    },
  },
  {
    id: "GRENADE_ANTI",
    name: "$action_grenade_anti",
    description: "$actiondesc_grenade_anti",
    sprite: "var(--sprite-action-grenade-anti)",
    sprite_unidentified: "data/ui_gfx/gun_actions/grenade_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/grenade_anti.xml"],
    type: "projectile",
    spawn_level: "0,1,2,3,4,5",
    spawn_probability: "0.4,0.4,0.7,0.4,0.4,0.4",
    price: 170,
    mana: 50,
    max_uses: 25,
    custom_xml_file: "data/entities/misc/custom_cards/grenade.xml",
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/grenade_anti.xml")
      c.fire_rate_wait = c.fire_rate_wait + 30
      c.screenshake = c.screenshake + 4.0
      c.child_speed_multiplier = c.child_speed_multiplier * 0.75
      
      shot_effects.recoil_knockback = 80.0
    },
  },
  {
    id: "GRENADE_LARGE",
    name: "$action_grenade_large",
    description: "$actiondesc_grenade_large",
    sprite: "var(--sprite-action-grenade-large)",
    sprite_unidentified: "data/ui_gfx/gun_actions/grenade_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/grenade_large.xml"],
    type: "projectile",
    spawn_level: "0,1,2,3,4,5",
    spawn_probability: "0.4,0.4,0.4,0.4,0.4,0.4",
    price: 150,
    mana: 80,
    max_uses: 35,
    custom_xml_file: "data/entities/misc/custom_cards/grenade.xml",
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/grenade_large.xml")
      c.fire_rate_wait = c.fire_rate_wait + 40
      c.screenshake = c.screenshake + 5.0
      c.child_speed_multiplier = c.child_speed_multiplier * 0.75
      
      shot_effects.recoil_knockback = 80.0
    },
  },
  {
    id: "MINE",
    name: "$action_mine",
    description: "$actiondesc_mine",
    sprite: "var(--sprite-action-mine)",
    sprite_unidentified: "data/ui_gfx/gun_actions/mine_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/mine.xml"],
    type: "projectile",
    spawn_level: "1,3,4,6",
    spawn_probability: "1,0.75,1,0.5",
    price: 200,
    mana: 20,
    max_uses: 15,
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/mine.xml")
      c.fire_rate_wait = c.fire_rate_wait + 30
      c.child_speed_multiplier = c.child_speed_multiplier * 0.75
      c.speed_multiplier = c.speed_multiplier * 0.75
      shot_effects.recoil_knockback = 60.0
      
      if ( c.speed_multiplier >= 20 )  {
        c.speed_multiplier = Math.min( c.speed_multiplier, 20 )
      } else if ( c.speed_multiplier < 0 )  {
        c.speed_multiplier = 0
      }
    },
  },
  {
    id: "MINE_DEATH_TRIGGER",
    name: "$action_mine_death_trigger",
    description: "$actiondesc_mine_death_trigger",
    sprite: "var(--sprite-action-mine-death-trigger)",
    sprite_unidentified: "data/ui_gfx/gun_actions/mine_death_trigger_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/mine.xml"],
    type: "projectile",
    spawn_level: "2,6",
    spawn_probability: "1,1",
    price: 240,
    mana: 20,
    max_uses: 15,
    action: function(c: GunActionState) {
      add_projectile_trigger_death("data/entities/projectiles/deck/mine.xml", 1)
      c.fire_rate_wait = c.fire_rate_wait + 30
      c.child_speed_multiplier = c.child_speed_multiplier * 0.75
      c.speed_multiplier = c.speed_multiplier * 0.75
      shot_effects.recoil_knockback = 60.0
      
      if ( c.speed_multiplier >= 20 )  {
        c.speed_multiplier = Math.min( c.speed_multiplier, 20 )
      } else if ( c.speed_multiplier < 0 )  {
        c.speed_multiplier = 0
      }
    },
  },
  {
    id: "PIPE_BOMB",
    name: "$action_pipe_bomb",
    description: "$actiondesc_pipe_bomb",
    sprite: "var(--sprite-action-pipe-bomb)",
    sprite_unidentified: "data/ui_gfx/gun_actions/pipe_bomb_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/pipe_bomb.xml"],
    type: "projectile",
    spawn_level: "2,3,4",
    spawn_probability: "1,1,0.6",
    price: 200,
    mana: 20,
    max_uses: 20,
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/pipe_bomb.xml")
      c.fire_rate_wait = c.fire_rate_wait + 30
      c.child_speed_multiplier = c.child_speed_multiplier * 0.75
      c.speed_multiplier = c.speed_multiplier * 0.75
      
      if ( c.speed_multiplier >= 20 )  {
        c.speed_multiplier = Math.min( c.speed_multiplier, 20 )
      } else if ( c.speed_multiplier < 0 )  {
        c.speed_multiplier = 0
      }
    },
  },
  {
    id: "PIPE_BOMB_DEATH_TRIGGER",
    name: "$action_pipe_bomb_death_trigger",
    description: "$actiondesc_pipe_bomb_death_trigger",
    sprite: "var(--sprite-action-pipe-bomb-death-trigger)",
    sprite_unidentified: "data/ui_gfx/gun_actions/pipe_bomb_death_trigger_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/pipe_bomb.xml"],
    type: "projectile",
    spawn_level: "2,3,4,5",
    spawn_probability: "0.6,0.8,1,0.8",
    price: 230,
    mana: 20,
    max_uses: 20,
    action: function(c: GunActionState) {
      c.fire_rate_wait = c.fire_rate_wait + 30
      c.child_speed_multiplier = c.child_speed_multiplier * 0.75
      c.speed_multiplier = c.speed_multiplier * 0.75
      add_projectile_trigger_death("data/entities/projectiles/deck/pipe_bomb.xml", 1)
      shot_effects.recoil_knockback = shot_effects.recoil_knockback + 60.0
      
      if ( c.speed_multiplier >= 20 )  {
        c.speed_multiplier = Math.min( c.speed_multiplier, 20 )
      } else if ( c.speed_multiplier < 0 )  {
        c.speed_multiplier = 0
      }
    },
  },
  {
    id: "FISH",
    name: "$action_fish",
    description: "$actiondesc_fish",
    spawn_requires_flag: "card_unlocked_fish",
    sprite: "var(--sprite-action-fish)",
    sprite_unidentified: "data/ui_gfx/gun_actions/fish_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/fish.xml"],
    type: "projectile",
    spawn_level: "3,4,5",
    spawn_probability: "0.01,0.01,0.01",
    price: 250,
    mana: 90,
    max_uses: 20,
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/fish.xml")
      c.fire_rate_wait = c.fire_rate_wait + 80
    },
  },
  {
    id: "EXPLODING_DEER",
    name: "$action_exploding_deer",
    description: "$actiondesc_exploding_deer",
    spawn_requires_flag: "card_unlocked_exploding_deer",
    sprite: "var(--sprite-action-exploding-deer)",
    sprite_unidentified: "data/ui_gfx/gun_actions/exploding_deer_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/exploding_deer.xml"],
    type: "projectile",
    spawn_level: "3,4,5",
    spawn_probability: "0.6,0.6,0.6",
    price: 170,
    mana: 120,
    max_uses: 10,
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/exploding_deer.xml")
      c.fire_rate_wait = c.fire_rate_wait + 80
    },
  },
  {
    id: "EXPLODING_DUCKS",
    name: "$action_exploding_ducks",
    description: "$actiondesc_exploding_ducks",
    spawn_requires_flag: "card_unlocked_exploding_deer",
    sprite: "var(--sprite-action-exploding-ducks)",
    sprite_unidentified: "data/ui_gfx/gun_actions/exploding_deer_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/duck.xml", 3],
    type: "projectile",
    spawn_level: "3,4,5",
    spawn_probability: "0.8,0.5,0.6",
    price: 200,
    mana: 100,
    max_uses: 20,
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/duck.xml")
      add_projectile("data/entities/projectiles/deck/duck.xml")
      add_projectile("data/entities/projectiles/deck/duck.xml")
      c.fire_rate_wait = c.fire_rate_wait + 60
      setCurrentReloadTime(current_reload_time + 20)
    },
  },
  {
    id: "WORM_SHOT",
    name: "$action_worm_shot",
    description: "$actiondesc_worm_shot",
    spawn_requires_flag: "card_unlocked_exploding_deer",
    sprite: "var(--sprite-action-worm-shot)",
    sprite_unidentified: "data/ui_gfx/gun_actions/exploding_deer_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/worm_shot.xml"],
    type: "projectile",
    spawn_level: "3,4,5,6,10",
    spawn_probability: "0.6,0.8,0.6,0.4,0.6",
    price: 200,
    mana: 150,
    max_uses: 10,
    never_unlimited: true,
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/worm_shot.xml")
      c.fire_rate_wait = c.fire_rate_wait + 80
      setCurrentReloadTime(current_reload_time + 40)
      c.spread_degrees = c.spread_degrees + 20
    },
  },
  
  {
    id: "BOMB_DETONATOR",
    name: "$action_bomb_detonator",
    description: "$actiondesc_bomb_detonator",
    sprite: "var(--sprite-action-bomb-detonator)",
    sprite_unidentified: "data/ui_gfx/gun_actions/meteor_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/bomb_detonator.xml"],
    type: "static",
    spawn_level: "2,3,4,5,6",
    spawn_probability: "0.5,1,0.4,0.5,1",
    price: 120,
    mana: 50,
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/bomb_detonator.xml")
    },
  },
  {
    id: "LASER",
    name: "$action_laser",
    description: "$actiondesc_laser",
    sprite: "var(--sprite-action-laser)",
    sprite_unidentified: "data/ui_gfx/gun_actions/laser_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/laser.xml"],
    type: "projectile",
    spawn_level: "1,2,4",
    spawn_probability: "1,1,1",
    price: 180,
    mana: 30,
    
    custom_xml_file: "data/entities/misc/custom_cards/laser.xml",
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/laser.xml")
      c.fire_rate_wait = c.fire_rate_wait - 22
      c.game_effect_entities = c.game_effect_entities + "data/entities/misc/effect_disintegrated.xml,"
      shot_effects.recoil_knockback = shot_effects.recoil_knockback + 20.0
    },
  },
  {
    id: "MEGALASER",
    name: "$action_megalaser",
    description: "$actiondesc_megalaser",
    sprite: "var(--sprite-action-megalaser)",
    sprite_unidentified: "data/ui_gfx/gun_actions/megalaser_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/megalaser.xml"],
    type: "projectile",
    spawn_level: "3,4,5,6,10",
    spawn_probability: "0.6,0.6,0.8,0.6,0.3",
    price: 300,
    mana: 110,
    action: function(c: GunActionState) {
      
      add_projectile("data/entities/projectiles/deck/megalaser_beam.xml")
      add_projectile("data/entities/projectiles/deck/megalaser_beam.xml")
      add_projectile("data/entities/projectiles/deck/megalaser_beam.xml")
      add_projectile("data/entities/projectiles/deck/megalaser_beam.xml")
      add_projectile("data/entities/projectiles/deck/megalaser_beam.xml")
      
      add_projectile("data/entities/projectiles/deck/megalaser.xml")
      c.fire_rate_wait = c.fire_rate_wait + 90
      shot_effects.recoil_knockback = shot_effects.recoil_knockback + 20.0
      c.game_effect_entities = c.game_effect_entities + "data/entities/misc/effect_disintegrated.xml,"
    },
  },
  {
    id: "LIGHTNING",
    name: "$action_lightning",
    description: "$actiondesc_lightning",
    sprite: "var(--sprite-action-lightning)",
    sprite_unidentified: "data/ui_gfx/gun_actions/lightning_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/lightning.xml"],
    type: "projectile",
    spawn_level: "1,2,5,6",
    spawn_probability: "1,0.9,0.7,1",
    price: 250,
    mana: 70,
    
    custom_xml_file: "data/entities/misc/custom_cards/electric_charge.xml",
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/lightning.xml")
      c.fire_rate_wait = c.fire_rate_wait + 50
      shot_effects.recoil_knockback = 180.0
    },
  },
  {
    id: "BALL_LIGHTNING",
    name: "$action_ball_lightning",
    description: "$actiondesc_ball_lightning",
    sprite: "var(--sprite-action-ball-lightning)",
    sprite_unidentified: "data/ui_gfx/gun_actions/lightning_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/ball_lightning.xml",3],
    type: "projectile",
    spawn_level: "1,2,4,5",
    spawn_probability: "0.2,0.4,1,1",
    price: 250,
    mana: 70,
    custom_xml_file: "data/entities/misc/custom_cards/electric_charge.xml",
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/ball_lightning.xml")
      add_projectile("data/entities/projectiles/deck/ball_lightning.xml")
      add_projectile("data/entities/projectiles/deck/ball_lightning.xml")
      c.fire_rate_wait = c.fire_rate_wait + 50
      shot_effects.recoil_knockback = 120.0
    },
  },
  {
    id: "LASER_EMITTER",
    name: "$action_laser_emitter",
    description: "$actiondesc_laser_emitter",
    sprite: "var(--sprite-action-laser-emitter)",
    sprite_unidentified: "data/ui_gfx/gun_actions/laser_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/orb_laseremitter.xml"],
    type: "projectile",
    spawn_level: "1,2,3,4",
    spawn_probability: "0.2,0.8,1,0.5",
    price: 180,
    mana: 60,
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/orb_laseremitter.xml")
      shot_effects.recoil_knockback = shot_effects.recoil_knockback + 20.0
      c.fire_rate_wait = c.fire_rate_wait + 6
      c.game_effect_entities = c.game_effect_entities + "data/entities/misc/effect_disintegrated.xml,"
    },
  },
  {
    id: "LASER_EMITTER_FOUR",
    name: "$action_laser_emitter_four",
    description: "$actiondesc_laser_emitter_four",
    sprite: "var(--sprite-action-laser-emitter-four)",
    sprite_unidentified: "data/ui_gfx/gun_actions/laser_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/orb_laseremitter.xml"],
    type: "projectile",
    spawn_level: "1,2,3,4,5",
    spawn_probability: "0.2,0.9,0.3,0.5,1",
    price: 200,
    mana: 80,
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/orb_laseremitter_four.xml")
      shot_effects.recoil_knockback = shot_effects.recoil_knockback + 30.0
      c.fire_rate_wait = c.fire_rate_wait + 15
      c.game_effect_entities = c.game_effect_entities + "data/entities/misc/effect_disintegrated.xml,"
    },
  },
  {
    id: "LASER_EMITTER_CUTTER",
    name: "$action_laser_emitter_cutter",
    description: "$actiondesc_laser_emitter_cutter",
    sprite: "var(--sprite-action-laser-emitter-cutter)",
    sprite_unidentified: "data/ui_gfx/gun_actions/laser_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/orb_laseremitter_cutter.xml"],
    type: "projectile",
    spawn_level: "0,1,2,3,4",
    spawn_probability: "0.2,0.3,1,0.5,0.1",
    price: 120,
    mana: 40,
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/orb_laseremitter_cutter.xml")
      setCurrentReloadTime(current_reload_time + 10)
      c.game_effect_entities = c.game_effect_entities + "data/entities/misc/effect_disintegrated.xml,"
    },
  },
  {
    id: "DIGGER",
    name: "$action_digger",
    description: "$actiondesc_digger",
    sprite: "var(--sprite-action-digger)",
    sprite_unidentified: "data/ui_gfx/gun_actions/digger_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/digger.xml"],
    type: "projectile",
    spawn_level: "1,2",
    spawn_probability: "1,0.5",
    price: 70,
    mana: 0,
    sound_loop_tag: "sound_digger",
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/digger.xml")
      c.fire_rate_wait = c.fire_rate_wait + 1
      setCurrentReloadTime(current_reload_time - ACTION_DRAW_RELOAD_TIME_INCREASE - 10 )
    },
  },
  {
    id: "POWERDIGGER",
    name: "$action_powerdigger",
    description: "$actiondesc_powerdigger",
    sprite: "var(--sprite-action-powerdigger)",
    sprite_unidentified: "data/ui_gfx/gun_actions/powerdigger_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/powerdigger.xml"],
    type: "projectile",
    spawn_level: "2,3,4",
    spawn_probability: "0.5,1,0.8",
    price: 110,
    mana: 0,
    sound_loop_tag: "sound_digger",
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/powerdigger.xml")
      c.fire_rate_wait = c.fire_rate_wait + 1
      setCurrentReloadTime(current_reload_time - ACTION_DRAW_RELOAD_TIME_INCREASE - 10 )
    },
  },
  {
    id: "CHAINSAW",
    name: "$action_chainsaw",
    description: "$actiondesc_chainsaw",
    sprite: "var(--sprite-action-chainsaw)",
    sprite_unidentified: "data/ui_gfx/gun_actions/chainsaw_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/chainsaw.xml"],
    type: "projectile",
    spawn_level: "0,2",
    spawn_probability: "1,1",
    price: 80,
    mana: 1,
    
    sound_loop_tag: "sound_chainsaw",
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/chainsaw.xml")
      c.fire_rate_wait = 0
      c.spread_degrees = c.spread_degrees + 6.0
      setCurrentReloadTime(current_reload_time - ACTION_DRAW_RELOAD_TIME_INCREASE - 10 )
    },
  },
  {
    id: "LUMINOUS_DRILL",
    name: "$action_luminous_drill",
    description: "$actiondesc_luminous_drill",
    sprite: "var(--sprite-action-luminous-drill)",
    sprite_unidentified: "data/ui_gfx/gun_actions/chainsaw_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/luminous_drill.xml"],
    type: "projectile",
    spawn_level: "0,2,10",
    spawn_probability: "1,1,0.1",
    price: 150,
    mana: 10,
    
    sound_loop_tag: "sound_digger",
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/luminous_drill.xml")
      c.fire_rate_wait = c.fire_rate_wait - 35
      setCurrentReloadTime(current_reload_time - ACTION_DRAW_RELOAD_TIME_INCREASE - 10 )
    },
  },
  {
    id: "LASER_LUMINOUS_DRILL",
    name: "$action_luminous_drill_timer",
    description: "$actiondesc_luminous_drill_timer",
    sprite: "var(--sprite-action-laser-luminous-drill)",
    sprite_unidentified: "data/ui_gfx/gun_actions/chainsaw_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/luminous_drill.xml"],
    type: "projectile",
    spawn_level: "0,2,6,10",
    spawn_probability: "1,1,0.2,0.1",
    price: 220,
    mana: 30,
    
    sound_loop_tag: "sound_digger",
    action: function(c: GunActionState) {
      add_projectile_trigger_timer("data/entities/projectiles/deck/luminous_drill.xml",4,1)
      c.fire_rate_wait = c.fire_rate_wait - 35
      setCurrentReloadTime(current_reload_time - ACTION_DRAW_RELOAD_TIME_INCREASE - 10 )
    },
  },
  {
    id: "TENTACLE",
    name: "$action_tentacle",
    description: "$actiondesc_tentacle",
    spawn_requires_flag: "card_unlocked_tentacle",
    sprite: "var(--sprite-action-tentacle)",
    sprite_unidentified: "data/ui_gfx/gun_actions/tentacle_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/tentacle.xml"],
    type: "projectile",
    spawn_level: "3,4,5,6",
    spawn_probability: "1,0.5,1,0.8",
    price: 200,
    mana: 20,
    
    custom_xml_file: "data/entities/misc/custom_cards/tentacle.xml",
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/tentacle.xml")
      c.fire_rate_wait = c.fire_rate_wait + 40
    },
  },
  {
    id: "TENTACLE_TIMER",
    name: "$action_tentacle_timer",
    description: "$actiondesc_tentacle_timer",
    spawn_requires_flag: "card_unlocked_tentacle",
    sprite: "var(--sprite-action-tentacle-timer)",
    sprite_unidentified: "data/ui_gfx/gun_actions/tentacle_timer_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/tentacle.xml"],
    type: "projectile",
    spawn_level: "3,4,5,6",
    spawn_probability: "0.6,0.8,0.6,0.7",
    price: 250,
    mana: 20,
    
    custom_xml_file: "data/entities/misc/custom_cards/tentacle_timer.xml",
    action: function(c: GunActionState) {
      add_projectile_trigger_timer("data/entities/projectiles/deck/tentacle.xml",20,1)
      c.fire_rate_wait = c.fire_rate_wait + 40
    },
  },
  
  {
    id: "HEAL_BULLET",
    name: "$action_heal_bullet",
    description: "$actiondesc_heal_bullet",
    sprite: "var(--sprite-action-heal-bullet)",
    sprite_unidentified: "data/ui_gfx/gun_actions/heal_bullet_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/heal_bullet.xml"],
    type: "projectile",
    spawn_level: "2,3,4",
    spawn_probability: "1,1,0.6",
    price: 60,
    mana: 15,
    max_uses: 20,
    never_unlimited: true,
    custom_xml_file: "data/entities/misc/custom_cards/heal_bullet.xml",
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/heal_bullet.xml")
      c.fire_rate_wait = c.fire_rate_wait + 4
      c.spread_degrees = c.spread_degrees + 2.0
    },
  },
  {
    id: "ANTIHEAL",
    name: "$action_antiheal",
    description: "$actiondesc_antiheal",
    sprite: "var(--sprite-action-antiheal)",
    sprite_unidentified: "data/ui_gfx/gun_actions/bullet_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/healhurt.xml"],
    type: "projectile",
    spawn_level: "2,3,4,5",
    spawn_probability: "0.4,0.3,0.3,0.3",
    price: 200,
    mana: 20,
    max_uses: 20,
    never_unlimited: true,
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/healhurt.xml")
      c.fire_rate_wait = c.fire_rate_wait + 8
      c.screenshake = c.screenshake + 2
      c.spread_degrees = c.spread_degrees + 3.0
      shot_effects.recoil_knockback = shot_effects.recoil_knockback + 12.0
    },
  },
  {
    id: "SPIRAL_SHOT",
    name: "$action_spiral_shot",
    description: "$actiondesc_spiral_shot",
    spawn_requires_flag: "card_unlocked_spiral_shot",
    sprite: "var(--sprite-action-spiral-shot)",
    sprite_unidentified: "data/ui_gfx/gun_actions/spiral_shot_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/spiral_shot.xml"],
    type: "projectile",
    spawn_level: "4,5,6",
    spawn_probability: "0.7,0.8,0.7",
    price: 190,
    mana: 50,
    max_uses: 15,
    custom_xml_file: "data/entities/misc/custom_cards/spiral_shot.xml",
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/spiral_shot.xml")
      c.fire_rate_wait = c.fire_rate_wait + 20
    },
  },
  {
    id: "MAGIC_SHIELD",
    name: "$action_magic_shield",
    description: "$actiondesc_magic_shield",
    sprite: "var(--sprite-action-magic-shield)",
    sprite_unidentified: "data/ui_gfx/gun_actions/spiral_shot_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/magic_shield_start.xml"],
    type: "projectile",
    spawn_level: "2,4,5,6",
    spawn_probability: "0.5,0.6,0.7,1",
    price: 100,
    mana: 40,
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/magic_shield_start.xml")
      c.fire_rate_wait = c.fire_rate_wait + 20
    },
  },
  {
    id: "BIG_MAGIC_SHIELD",
    name: "$action_big_magic_shield",
    description: "$actiondesc_big_magic_shield",
    sprite: "var(--sprite-action-big-magic-shield)",
    sprite_unidentified: "data/ui_gfx/gun_actions/spiral_shot_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/big_magic_shield_start.xml"],
    type: "projectile",
    spawn_level: "2,4,5,6,10",
    spawn_probability: "0.2,0.4,0.5,0.6,0.2",
    price: 120,
    mana: 60,
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/big_magic_shield_start.xml")
      c.fire_rate_wait = c.fire_rate_wait + 30
    },
  },
  {
    id: "CHAIN_BOLT",
    name: "$action_chain_bolt",
    description: "$actiondesc_chain_bolt",
    sprite: "var(--sprite-action-chain-bolt)",
    related_projectiles: ["data/entities/projectiles/deck/chain_bolt.xml"],
    type: "projectile",
    spawn_level: "0,4,5,6",
    spawn_probability: "0.75,1,0.8,0.6",
    price: 240,
    mana: 80,
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/chain_bolt.xml")
      c.spread_degrees = c.spread_degrees + 14.0
      c.fire_rate_wait = c.fire_rate_wait + 45
    },
  },
  {
    id: "FIREBALL",
    name: "$action_fireball",
    description: "$actiondesc_fireball",
    sprite: "var(--sprite-action-fireball)",
    sprite_unidentified: "data/ui_gfx/gun_actions/fireball_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/fireball.xml"],
    type: "projectile",
    spawn_level: "0,3,4,6",
    spawn_probability: "1,0.7,1,0.5",
    price: 220,
    mana: 70,
    max_uses: 15,
    custom_xml_file: "data/entities/misc/custom_cards/fireball.xml",
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/fireball.xml")
      c.spread_degrees = c.spread_degrees + 4.0
      c.fire_rate_wait = c.fire_rate_wait + 50
      shot_effects.recoil_knockback = shot_effects.recoil_knockback + 20.0
    },
  },
  {
    id: "METEOR",
    name: "$action_meteor",
    description: "$actiondesc_meteor",
    sprite: "var(--sprite-action-meteor)",
    sprite_unidentified: "data/ui_gfx/gun_actions/meteor_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/meteor.xml"],
    type: "projectile",
    spawn_level: "4,5,6,10",
    spawn_probability: "0.6,0.6,0.7,0.5",
    price: 280,
    mana: 150,
    max_uses: 10,
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/meteor.xml")
    },
  },
  {
    id: "FLAMETHROWER",
    name: "$action_flamethrower",
    description: "$actiondesc_flamethrower",
    sprite: "var(--sprite-action-flamethrower)",
    sprite_unidentified: "data/ui_gfx/gun_actions/flamethrower_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/flamethrower.xml"],
    type: "projectile",
    spawn_level: "2,3,4,6",
    spawn_probability: "0.8,0.9,0.9,0.6",
    price: 220,
    mana: 20,
    max_uses: 60,
    custom_xml_file: "data/entities/misc/custom_cards/flamethrower.xml",
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/flamethrower.xml")
      c.spread_degrees = c.spread_degrees + 4.0
    },
  },
  {
    id: "ICEBALL",
    name: "$action_iceball",
    description: "$actiondesc_iceball",
    sprite: "var(--sprite-action-iceball)",
    sprite_unidentified: "data/ui_gfx/gun_actions/fireball_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/iceball.xml"],
    type: "projectile",
    spawn_level: "2,3,4,6",
    spawn_probability: "0.8,0.9,0.9,0.6",
    price: 260,
    mana: 90,
    max_uses: 15,
    custom_xml_file: "data/entities/misc/custom_cards/iceball.xml",
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/iceball.xml")
      c.spread_degrees = c.spread_degrees + 8.0
      c.fire_rate_wait = c.fire_rate_wait + 80
      shot_effects.recoil_knockback = shot_effects.recoil_knockback + 20.0
    },
  },
  
  {
    id: "SLIMEBALL",
    name: "$action_slimeball",
    description: "$actiondesc_slimeball",
    sprite: "var(--sprite-action-slimeball)",
    sprite_unidentified: "data/ui_gfx/gun_actions/slimeball_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/slime.xml"],
    type: "projectile",
    spawn_level: "0,3,4",
    spawn_probability: "1,1,0.7",
    price: 130,
    mana: 20,
    
    custom_xml_file: "data/entities/misc/custom_cards/slimeball.xml",
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/slime.xml")
      c.spread_degrees = c.spread_degrees + 4.0
      c.fire_rate_wait = c.fire_rate_wait + 10
      c.speed_multiplier = c.speed_multiplier * 1.1
      
      if ( c.speed_multiplier >= 20 )  {
        c.speed_multiplier = Math.min( c.speed_multiplier, 20 )
      } else if ( c.speed_multiplier < 0 )  {
        c.speed_multiplier = 0
      }
    },
  },
  {
    id: "DARKFLAME",
    name: "$action_darkflame",
    description: "$actiondesc_darkflame",
    sprite: "var(--sprite-action-darkflame)",
    sprite_unidentified: "data/ui_gfx/gun_actions/darkflame_unidentified.png",
    related_projectiles: ["data/entities/projectiles/darkflame.xml"],
    type: "projectile",
    spawn_level: "3,5,6",
    spawn_probability: "1,0.9,0.8",
    price: 180,
    mana: 90,
    custom_xml_file: "data/entities/misc/custom_cards/darkflame.xml",
    max_uses: 60,
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/darkflame.xml")
      c.fire_rate_wait = c.fire_rate_wait + 20
    },
  },
  {
    id: "MISSILE",
    name: "$action_missile",
    description: "$actiondesc_missile",
    sprite: "var(--sprite-action-missile)",
    related_projectiles: ["data/entities/projectiles/deck/rocket_player.xml"],
    type: "projectile",
    spawn_level: "1,2,3,5",
    spawn_probability: "0.5,0.5,1,1",
    price: 200,
    mana: 60,
    max_uses: 20,
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/rocket_player.xml")
      setCurrentReloadTime(current_reload_time + 30)
      c.spread_degrees = c.spread_degrees + 3.0
      shot_effects.recoil_knockback = shot_effects.recoil_knockback + 60.0
    },
  },
  {
    id: "FUNKY_SPELL",
    name: "???",
    description: "???",
    sprite: "var(--sprite-action-funky-spell)",
    sprite_unidentified: "data/ui_gfx/gun_actions/light_bullet_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/machinegun_bullet.xml"],
    type: "projectile",
    spawn_requires_flag: "card_unlocked_funky",
    spawn_level: "6,10",
    spawn_probability: "0.1,0.1",
    price: 50,
    mana: 5,
    
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/machinegun_bullet.xml")
      c.fire_rate_wait = c.fire_rate_wait - 3
      c.screenshake = c.screenshake + 0.2
      c.spread_degrees = c.spread_degrees + 2.0
      c.damage_critical_chance = c.damage_critical_chance + 1
    },
  },
  {
    id: "PEBBLE",
    name: "$action_pebble",
    description: "$actiondesc_pebble",
    sprite: "var(--sprite-action-pebble)",
    sprite_unidentified: "data/ui_gfx/gun_actions/pebble_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/pebble_player.xml"],
    type: "projectile",
    spawn_level: "1,2,4,6",
    spawn_probability: "0.9,1,0.9,0.6",
    price: 200,
    mana: 120,
    max_uses: 10,
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/pebble_player.xml")
      c.fire_rate_wait = c.fire_rate_wait + 80
    },
  },
  {
    id: "DYNAMITE",
    name: "$action_dynamite",
    description: "$actiondesc_dynamite",
    sprite: "var(--sprite-action-dynamite)",
    sprite_unidentified: "data/ui_gfx/gun_actions/dynamite_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/tnt.xml"],
    type: "projectile",
    spawn_level: "0,1,2,3,4",
    spawn_probability: "1,0.9,0.8,0.7,0.6",
    price: 160,
    mana: 50,
    max_uses: 16,
    custom_xml_file: "data/entities/misc/custom_cards/tnt.xml",
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/tnt.xml")
      c.fire_rate_wait = c.fire_rate_wait + 50
      c.spread_degrees = c.spread_degrees + 6.0
    },
  },
  {
    id: "GLITTER_BOMB",
    name: "$action_glitter_bomb",
    description: "$actiondesc_glitter_bomb",
    sprite: "var(--sprite-action-glitter-bomb)",
    sprite_unidentified: "data/ui_gfx/gun_actions/dynamite_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/glitter_bomb.xml"],
    type: "projectile",
    spawn_level: "0,1,2,3,4",
    spawn_probability: "0.8,0.9,0.8,0.7,0.6",
    price: 200,
    mana: 70,
    max_uses: 16,
    custom_xml_file: "data/entities/misc/custom_cards/glitter_bomb.xml",
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/glitter_bomb.xml")
      c.fire_rate_wait = c.fire_rate_wait + 50
      c.spread_degrees = c.spread_degrees + 12.0
    },
  },
  {
    id: "BUCKSHOT",
    name: "$action_buckshot",
    description: "$actiondesc_buckshot",
    sprite: "var(--sprite-action-buckshot)",
    sprite_unidentified: "data/ui_gfx/gun_actions/dynamite_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/buckshot_player.xml",3],
    type: "projectile",
    spawn_level: "0,1,2,3,4",
    spawn_probability: "1,1,0.9,0.9,0.6",
    price: 160,
    mana: 25,
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/buckshot_player.xml")
      add_projectile("data/entities/projectiles/deck/buckshot_player.xml")
      add_projectile("data/entities/projectiles/deck/buckshot_player.xml")
      c.fire_rate_wait = c.fire_rate_wait + 8
      c.spread_degrees = c.spread_degrees + 14.0
    },
  },
  {
    id: "FREEZING_GAZE",
    name: "$action_freezing_gaze",
    description: "$actiondesc_freezing_gaze",
    sprite: "var(--sprite-action-freezing-gaze)",
    sprite_unidentified: "data/ui_gfx/gun_actions/dynamite_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/freezing_gaze_beam.xml",12],
    type: "projectile",
    spawn_level: "2,3,4",
    spawn_probability: "0.9,1,1",
    price: 180,
    mana: 45,
    max_uses: 20,
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/freezing_gaze_beam.xml")
      add_projectile("data/entities/projectiles/deck/freezing_gaze_beam.xml")
      add_projectile("data/entities/projectiles/deck/freezing_gaze_beam.xml")
      add_projectile("data/entities/projectiles/deck/freezing_gaze_beam.xml")
      add_projectile("data/entities/projectiles/deck/freezing_gaze_beam.xml")
      add_projectile("data/entities/projectiles/deck/freezing_gaze_beam.xml")
      add_projectile("data/entities/projectiles/deck/freezing_gaze_beam.xml")
      add_projectile("data/entities/projectiles/deck/freezing_gaze_beam.xml")
      add_projectile("data/entities/projectiles/deck/freezing_gaze_beam.xml")
      add_projectile("data/entities/projectiles/deck/freezing_gaze_beam.xml")
      add_projectile("data/entities/projectiles/deck/freezing_gaze_beam.xml")
      add_projectile("data/entities/projectiles/deck/freezing_gaze_beam.xml")
      c.pattern_degrees = 30
      c.fire_rate_wait = c.fire_rate_wait + 20
    },
  },
  {
    id: "GLOWING_BOLT",
    name: "$action_glowing_bolt",
    description: "$actiondesc_glowing_bolt",
    sprite: "var(--sprite-action-glowing-bolt)",
    sprite_unidentified: "data/ui_gfx/gun_actions/dynamite_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/glowing_bolt.xml"],
    type: "projectile",
    spawn_level: "3,4,5,10",
    spawn_probability: "0.8,0.9,1,0.1",
    price: 220,
    mana: 65,
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/glowing_bolt.xml")
      c.fire_rate_wait = c.fire_rate_wait + 40
      c.spread_degrees = c.spread_degrees + 6.0
    },
  },
  
  {
    id: "SPORE_POD",
    name: "$action_spore_pod",
    description: "$actiondesc_spore_pod",
    sprite: "var(--sprite-action-spore-pod)",
    sprite_unidentified: "data/ui_gfx/gun_actions/spore_pod_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/spore_pod.xml"],
    type: "projectile",
    spawn_level: "1,2,3,4,5",
    spawn_probability: "0.7,0.8,0.9,0.8,0.6",
    price: 200,
    mana: 20,
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/spore_pod.xml")
      c.fire_rate_wait = c.fire_rate_wait + 40
      shot_effects.recoil_knockback = shot_effects.recoil_knockback + 30.0
    },
  },
  {
    id: "GLUE_SHOT",
    name: "$action_glue_shot",
    description: "$actiondesc_glue_shot",
    sprite: "var(--sprite-action-glue-shot)",
    sprite_unidentified: "data/ui_gfx/gun_actions/dynamite_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/glue_shot.xml"],
    type: "projectile",
    spawn_level: "2,3,4,5",
    spawn_probability: "0.7,0.4,0.2,0.5",
    price: 140,
    mana: 25,
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/glue_shot.xml")
      c.fire_rate_wait = c.fire_rate_wait + 30
      c.spread_degrees = c.spread_degrees + 5.0
    },
  },
  {
    id: "BOMB_HOLY",
    name: "$action_bomb_holy",
    description: "$actiondesc_bomb_holy",
    spawn_requires_flag: "card_unlocked_bomb_holy",
    sprite: "var(--sprite-action-bomb-holy)",
    sprite_unidentified: "data/ui_gfx/gun_actions/bomb_unidentified.png",
    related_projectiles: ["data/entities/projectiles/bomb_holy.xml"],
    type: "projectile",
    spawn_level: "2,3,4,5,6,10",
    spawn_probability: "0.2,0.2,0.2,0.2,0.2,0.5",
    price: 400,
    mana: 300,
    max_uses: 2,
    custom_xml_file: "data/entities/misc/custom_cards/bomb_holy.xml",
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/bomb_holy.xml")
      setCurrentReloadTime(current_reload_time + 80)
      shot_effects.recoil_knockback = shot_effects.recoil_knockback + 100.0
      c.fire_rate_wait = c.fire_rate_wait + 40
    },
  },
  {
    id: "BOMB_HOLY_GIGA",
    name: "$action_bomb_holy_giga",
    description: "$actiondesc_bomb_holy_giga",
    spawn_requires_flag: "card_unlocked_bomb_holy_giga",
    sprite: "var(--sprite-action-bomb-holy-giga)",
    sprite_unidentified: "data/ui_gfx/gun_actions/bomb_unidentified.png",
    related_projectiles: ["data/entities/projectiles/bomb_holy_giga.xml"],
    type: "projectile",
    spawn_level: "10",
    spawn_probability: "1",
    price: 600,
    mana: 600,
    max_uses: 2,
    never_unlimited: true,
    custom_xml_file: "data/entities/misc/custom_cards/bomb_holy_giga.xml",
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/bomb_holy_giga.xml")
      setCurrentReloadTime(current_reload_time + 160)
      shot_effects.recoil_knockback = shot_effects.recoil_knockback + 100.0
      c.fire_rate_wait = c.fire_rate_wait + 120
    },
  },
  {
    id: "PROPANE_TANK",
    name: "$action_propane_tank",
    description: "$actiondesc_propane_tank",
    sprite: "var(--sprite-action-propane-tank)",
    sprite_unidentified: "data/ui_gfx/gun_actions/bomb_unidentified.png",
    related_projectiles: ["data/entities/projectiles/propane_tank.xml"],
    type: "projectile",
    spawn_level: "2,3,4,5,6",
    spawn_probability: "1,1,0.8,0.8,0.7",
    price: 200,
    mana: 75,
    max_uses: 10,
    custom_xml_file: "data/entities/misc/custom_cards/propane_tank.xml",
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/propane_tank.xml")
      c.fire_rate_wait = c.fire_rate_wait + 100
    },
  },
  {
    id: "BOMB_CART",
    name: "$action_bomb_cart",
    description: "$actiondesc_bomb_cart",
    sprite: "var(--sprite-action-bomb-cart)",
    sprite_unidentified: "data/ui_gfx/gun_actions/bomb_unidentified.png",
    related_projectiles: ["data/entities/projectiles/bomb_cart.xml"],
    type: "projectile",
    spawn_level: "2,3,4,5,6",
    spawn_probability: "0.6,0.6,0.5,0.8,0.6",
    price: 200,
    mana: 75,
    max_uses: 6,
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/bomb_cart.xml")
      shot_effects.recoil_knockback = shot_effects.recoil_knockback + 200.0
      c.fire_rate_wait = c.fire_rate_wait + 60
    },
  },
  {
    id: "CURSED_ORB",
    name: "$action_cursed_orb",
    description: "$actiondesc_cursed_orb",
    sprite: "var(--sprite-action-cursed-orb)",
    sprite_unidentified: "data/ui_gfx/gun_actions/disc_bullet_unidentified.png",
    related_projectiles: ["data/entities/projectiles/orb_cursed.xml"],
    type: "projectile",
    spawn_level: "1,2,3",
    spawn_probability: "0.3,0.2,0.1",
    price: 200,
    mana: 40,
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/orb_cursed.xml")
      c.fire_rate_wait = c.fire_rate_wait + 20
      shot_effects.recoil_knockback = 40.0
    },
  },
  {
    id: "EXPANDING_ORB",
    name: "$action_expanding_orb",
    description: "$actiondesc_expanding_orb",
    sprite: "var(--sprite-action-expanding-orb)",
    sprite_unidentified: "data/ui_gfx/gun_actions/disc_bullet_unidentified.png",
    related_projectiles: ["data/entities/projectiles/orb_expanding.xml"],
    type: "projectile",
    spawn_level: "2,3,4,5,6",
    spawn_probability: "0.5,0.5,1,1,0.5",
    price: 200,
    mana: 70,
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/orb_expanding.xml")
      c.fire_rate_wait = c.fire_rate_wait + 30
      shot_effects.recoil_knockback = 20.0
    },
  },
  {
    id: "CRUMBLING_EARTH",
    name: "$action_crumbling_earth",
    description: "$actiondesc_crumbling_earth",
    spawn_requires_flag: "card_unlocked_crumbling_earth",
    sprite: "var(--sprite-action-crumbling-earth)",
    sprite_unidentified: "data/ui_gfx/gun_actions/bomb_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/crumbling_earth.xml"],
    type: "projectile",
    spawn_level: "2,3,4,5,6",
    spawn_probability: "0.4,0.3,0.5,0.6,0.9",
    price: 300,
    mana: 240,
    max_uses: 3,
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/crumbling_earth.xml")
    },
  },
  {
    id: "SUMMON_ROCK",
    name: "$action_summon_rock",
    description: "$actiondesc_summon_rock",
    sprite: "var(--sprite-action-summon-rock)",
    sprite_unidentified: "data/ui_gfx/gun_actions/bomb_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/rock.xml"],
    type: "projectile",
    spawn_level: "0,1,2,3,4,5,6",
    spawn_probability: "0.8,0.8,0.6,0.6,0.3,0.7,0.7",
    price: 160,
    mana: 100,
    max_uses: 3,
    custom_xml_file: "data/entities/misc/custom_cards/summon_rock.xml",
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/rock.xml")
    },
  },
  {
    id: "SUMMON_EGG",
    name: "$action_summon_egg",
    description: "$actiondesc_summon_egg",
    sprite: "var(--sprite-action-summon-egg)",
    sprite_unidentified: "data/ui_gfx/gun_actions/bomb_unidentified.png",
    related_projectiles: ["data/entities/items/pickup/egg_monster.xml"],
    type: "projectile",
    spawn_level: "0,1,2,3,4,5,6",
    spawn_probability: "0.7,0.8,0.8,0.7,0.6,0.6,0.5",
    price: 220,
    mana: 100,
    max_uses: 2,
    action: function(c: GunActionState) {
      SetRandomSeed(this.id,  GameGetFrameNum(), GameGetFrameNum() )
      let types = ["monster","slime","red","fire"]
      let rnd = Random(this.id, 1, types.length)
      let egg_name = "egg_" + String(types[rnd - 1]) + ".xml"
      add_projectile("data/entities/items/pickup/")
    },
  },
  {
    id: "SUMMON_HOLLOW_EGG",
    name: "$action_summon_hollow_egg",
    description: "$actiondesc_summon_hollow_egg",
    sprite: "var(--sprite-action-summon-hollow-egg)",
    sprite_unidentified: "data/ui_gfx/gun_actions/bomb_unidentified.png",
    related_projectiles: ["data/entities/items/pickup/egg_hollow.xml"],
    type: "projectile",
    spawn_level: "0,1,2,5,6",
    spawn_probability: "0.6,0.8,0.7,0.8,0.3",
    price: 140,
    mana: 30,
    action: function(c: GunActionState) {
      add_projectile_trigger_death("data/entities/items/pickup/egg_hollow.xml", 1)
      c.fire_rate_wait = c.fire_rate_wait - 12
    },
  },
  {
    id: "TNTBOX",
    name: "$action_tntbox",
    description: "$actiondesc_tntbox",
    sprite: "var(--sprite-action-tntbox)",
    sprite_unidentified: "data/ui_gfx/gun_actions/bomb_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/tntbox.xml"],
    type: "projectile",
    spawn_level: "1,2,3,5",
    spawn_probability: "0.8,0.9,0.5,0.4",
    price: 150,
    mana: 40,
    max_uses: 15,
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/tntbox.xml")
      c.fire_rate_wait = c.fire_rate_wait + 30
    },
  },
  {
    id: "TNTBOX_BIG",
    name: "$action_tntbox_big",
    description: "$actiondesc_tntbox_big",
    sprite: "var(--sprite-action-tntbox-big)",
    sprite_unidentified: "data/ui_gfx/gun_actions/bomb_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/tntbox_big.xml"],
    type: "projectile",
    spawn_level: "2,4,5",
    spawn_probability: "0.8,1,0.7",
    price: 170,
    mana: 40,
    max_uses: 15,
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/tntbox_big.xml")
      c.fire_rate_wait = c.fire_rate_wait + 30
    },
  },
  {
    id: "SWARM_FLY",
    name: "$action_swarm_fly",
    description: "$actiondesc_swarm_fly",
    sprite: "var(--sprite-action-swarm-fly)",
    sprite_unidentified: "data/ui_gfx/gun_actions/spiral_shot_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/swarm_fly.xml",5],
    type: "static",
    spawn_level: "2,4,5",
    spawn_probability: "0.3,0.4,0.5",
    price: 90,
    mana: 60,
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/swarm_fly.xml")
      add_projectile("data/entities/projectiles/deck/swarm_fly.xml")
      add_projectile("data/entities/projectiles/deck/swarm_fly.xml")
      add_projectile("data/entities/projectiles/deck/swarm_fly.xml")
      c.spread_degrees = c.spread_degrees + 6.0
      c.fire_rate_wait = c.fire_rate_wait + 60
      setCurrentReloadTime(current_reload_time + 20)
    },
  },
  {
    id: "SWARM_FIREBUG",
    name: "$action_swarm_firebug",
    description: "$actiondesc_swarm_firebug",
    sprite: "var(--sprite-action-swarm-firebug)",
    sprite_unidentified: "data/ui_gfx/gun_actions/spiral_shot_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/swarm_firebug.xml",4],
    type: "static",
    spawn_level: "2,5,6",
    spawn_probability: "0.2,0.4,0.5",
    price: 100,
    mana: 70,
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/swarm_firebug.xml")
      add_projectile("data/entities/projectiles/deck/swarm_firebug.xml")
      add_projectile("data/entities/projectiles/deck/swarm_firebug.xml")
      c.spread_degrees = c.spread_degrees + 12.0
      c.fire_rate_wait = c.fire_rate_wait + 60
      setCurrentReloadTime(current_reload_time + 20)
    },
  },
  {
    id: "SWARM_WASP",
    name: "$action_swarm_wasp",
    description: "$actiondesc_swarm_wasp",
    sprite: "var(--sprite-action-swarm-wasp)",
    sprite_unidentified: "data/ui_gfx/gun_actions/spiral_shot_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/swarm_wasp.xml",6],
    type: "static",
    spawn_level: "4,5,6",
    spawn_probability: "0.2,0.5,0.6",
    price: 120,
    mana: 80,
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/swarm_wasp.xml")
      add_projectile("data/entities/projectiles/deck/swarm_wasp.xml")
      add_projectile("data/entities/projectiles/deck/swarm_wasp.xml")
      add_projectile("data/entities/projectiles/deck/swarm_wasp.xml")
      add_projectile("data/entities/projectiles/deck/swarm_wasp.xml")
      c.spread_degrees = c.spread_degrees + 24.0
      c.fire_rate_wait = c.fire_rate_wait + 60
      setCurrentReloadTime(current_reload_time + 20)
    },
  },
  {
    id: "FRIEND_FLY",
    name: "$action_friend_fly",
    description: "$actiondesc_friend_fly",
    sprite: "var(--sprite-action-friend-fly)",
    sprite_unidentified: "data/ui_gfx/gun_actions/spiral_shot_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/friend_fly.xml"],
    type: "static",
    spawn_level: "4,5,6",
    spawn_probability: "0.2,0.6,0.5",
    price: 160,
    mana: 120,
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/friend_fly.xml")
      c.spread_degrees = c.spread_degrees + 24.0
      c.fire_rate_wait = c.fire_rate_wait + 80
      setCurrentReloadTime(current_reload_time + 40)
    },
  },
  
  {
    id: "ACIDSHOT",
    name: "$action_acidshot",
    description: "$actiondesc_acidshot",
    sprite: "var(--sprite-action-acidshot)",
    sprite_unidentified: "data/ui_gfx/gun_actions/acidshot_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/acidshot.xml"],
    type: "projectile",
    spawn_level: "1,2,3,4",
    spawn_probability: "1,1,0.9,0.6",
    price: 180,
    mana: 20,
    max_uses: 20,
    custom_xml_file: "data/entities/misc/custom_cards/acidshot.xml",
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/acidshot.xml")
      c.fire_rate_wait = c.fire_rate_wait + 10
    },
  },
  {
    id: "THUNDERBALL",
    name: "$action_thunderball",
    description: "$actiondesc_thunderball",
    sprite: "var(--sprite-action-thunderball)",
    sprite_unidentified: "data/ui_gfx/gun_actions/thunderball_unidentified.png",
    related_projectiles: ["data/entities/projectiles/thunderball.xml"],
    type: "projectile",
    spawn_level: "2,4,6,10",
    spawn_probability: "0.9,1,0.7,0.2",
    price: 300,
    mana: 120,
    max_uses: 3,
    custom_xml_file: "data/entities/misc/custom_cards/thunderball.xml",
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/thunderball.xml")
      c.fire_rate_wait = c.fire_rate_wait + 120
    },
  },
  
  {
    id: "FIREBOMB",
    name: "$action_firebomb",
    description: "$actiondesc_firebomb",
    sprite: "var(--sprite-action-firebomb)",
    sprite_unidentified: "data/ui_gfx/gun_actions/firebomb_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/firebomb.xml"],
    type: "projectile",
    spawn_level: "1,2,3",
    spawn_probability: "1,0.9,0.7",
    price: 90,
    mana: 10,
    
    custom_xml_file: "data/entities/misc/custom_cards/firebomb.xml",
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/firebomb.xml")
    },
  },
  {
    id: "SOILBALL",
    name: "$action_soilball",
    description: "$actiondesc_soilball",
    sprite: "var(--sprite-action-soilball)",
    sprite_unidentified: "data/ui_gfx/gun_actions/firebomb_unidentified.png",
    related_projectiles: ["data/entities/projectiles/chunk_of_soil.xml"],
    type: "material",
    spawn_level: "1,2,3,5",
    spawn_probability: "0.8,0.8,1,0.75",
    price: 10,
    mana: 5,
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/chunk_of_soil.xml")
    },
  },
  
  {
    id: "DEATH_CROSS",
    name: "$action_death_cross",
    description: "$actiondesc_death_cross",
    sprite: "var(--sprite-action-death-cross)",
    sprite_unidentified: "data/ui_gfx/gun_actions/death_cross_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/death_cross.xml"],
    type: "projectile",
    spawn_level: "1,2,3,4,5,6",
    spawn_probability: "1,0.8,0.6,0.5,0.5,0.3",
    price: 210,
    mana: 80,
    custom_xml_file: "data/entities/misc/custom_cards/death_cross.xml",
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/death_cross.xml")
      c.fire_rate_wait = c.fire_rate_wait + 40
    },
  },
  {
    id: "DEATH_CROSS_BIG",
    name: "$action_death_cross_big",
    description: "$actiondesc_death_cross_big",
    sprite: "var(--sprite-action-death-cross-big)",
    sprite_unidentified: "data/ui_gfx/gun_actions/death_cross_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/death_cross_big.xml"],
    type: "projectile",
    spawn_level: "2,3,4,5,6,10",
    spawn_probability: "0.4,0.5,0.55,0.3,0.4,0.2",
    price: 310,
    mana: 150,
    max_uses: 8,
    custom_xml_file: "data/entities/misc/custom_cards/death_cross.xml",
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/death_cross_big.xml")
      c.fire_rate_wait = c.fire_rate_wait + 70
      shot_effects.recoil_knockback = shot_effects.recoil_knockback + 30.0
    },
  },
  {
    id: "INFESTATION",
    name: "$action_infestation",
    description: "$actiondesc_infestation",
    sprite: "var(--sprite-action-infestation)",
    sprite_unidentified: "data/ui_gfx/gun_actions/rubber_ball_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/infestation.xml",10],
    type: "projectile",
    spawn_level: "2,3,4",
    spawn_probability: "0.1,0.3,0.4",
    price: 160,
    mana: 40,
    
    action: function(c: GunActionState) {
      for (const i of luaFor(1, 6)) {
        add_projectile("data/entities/projectiles/deck/infestation.xml")
      }
      
      c.fire_rate_wait = c.fire_rate_wait - 2
      c.spread_degrees = c.spread_degrees + 25
    },
  },
  {
    id: "WALL_HORIZONTAL",
    name: "$action_wall_horizontal",
    description: "$actiondesc_wall_horizontal",
    sprite: "var(--sprite-action-wall-horizontal)",
    sprite_unidentified: "data/ui_gfx/gun_actions/teleport_projectile_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/wall_horizontal.xml"],
    type: "static",
    spawn_level: "0,1,2,4,5",
    spawn_probability: "0.4,0.4,0.6,0.5,0.2",
    price: 160,
    mana: 70,
    
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/wall_horizontal.xml")
      c.fire_rate_wait = c.fire_rate_wait + 5
    },
  },
  {
    id: "WALL_VERTICAL",
    name: "$action_wall_vertical",
    description: "$actiondesc_wall_vertical",
    sprite: "var(--sprite-action-wall-vertical)",
    sprite_unidentified: "data/ui_gfx/gun_actions/teleport_projectile_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/wall_vertical.xml"],
    type: "static",
    spawn_level: "0,1,2,4,5",
    spawn_probability: "0.4,0.4,0.6,0.5,0.2",
    price: 160,
    mana: 70,
    
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/wall_vertical.xml")
      c.fire_rate_wait = c.fire_rate_wait + 5
    },
  },
  {
    id: "WALL_SQUARE",
    name: "$action_wall_square",
    description: "$actiondesc_wall_square",
    sprite: "var(--sprite-action-wall-square)",
    sprite_unidentified: "data/ui_gfx/gun_actions/teleport_projectile_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/wall_square.xml"],
    type: "static",
    spawn_level: "0,1,2,4,5,6",
    spawn_probability: "0.3,0.2,0.6,0.5,0.4,0.4",
    price: 160,
    mana: 70,
    max_uses: 20,
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/wall_square.xml")
      c.fire_rate_wait = c.fire_rate_wait + 20
    },
  },
  {
    id: "TEMPORARY_WALL",
    name: "$action_temporary_wall",
    description: "$actiondesc_temporary_wall",
    sprite: "var(--sprite-action-temporary-wall)",
    sprite_unidentified: "data/ui_gfx/gun_actions/teleport_projectile_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/temporary_wall.xml"],
    type: "utility",
    spawn_level: "0,1,2,4,5",
    spawn_probability: "0.1,0.1,0.3,0.4,0.2",
    price: 100,
    mana: 40,
    max_uses: 20,
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/temporary_wall.xml")
      c.fire_rate_wait = c.fire_rate_wait + 40
    },
  },
  {
    id: "TEMPORARY_PLATFORM",
    name: "$action_temporary_platform",
    description: "$actiondesc_temporary_platform",
    sprite: "var(--sprite-action-temporary-platform)",
    sprite_unidentified: "data/ui_gfx/gun_actions/teleport_projectile_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/temporary_platform.xml"],
    type: "utility",
    spawn_level: "0,1,2,4,5",
    spawn_probability: "0.1,0.1,0.3,0.4,0.2",
    price: 90,
    mana: 30,
    max_uses: 20,
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/temporary_platform.xml")
      c.fire_rate_wait = c.fire_rate_wait + 40
    },
  },
  {
    id: "PURPLE_EXPLOSION_FIELD",
    name: "$action_purple_explosion_field",
    description: "$actiondesc_purple_explosion_field",
    sprite: "var(--sprite-action-purple-explosion-field)",
    sprite_unidentified: "data/ui_gfx/gun_actions/teleport_projectile_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/purple_explosion_field.xml"],
    type: "static",
    spawn_level: "0,1,2,4,5,6",
    spawn_probability: "0.7,1,0.7,0.5,0.5,0.3",
    price: 160,
    mana: 90,
    max_uses: 20,
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/purple_explosion_field.xml")
      c.fire_rate_wait = c.fire_rate_wait + 10
      c.speed_multiplier = c.speed_multiplier - 2
      
      if ( c.speed_multiplier >= 20 )  {
        c.speed_multiplier = Math.min( c.speed_multiplier, 20 )
      } else if ( c.speed_multiplier < 0 )  {
        c.speed_multiplier = 0
      }
    },
  },
  {
    id: "DELAYED_SPELL",
    name: "$action_delayed_spell",
    description: "$actiondesc_delayed_spell",
    sprite: "var(--sprite-action-delayed-spell)",
    sprite_unidentified: "data/ui_gfx/gun_actions/teleport_projectile_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/delayed_spell.xml"],
    type: "static",
    spawn_level: "0,1,2,4,5,6",
    spawn_probability: "0.8,0.8,1,0.7,0.5,0.4",
    price: 240,
    mana: 20,
    action: function(c: GunActionState) {
      add_projectile_trigger_death("data/entities/projectiles/deck/delayed_spell.xml", 3)
      c.fire_rate_wait = c.fire_rate_wait + 10
    },
  },
  {
    id: "LONG_DISTANCE_CAST",
    name: "$action_long_distance_cast",
    description: "$actiondesc_long_distance_cast",
    sprite: "var(--sprite-action-long-distance-cast)",
    sprite_unidentified: "data/ui_gfx/gun_actions/teleport_projectile_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/long_distance_cast.xml"],
    type: "utility",
    spawn_level: "0,1,2,4,5,6",
    spawn_probability: "0.6,0.7,0.8,0.6,0.3,0.4",
    price: 90,
    mana: 0,
    action: function(c: GunActionState) {
      add_projectile_trigger_death("data/entities/projectiles/deck/long_distance_cast.xml", 1)
      c.fire_rate_wait = c.fire_rate_wait - 5
    },
  },
  {
    id: "TELEPORT_CAST",
    name: "$action_teleport_cast",
    description: "$actiondesc_teleport_cast",
    sprite: "var(--sprite-action-teleport-cast)",
    sprite_unidentified: "data/ui_gfx/gun_actions/teleport_projectile_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/teleport_cast.xml"],
    type: "utility",
    spawn_level: "1,2,4,5,6",
    spawn_probability: "0.6,0.6,0.6,0.8,1",
    price: 190,
    mana: 100,
    action: function(c: GunActionState) {
      add_projectile_trigger_death("data/entities/projectiles/deck/teleport_cast.xml", 1)
      c.fire_rate_wait = c.fire_rate_wait + 20
      c.spread_degrees = c.spread_degrees + 24
    },
  },
  {
    id: "SUPER_TELEPORT_CAST",
    name: "$action_super_teleport_cast",
    description: "$actiondesc_super_teleport_cast",
    sprite: "var(--sprite-action-super-teleport-cast)",
    sprite_unidentified: "data/ui_gfx/gun_actions/teleport_projectile_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/super_teleport_cast.xml"],
    type: "utility",
    spawn_level: "2,4,5,6",
    spawn_probability: "0.2,0.6,0.8,0.8",
    price: 160,
    mana: 20,
    action: function(c: GunActionState) {
      add_projectile_trigger_death("data/entities/projectiles/deck/super_teleport_cast.xml", 1)
      c.fire_rate_wait = c.fire_rate_wait + 10
      c.spread_degrees = c.spread_degrees - 6
    },
  },
  {
    id: "CASTER_CAST",
    name: "$action_caster_cast",
    description: "$actiondesc_caster_cast",
    sprite: "var(--sprite-action-caster-cast)",
    sprite_unidentified: "data/ui_gfx/gun_actions/teleport_projectile_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/caster_cast.xml"],
    type: "utility",
    spawn_level: "2,4,5,6,10",
    spawn_probability: "0.2,0.2,0.4,0.4,0.2",
    price: 70,
    mana: 10,
    action: function(c: GunActionState) {
      c.spread_degrees = c.spread_degrees - 24
      c.extra_entities = c.extra_entities + "data/entities/misc/caster_cast.xml,"
      draw_actions( 1, true )
    },
  },
  
  {
    id: "MIST_RADIOACTIVE",
    name: "$action_mist_radioactive",
    description: "$actiondesc_mist_radioactive",
    sprite: "var(--sprite-action-mist-radioactive)",
    sprite_unidentified: "data/ui_gfx/gun_actions/slimeball_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/mist_radioactive.xml"],
    type: "projectile",
    spawn_level: "1,2,3,4",
    spawn_probability: "0.4,0.4,0.4,0.4",
    price: 80,
    mana: 40,
    
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/mist_radioactive.xml")
      c.fire_rate_wait = c.fire_rate_wait + 10
    },
  },
  {
    id: "MIST_ALCOHOL",
    name: "$action_mist_alcohol",
    description: "$actiondesc_mist_alcohol",
    sprite: "var(--sprite-action-mist-alcohol)",
    sprite_unidentified: "data/ui_gfx/gun_actions/slimeball_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/mist_alcohol.xml"],
    type: "projectile",
    spawn_level: "1,2,3,4",
    spawn_probability: "0.4,0.4,0.4,0.4",
    price: 80,
    mana: 40,
    
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/mist_alcohol.xml")
      c.fire_rate_wait = c.fire_rate_wait + 10
    },
  },
  {
    id: "MIST_SLIME",
    name: "$action_mist_slime",
    description: "$actiondesc_mist_slime",
    sprite: "var(--sprite-action-mist-slime)",
    sprite_unidentified: "data/ui_gfx/gun_actions/slimeball_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/mist_slime.xml"],
    type: "projectile",
    spawn_level: "1,2,3,4",
    spawn_probability: "0.4,0.4,0.4,0.4",
    price: 80,
    mana: 40,
    
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/mist_slime.xml")
      c.fire_rate_wait = c.fire_rate_wait + 10
    },
  },
  {
    id: "MIST_BLOOD",
    name: "$action_mist_blood",
    description: "$actiondesc_mist_blood",
    sprite: "var(--sprite-action-mist-blood)",
    sprite_unidentified: "data/ui_gfx/gun_actions/slimeball_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/mist_blood.xml"],
    type: "projectile",
    spawn_level: "1,2,3,4",
    spawn_probability: "0.4,0.4,0.4,0.4",
    price: 120,
    mana: 40,
    max_uses: 10,
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/mist_blood.xml")
      c.fire_rate_wait = c.fire_rate_wait + 10
    },
  },
  {
    id: "CIRCLE_FIRE",
    name: "$action_circle_fire",
    description: "$actiondesc_circle_fire",
    sprite: "var(--sprite-action-circle-fire)",
    sprite_unidentified: "data/ui_gfx/gun_actions/slimeball_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/circle_fire.xml"],
    type: "material",
    spawn_level: "1,2,3,4",
    spawn_probability: "0.4,0.4,0.4,0.4",
    price: 170,
    mana: 20,
    max_uses: 15,
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/circle_fire.xml")
      c.fire_rate_wait = c.fire_rate_wait + 20
    },
  },
  {
    id: "CIRCLE_ACID",
    name: "$action_circle_acid",
    description: "$actiondesc_circle_acid",
    sprite: "var(--sprite-action-circle-acid)",
    sprite_unidentified: "data/ui_gfx/gun_actions/slimeball_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/circle_acid.xml"],
    type: "material",
    spawn_level: "1,2,3,4",
    spawn_probability: "0.4,0.4,0.4,0.4",
    price: 180,
    mana: 40,
    max_uses: 4,
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/circle_acid.xml")
      c.fire_rate_wait = c.fire_rate_wait + 20
    },
  },
  {
    id: "CIRCLE_OIL",
    name: "$action_circle_oil",
    description: "$actiondesc_circle_oil",
    sprite: "var(--sprite-action-circle-oil)",
    sprite_unidentified: "data/ui_gfx/gun_actions/slimeball_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/circle_oil.xml"],
    type: "material",
    spawn_level: "1,2,3,4",
    spawn_probability: "0.4,0.4,0.4,0.4",
    price: 160,
    mana: 20,
    max_uses: 15,
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/circle_oil.xml")
      c.fire_rate_wait = c.fire_rate_wait + 20
    },
  },
  {
    id: "CIRCLE_WATER",
    name: "$action_circle_water",
    description: "$actiondesc_circle_water",
    sprite: "var(--sprite-action-circle-water)",
    sprite_unidentified: "data/ui_gfx/gun_actions/slimeball_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/circle_water.xml"],
    type: "material",
    spawn_level: "1,2,3,4",
    spawn_probability: "0.4,0.4,0.4,0.4",
    price: 160,
    mana: 20,
    max_uses: 15,
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/circle_water.xml")
      c.fire_rate_wait = c.fire_rate_wait + 20
    },
  },
  
  {
    id: "MATERIAL_WATER",
    name: "$action_material_water",
    description: "$actiondesc_material_water",
    sprite: "var(--sprite-action-material-water)",
    sprite_unidentified: "data/ui_gfx/gun_actions/material_water_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/material_water.xml"],
    type: "material",
    spawn_level: "1,2,3,4,5",
    spawn_probability: "0.4,0.4,0.4,0.4,0.4",
    price: 110,
    mana: 0,
    sound_loop_tag: "sound_spray",
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/material_water.xml")
      c.game_effect_entities = c.game_effect_entities + "data/entities/misc/effect_apply_wet.xml,"
      c.fire_rate_wait = c.fire_rate_wait - 15
      setCurrentReloadTime(current_reload_time - ACTION_DRAW_RELOAD_TIME_INCREASE - 10 )
    },
  },
  {
    id: "MATERIAL_OIL",
    name: "$action_material_oil",
    description: "$actiondesc_material_oil",
    sprite: "var(--sprite-action-material-oil)",
    sprite_unidentified: "data/ui_gfx/gun_actions/material_oil_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/material_oil.xml"],
    type: "material",
    spawn_level: "1,2,3,4,5",
    spawn_probability: "0.4,0.4,0.4,0.4,0.4",
    price: 140,
    mana: 0,
    sound_loop_tag: "sound_spray",
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/material_oil.xml")
      c.game_effect_entities = c.game_effect_entities + "data/entities/misc/effect_apply_oiled.xml,"
      c.fire_rate_wait = c.fire_rate_wait - 15
      setCurrentReloadTime(current_reload_time - ACTION_DRAW_RELOAD_TIME_INCREASE - 10 )
    },
  },
  
  {
    id: "MATERIAL_BLOOD",
    name: "$action_material_blood",
    description: "$actiondesc_material_blood",
    sprite: "var(--sprite-action-material-blood)",
    sprite_unidentified: "data/ui_gfx/gun_actions/material_blood_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/material_blood.xml"],
    type: "material",
    spawn_level: "1,2,3,4,5",
    spawn_probability: "0.4,0.4,0.4,0.4,0.4",
    price: 130,
    max_uses: 250,
    mana: 0,
    sound_loop_tag: "sound_spray",
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/material_blood.xml")
      c.game_effect_entities = c.game_effect_entities + "data/entities/misc/effect_apply_bloody.xml,"
      c.fire_rate_wait = c.fire_rate_wait - 15
      setCurrentReloadTime(current_reload_time - ACTION_DRAW_RELOAD_TIME_INCREASE - 10 )
    },
  },
  {
    id: "MATERIAL_ACID",
    name: "$action_material_acid",
    description: "$actiondesc_material_acid",
    sprite: "var(--sprite-action-material-acid)",
    sprite_unidentified: "data/ui_gfx/gun_actions/material_acid_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/material_acid.xml"],
    type: "material",
    spawn_level: "2,3,4,5,6",
    spawn_probability: "0.4,0.4,0.4,0.4,0.4",
    price: 150,
    
    
    mana: 0,
    sound_loop_tag: "sound_spray",
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/material_acid.xml")
      c.fire_rate_wait = c.fire_rate_wait - 15
      setCurrentReloadTime(current_reload_time - ACTION_DRAW_RELOAD_TIME_INCREASE - 10 )
    },
  },
  {
    id: "MATERIAL_CEMENT",
    name: "$action_material_cement",
    description: "$actiondesc_material_cement",
    spawn_requires_flag: "card_unlocked_material_cement",
    sprite: "var(--sprite-action-material-cement)",
    sprite_unidentified: "data/ui_gfx/gun_actions/material_cement_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/material_cement.xml"],
    type: "material",
    spawn_level: "2,3,4,5,6",
    spawn_probability: "0.4,0.4,0.4,0.4,0.4",
    price: 100,
    
    
    mana: 0,
    sound_loop_tag: "sound_spray",
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/material_cement.xml")
      c.fire_rate_wait = c.fire_rate_wait - 15
      setCurrentReloadTime(current_reload_time - ACTION_DRAW_RELOAD_TIME_INCREASE - 10 )
    },
  },
  
  
  {
    id: "TELEPORT_PROJECTILE",
    name: "$action_teleport_projectile",
    description: "$actiondesc_teleport_projectile",
    sprite: "var(--sprite-action-teleport-projectile)",
    sprite_unidentified: "data/ui_gfx/gun_actions/teleport_projectile_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/teleport_projectile.xml"],
    type: "projectile",
    spawn_level: "0,1,2,4,5,6",
    spawn_probability: "0.6,0.6,0.6,0.4,0.4,0.4",
    price: 130,
    mana: 40,
    
    custom_xml_file: "data/entities/misc/custom_cards/teleport_projectile.xml",
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/teleport_projectile.xml")
      c.fire_rate_wait = c.fire_rate_wait + 3
      c.spread_degrees = c.spread_degrees - 2.0
    },
  },
  {
    id: "TELEPORT_PROJECTILE_SHORT",
    name: "$action_teleport_projectile_short",
    description: "$actiondesc_teleport_projectile_short",
    sprite: "var(--sprite-action-teleport-projectile-short)",
    sprite_unidentified: "data/ui_gfx/gun_actions/teleport_projectile_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/teleport_projectile_short.xml"],
    type: "projectile",
    spawn_level: "0,1,2,4,5,6",
    spawn_probability: "0.6,0.6,0.6,0.4,0.4,0.4",
    price: 130,
    mana: 20,
    
    custom_xml_file: "data/entities/misc/custom_cards/teleport_projectile_short.xml",
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/teleport_projectile_short.xml")
      c.spread_degrees = c.spread_degrees - 2.0
    },
  },
  {
    id: "TELEPORT_PROJECTILE_STATIC",
    name: "$action_teleport_projectile_static",
    description: "$actiondesc_teleport_projectile_static",
    sprite: "var(--sprite-action-teleport-projectile-static)",
    sprite_unidentified: "data/ui_gfx/gun_actions/teleport_projectile_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/teleport_projectile_static.xml"],
    type: "projectile",
    spawn_level: "0,1,2,4,5,6",
    spawn_probability: "0.6,0.6,0.6,0.4,0.4,0.4",
    price: 90,
    mana: 40,
    
    custom_xml_file: "data/entities/misc/custom_cards/teleport_projectile_static.xml",
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/teleport_projectile_static.xml")
      c.fire_rate_wait = c.fire_rate_wait + 3
      c.spread_degrees = c.spread_degrees - 2.0
    },
  },
  {
    id: "SWAPPER_PROJECTILE",
    name: "$action_swapper_projectile",
    description: "$actiondesc_swapper_projectile",
    sprite: "var(--sprite-action-swapper-projectile)",
    sprite_unidentified: "data/ui_gfx/gun_actions/light_bullet_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/swapper.xml"],
    type: "projectile",
    spawn_level: "0,1,2,4,5,6",
    spawn_probability: "0.05,0.05,0.1,0.4,0.4,0.1",
    price: 100,
    mana: 5,
    
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/swapper.xml")
      c.fire_rate_wait = c.fire_rate_wait + 3
      c.screenshake = c.screenshake + 0.5
      c.spread_degrees = c.spread_degrees - 2.0
      c.damage_critical_chance = c.damage_critical_chance + 5
    },
  },
  {
    id: "TELEPORT_PROJECTILE_CLOSER",
    name: "$action_teleport_closer",
    description: "$actiondesc_teleport_closer",
    sprite: "var(--sprite-action-teleport-projectile-closer)",
    sprite_unidentified: "data/ui_gfx/gun_actions/teleport_projectile_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/teleport_projectile_closer.xml"],
    type: "projectile",
    spawn_level: "0,1,2,4,5,6",
    spawn_probability: "0.4,0.6,0.6,0.7,0.4,0.4",
    price: 130,
    mana: 20,
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/teleport_projectile_closer.xml")
      c.spread_degrees = c.spread_degrees - 2.0
    },
  },
  
  
  {
    id: "NUKE",
    name: "$action_nuke",
    description: "$actiondesc_nuke",
    spawn_requires_flag: "card_unlocked_nuke",
    sprite: "var(--sprite-action-nuke)",
    sprite_unidentified: "data/ui_gfx/gun_actions/nuke_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/nuke.xml"],
    type: "projectile",
    spawn_level: "1,5,6,10",
    spawn_probability: "0.3,1,1,0.2",
    price: 400,
    mana: 200,
    max_uses: 1,
    custom_xml_file: "data/entities/misc/custom_cards/nuke.xml",
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/nuke.xml")
      c.fire_rate_wait = 20
      c.speed_multiplier = c.speed_multiplier * 0.75
      c.material = "fire"
      c.material_amount = c.material_amount + 60
      c.ragdoll_fx = 2
      c.gore_particles = c.gore_particles + 10
      c.screenshake = c.screenshake + 10.5
      setCurrentReloadTime(current_reload_time + 600)
      shot_effects.recoil_knockback = shot_effects.recoil_knockback + 300.0
      
      if ( c.speed_multiplier >= 20 )  {
        c.speed_multiplier = Math.min( c.speed_multiplier, 20 )
      } else if ( c.speed_multiplier < 0 )  {
        c.speed_multiplier = 0
      }
    },
  },
  {
    id: "NUKE_GIGA",
    name: "$action_nuke_giga",
    description: "$actiondesc_nuke_giga",
    sprite: "var(--sprite-action-nuke-giga)",
    sprite_unidentified: "data/ui_gfx/gun_actions/nuke_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/nuke_giga.xml"],
    spawn_requires_flag: "card_unlocked_nukegiga",
    spawn_manual_unlock: true,
    never_unlimited: true,
    recursive: true,
    ai_never_uses: true,
    type: "projectile",
    spawn_level: "10",
    spawn_probability: "1",
    price: 800,
    mana: 500,
    max_uses: 1,
    custom_xml_file: "data/entities/misc/custom_cards/nuke_giga.xml",
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/nuke_giga.xml")
      c.fire_rate_wait = 50
      c.speed_multiplier = c.speed_multiplier * 0.5
      c.material = "fire"
      c.material_amount = c.material_amount + 80
      c.ragdoll_fx = 2
      c.gore_particles = c.gore_particles + 30
      c.screenshake = c.screenshake + 30.5
      setCurrentReloadTime(current_reload_time + 800)
      shot_effects.recoil_knockback = shot_effects.recoil_knockback + 300.0
      
      if ( c.speed_multiplier >= 20 )  {
        c.speed_multiplier = Math.min( c.speed_multiplier, 20 )
      } else if ( c.speed_multiplier < 0 )  {
        c.speed_multiplier = 0
      }
    },
  },
  
  
  
  {
    id: "FIREWORK",
    name: "$action_firework",
    description: "$actiondesc_firework",
    spawn_requires_flag: "card_unlocked_firework",
    sprite: "var(--sprite-action-firework)",
    sprite_unidentified: "data/ui_gfx/gun_actions/rocket_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/fireworks/firework_pink.xml"],
    type: "projectile",
    spawn_level: "1,2,3,4,5,6",
    spawn_probability: "1,0.8,1,1,0.5,0.3",
    price: 220,
    mana: 70,
    max_uses: 25,
    action: function(c: GunActionState) {
      // SetRandomSeed(this.id,  GameGetFrameNum(), GameGetFrameNum() )
      // let types = ["pink","green","blue","orange"]
      // let rnd = Random(this.id, 1, types.length)
      // let firework_name = "firework_" + String(types[rnd - 1]) + ".xml"
      // add_projectile("data/entities/projectiles/deck/fireworks/" + firework_name)
      add_projectile("data/entities/projectiles/deck/fireworks/firework_pink.xml")
      c.fire_rate_wait = c.fire_rate_wait + 60
      
      c.ragdoll_fx = 2
      shot_effects.recoil_knockback = 120.0
    },
  },
  {  
    id: "SUMMON_WANDGHOST",
    name: "$action_summon_wandghost",
    description: "$actiondesc_summon_wandghost",
    sprite: "var(--sprite-action-summon-wandghost)",
    sprite_unidentified: "data/ui_gfx/gun_actions/rocket_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/wand_ghost_player.xml"],
    type: "utility",
    spawn_level: "2,4,5,6,10",
    spawn_probability: "0.08,0.1,0.3,0.3,0.1",
    price: 420,
    mana: 300,
    max_uses: 1,
    never_unlimited: true,
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/wand_ghost_player.xml")
      add_projectile("data/entities/particles/image_emitters/wand_effect.xml")
    },
  },
  {
    id: "TOUCH_GOLD",
    name: "$action_touch_gold",
    description: "$actiondesc_touch_gold",
    sprite: "var(--sprite-action-touch-gold)",
    sprite_unidentified: "data/ui_gfx/gun_actions/rocket_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/touch_gold.xml"],
    type: "material",
    spawn_level: "1,2,3,4,5,6,7,10",
    spawn_probability: "0,0,0,0,0.1,0.1,0.1,0.5",
    price: 480,
    mana: 300,
    max_uses: 1,
    never_unlimited: true,
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/touch_gold.xml")
    },
  },
  {
    id: "TOUCH_WATER",
    name: "$action_touch_water",
    description: "$actiondesc_touch_water",
    sprite: "var(--sprite-action-touch-water)",
    sprite_unidentified: "data/ui_gfx/gun_actions/rocket_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/touch_water.xml"],
    type: "material",
    spawn_level: "1,2,3,4,5,6,7,10",
    spawn_probability: "0,0,0,0,0.1,0.1,0.1,0.4",
    price: 420,
    mana: 280,
    max_uses: 5,
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/touch_water.xml")
    },
  },
  {
    id: "TOUCH_OIL",
    name: "$action_touch_oil",
    description: "$actiondesc_touch_oil",
    sprite: "var(--sprite-action-touch-oil)",
    sprite_unidentified: "data/ui_gfx/gun_actions/rocket_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/touch_oil.xml"],
    type: "material",
    spawn_level: "1,2,3,4,5,6,7,10",
    spawn_probability: "0,0,0,0,0.1,0.1,0.1,0.4",
    price: 380,
    mana: 260,
    max_uses: 5,
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/touch_oil.xml")
    },
  },
  {
    id: "TOUCH_ALCOHOL",
    name: "$action_touch_alcohol",
    description: "$actiondesc_touch_alcohol",
    sprite: "var(--sprite-action-touch-alcohol)",
    sprite_unidentified: "data/ui_gfx/gun_actions/rocket_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/touch_alcohol.xml"],
    type: "material",
    spawn_level: "1,2,3,4,5,6,7,10",
    spawn_probability: "0,0,0,0,0.1,0.1,0.1,0.4",
    price: 360,
    mana: 240,
    max_uses: 5,
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/touch_alcohol.xml")
    },
  },
  {
    id: "TOUCH_PISS",
    name: "$action_touch_piss",
    description: "$actiondesc_touch_piss",
    sprite: "var(--sprite-action-touch-piss)",
    sprite_unidentified: "data/ui_gfx/gun_actions/rocket_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/touch_piss.xml"],
    spawn_requires_flag: "card_unlocked_piss",
    type: "material",
    spawn_level: "1,2,3,4,5,6,7,10",
    spawn_probability: "0,0,0,0,0.035,0.035,0.035,0.1",
    price: 360,
    mana: 190,
    max_uses: 4,
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/touch_piss.xml")
    },
  },
  {
    id: "TOUCH_GRASS",
    name: "$action_touch_grass",
    description: "$actiondesc_touch_grass",
    sprite: "var(--sprite-action-touch-grass)",
    sprite_unidentified: "data/ui_gfx/gun_actions/rocket_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/touch_grass.xml"],
    spawn_requires_flag: "card_unlocked_touch_grass",
    type: "material",
    spawn_level: "1,2,3,4,5,6,7,10",
    spawn_probability: "0,0,0,0,0.1,0.1,0.1,0.2",
    price: 360,
    mana: 190,
    max_uses: 4,
    never_unlimited: true,
    custom_xml_file: "data/entities/misc/custom_cards/touch_grass.xml",
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/touch_grass.xml")
    },
  },
  {
    id: "TOUCH_BLOOD",
    name: "$action_touch_blood",
    description: "$actiondesc_touch_blood",
    sprite: "var(--sprite-action-touch-blood)",
    sprite_unidentified: "data/ui_gfx/gun_actions/rocket_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/touch_blood.xml"],
    type: "material",
    spawn_level: "1,2,3,4,5,6,7,10",
    spawn_probability: "0,0,0,0,0.1,0.1,0.1,0.5",
    price: 390,
    mana: 270,
    max_uses: 3,
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/touch_blood.xml")
    },
  },
  {
    id: "TOUCH_SMOKE",
    name: "$action_touch_smoke",
    description: "$actiondesc_touch_smoke",
    sprite: "var(--sprite-action-touch-smoke)",
    sprite_unidentified: "data/ui_gfx/gun_actions/rocket_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/touch_smoke.xml"],
    type: "material",
    spawn_level: "1,2,3,4,5,6,7,10",
    spawn_probability: "0,0,0,0,0.1,0.1,0.1,0.4",
    price: 350,
    mana: 230,
    max_uses: 5,
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/touch_smoke.xml")
    },
  },
  {
    id: "DESTRUCTION",
    name: "$action_destruction",
    description: "$actiondesc_destruction",
    sprite: "var(--sprite-action-destruction)",
    sprite_unidentified: "data/ui_gfx/gun_actions/rocket_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/destruction.xml"],
    spawn_requires_flag: "card_unlocked_destruction",
    type: "static",
    spawn_level: "10",
    spawn_probability: "1",
    price: 600,
    mana: 240,
    max_uses: 5,
    ai_never_uses: true,
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/destruction.xml")
      c.fire_rate_wait = c.fire_rate_wait + 150
      setCurrentReloadTime(current_reload_time + 240)
    },
  },
  {
    id: "MASS_POLYMORPH",
    name: "$action_mass_polymorph",
    description: "$actiondesc_mass_polymorph",
    sprite: "var(--sprite-action-mass-polymorph)",
    sprite_unidentified: "data/ui_gfx/gun_actions/rocket_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/mass_polymorph.xml"],
    spawn_requires_flag: "card_unlocked_polymorph",
    type: "static",
    spawn_level: "10",
    spawn_probability: "1",
    price: 600,
    mana: 220,
    max_uses: 3,
    ai_never_uses: true,
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/mass_polymorph.xml")
      c.fire_rate_wait = c.fire_rate_wait + 140
      setCurrentReloadTime(current_reload_time + 240)
    },
  },
  
  {
    id: "BURST_2",
    name: "$action_burst_2",
    description: "$actiondesc_burst_2",
    sprite: "var(--sprite-action-burst-2)",
    sprite_unidentified: "data/ui_gfx/gun_actions/burst_2_unidentified.png",
    type: "multicast",
    spawn_level: "0,1,2,3,4,5,6",
    spawn_probability: "0.8,0.8,0.8,0.8,0.8,0.8,0.8",
    price: 140,
    mana: 0,
    
    action: function(c: GunActionState) {
      draw_actions( 2, true )
    },
  },
  {
    id: "BURST_3",
    name: "$action_burst_3",
    description: "$actiondesc_burst_3",
    sprite: "var(--sprite-action-burst-3)",
    sprite_unidentified: "data/ui_gfx/gun_actions/burst_3_unidentified.png",
    type: "multicast",
    spawn_level: "1,2,3,4,5,6",
    spawn_probability: "0.7,0.7,0.7,0.7,0.7,0.7",
    price: 160,
    mana: 2,
    
    action: function(c: GunActionState) {
      draw_actions( 3, true )
    },
  },
  {
    id: "BURST_4",
    name: "$action_burst_4",
    description: "$actiondesc_burst_4",
    sprite: "var(--sprite-action-burst-4)",
    sprite_unidentified: "data/ui_gfx/gun_actions/burst_4_unidentified.png",
    type: "multicast",
    spawn_level: "2,3,4,5,6",
    spawn_probability: "0.4,0.5,0.6,0.6,0.6",
    price: 180,
    mana: 5,
    
    action: function(c: GunActionState) {
      draw_actions( 4, true )
    },
  },
  {
    id: "BURST_8",
    name: "$action_burst_8",
    description: "$actiondesc_burst_8",
    sprite: "var(--sprite-action-burst-8)",
    sprite_unidentified: "data/ui_gfx/gun_actions/burst_4_unidentified.png",
    spawn_requires_flag: "card_unlocked_musicbox",
    type: "multicast",
    spawn_level: "5,6,10",
    spawn_probability: "0.1,0.1,0.5",
    price: 300,
    mana: 30,
    
    action: function(c: GunActionState) {
      draw_actions( 8, true )
    },
  },
  {
    id: "BURST_X",
    name: "$action_burst_x",
    description: "$actiondesc_burst_x",
    sprite: "var(--sprite-action-burst-x)",
    sprite_unidentified: "data/ui_gfx/gun_actions/burst_4_unidentified.png",
    spawn_requires_flag: "card_unlocked_musicbox",
    type: "multicast",
    spawn_level: "5,6,10",
    spawn_probability: "0.1,0.1,0.5",
    price: 500,
    mana: 50,
    max_uses: 30,
    action: function(c: GunActionState) {
      if ( deck.length > 0 )  {
        draw_actions( deck.length, true )
      }
    },
  },
  {

    id: "SCATTER_2",
    name: "$action_scatter_2",
    description: "$actiondesc_scatter_2",
    sprite: "var(--sprite-action-scatter-2)",
    sprite_unidentified: "data/ui_gfx/gun_actions/scatter_2_unidentified.png",
    type: "multicast",
    spawn_level: "0,1,2",
    spawn_probability: "0.8,0.8,0.7",
    price: 100,
    mana: 0,
    
    action: function(c: GunActionState) {
      draw_actions( 2, true )
      c.spread_degrees = c.spread_degrees + 10.0
    },
  },
  {
    id: "SCATTER_3",
    name: "$action_scatter_3",
    description: "$actiondesc_scatter_3",
    sprite: "var(--sprite-action-scatter-3)",
    sprite_unidentified: "data/ui_gfx/gun_actions/scatter_3_unidentified.png",
    type: "multicast",
    spawn_level: "0,1,2,3",
    spawn_probability: "0.6,0.7,0.7,0.8",
    price: 120,
    mana: 1,
    
    action: function(c: GunActionState) {
      draw_actions( 3, true )
      c.spread_degrees = c.spread_degrees + 20.0
    },
  },
  {
    id: "SCATTER_4",
    name: "$action_scatter_4",
    description: "$actiondesc_scatter_4",
    sprite: "var(--sprite-action-scatter-4)",
    sprite_unidentified: "data/ui_gfx/gun_actions/scatter_4_unidentified.png",
    type: "multicast",
    spawn_level: "1,2,3,4,5,6",
    spawn_probability: "0.5,0.6,0.7,0.8,0.8,0.6",
    price: 140,
    mana: 2,
    
    action: function(c: GunActionState) {
      draw_actions( 4, true )
      c.spread_degrees = c.spread_degrees + 40.0
    },
  },
  {
    id: "I_SHAPE",
    name: "$action_i_shape",
    description: "$actiondesc_i_shape",
    sprite: "var(--sprite-action-i-shape)",
    sprite_unidentified: "data/ui_gfx/gun_actions/i_shape_unidentified.png",
    type: "multicast",
    spawn_level: "1,2,3",
    spawn_probability: "0.4,0.5,0.3",
    price: 30,
    mana: 0,
    
    action: function(c: GunActionState) {
      draw_actions(2, true)
      c.pattern_degrees = 180
      c.spread_degrees = c.spread_degrees - 5.0
    },
  },
  {
    id: "Y_SHAPE",
    name: "$action_y_shape",
    description: "$actiondesc_y_shape",
    sprite: "var(--sprite-action-y-shape)",
    sprite_unidentified: "data/ui_gfx/gun_actions/y_shape_unidentified.png",
    type: "multicast",
    spawn_level: "0,1,2,3",
    spawn_probability: "0.8,0.5,0.4,0.3",
    price: 30,
    mana: 2,
    
    action: function(c: GunActionState) {
      draw_actions(2, true)
      c.pattern_degrees = 45
      c.spread_degrees = c.spread_degrees - 8.0
    },
  },
  {
    id: "T_SHAPE",
    name: "$action_t_shape",
    description: "$actiondesc_t_shape",
    sprite: "var(--sprite-action-t-shape)",
    sprite_unidentified: "data/ui_gfx/gun_actions/t_shape_unidentified.png",
    type: "multicast",
    spawn_level: "1,2,3,4",
    spawn_probability: "0.4,0.5,0.4,0.3",
    price: 30,
    mana: 3,
    
    action: function(c: GunActionState) {
      draw_actions(3, true)
      c.pattern_degrees = 90
      c.spread_degrees = c.spread_degrees - 8.0
    },
  },
  {
    id: "W_SHAPE",
    name: "$action_w_shape",
    description: "$actiondesc_w_shape",
    sprite: "var(--sprite-action-w-shape)",
    sprite_unidentified: "data/ui_gfx/gun_actions/w_shape_unidentified.png",
    type: "multicast",
    spawn_level: "2,3,4,5,6",
    spawn_probability: "0.4,0.3,0.5,0.3,0.3",
    price: 50,
    mana: 3,
    
    action: function(c: GunActionState) {
      draw_actions(3, true)
      c.pattern_degrees = 20
      c.spread_degrees = c.spread_degrees - 5.0
    },
  },
  {
    id: "CIRCLE_SHAPE",
    name: "$action_circle_shape",
    description: "$actiondesc_circle_shape",
    sprite: "var(--sprite-action-circle-shape)",
    sprite_unidentified: "data/ui_gfx/gun_actions/circle_shape_unidentified.png",
    type: "multicast",
    spawn_level: "1,2,3,4,5,6",
    spawn_probability: "0.1,0.2,0.3,0.3,0.3,0.3",
    price: 50,
    mana: 6,
    
    action: function(c: GunActionState) {
      draw_actions(6, true)
      c.pattern_degrees = 180
      c.spread_degrees = c.spread_degrees - 15.0
    },
  },
  {
    id: "PENTAGRAM_SHAPE",
    name: "$action_pentagram_shape",
    description: "$actiondesc_pentagram_shape",
    sprite: "var(--sprite-action-pentagram-shape)",
    sprite_unidentified: "data/ui_gfx/gun_actions/pentagram_shape_unidentified.png",
    type: "multicast",
    spawn_level: "1,2,3,4,5",
    spawn_probability: "0.4,0.4,0.3,0.2,0.1",
    price: 50,
    mana: 5,
    
    action: function(c: GunActionState) {
      draw_actions(5, true)
      c.pattern_degrees = 180
      c.spread_degrees = c.spread_degrees - 12.0
      
      
    },
  },
  {
    id: "I_SHOT",
    name: "$action_i_shot",
    description: "$actiondesc_i_shot",
    sprite: "var(--sprite-action-i-shot)",
    sprite_unidentified: "data/ui_gfx/gun_actions/i_shape_unidentified.png",
    type: "utility",
    spawn_level: "1,2,3",
    spawn_probability: "0.1,0.2,0.5",
    price: 130,
    mana: 40,
    max_uses: 30,
    action: function(c: GunActionState) {
      let data
      
      if ( deck.length > 0 )  {
        data = deck[1 - 1]
      }
      
      if (( data != null ) && ( ( data.type === "projectile" ) || ( data.type === "static" ) ) && ( data.related_projectiles != null ) && ( ( data.uses_remaining == null ) || ( data.uses_remaining !== 0 ) ))  {
        let count = 2
        for (const i of luaFor(1, count-1)) {
          if ( mana >= (data.mana ?? 0) )  {
            let proj = data.related_projectiles[0]
            let proj_count = data.related_projectiles[1] || 1
            
            for (const a of luaFor(1, proj_count)) {
              add_projectile(proj)
            }
            
            setMana(mana - (data.mana ?? 0))
          } else {
            OnNotEnoughManaForAction(data.mana ?? 0, mana, data)
            break
          }
        }
      }
      
      c.pattern_degrees = 180
      
      draw_actions( 1, true )
    },
  },
  {
    id: "Y_SHOT",
    name: "$action_y_shot",
    description: "$actiondesc_y_shot",
    sprite: "var(--sprite-action-y-shot)",
    sprite_unidentified: "data/ui_gfx/gun_actions/i_shape_unidentified.png",
    type: "utility",
    spawn_level: "1,2,3",
    spawn_probability: "0.1,0.2,0.5",
    price: 135,
    mana: 40,
    max_uses: 30,
    action: function(c: GunActionState) {
      let data
      
      if ( deck.length > 0 )  {
        data = deck[1 - 1]
      }
      
      if (( data != null ) && ( ( data.type === "projectile" ) || ( data.type === "static" ) ) && ( data.related_projectiles != null ) && ( ( data.uses_remaining == null ) || ( data.uses_remaining !== 0 ) ))  {
        let count = 2
        for (const i of luaFor(1, count-1)) {
          if ( mana >= (data.mana ?? 0) )  {
            let proj = data.related_projectiles[0]
            let proj_count = data.related_projectiles[1] || 1
            
            for (const a of luaFor(1, proj_count)) {
              add_projectile(proj)
            }
            
            setMana(mana - (data.mana ?? 0))
          } else {
            OnNotEnoughManaForAction(data.mana ?? 0, mana, data)
            break
          }
        }
      }
      
      c.pattern_degrees = 45
      
      draw_actions( 1, true )
    },
  },
  {
    id: "T_SHOT",
    name: "$action_t_shot",
    description: "$actiondesc_t_shot",
    sprite: "var(--sprite-action-t-shot)",
    sprite_unidentified: "data/ui_gfx/gun_actions/i_shape_unidentified.png",
    type: "utility",
    spawn_level: "2,3,5",
    spawn_probability: "0.1,0.2,0.5",
    price: 160,
    mana: 60,
    max_uses: 25,
    action: function(c: GunActionState) {
      let data
      
      if ( deck.length > 0 )  {
        data = deck[1 - 1]
      }
      
      if (( data != null ) && ( ( data.type === "projectile" ) || ( data.type === "static" ) ) && ( data.related_projectiles != null ) && ( ( data.uses_remaining == null ) || ( data.uses_remaining !== 0 ) ))  {
        let count = 3
        for (const i of luaFor(1, count-1)) {
          if ( mana >= (data.mana ?? 0) )  {
            let proj = data.related_projectiles[0]
            let proj_count = data.related_projectiles[1] || 1
            
            for (const a of luaFor(1, proj_count)) {
              add_projectile(proj)
            }
            
            setMana(mana - (data.mana ?? 0))
          } else {
            OnNotEnoughManaForAction(data.mana ?? 0, mana, data)
            break
          }
        }
      }
      
      c.pattern_degrees = 90
      
      draw_actions( 1, true )
    },
  },
  {
    id: "W_SHOT",
    name: "$action_w_shot",
    description: "$actiondesc_w_shot",
    sprite: "var(--sprite-action-w-shot)",
    sprite_unidentified: "data/ui_gfx/gun_actions/i_shape_unidentified.png",
    type: "utility",
    spawn_level: "2,3,5,6",
    spawn_probability: "0.1,0.2,0.5,0.4",
    price: 180,
    mana: 70,
    max_uses: 20,
    action: function(c: GunActionState) {
      let data
      
      if ( deck.length > 0 )  {
        data = deck[1 - 1]
      }
      
      if (( data != null ) && ( ( data.type === "projectile" ) || ( data.type === "static" ) ) && ( data.related_projectiles != null ) && ( ( data.uses_remaining == null ) || ( data.uses_remaining !== 0 ) ))  {
        let count = 3
        for (const i of luaFor(1, count-1)) {
          if ( mana >= (data.mana ?? 0) )  {
            let proj = data.related_projectiles[0]
            let proj_count = data.related_projectiles[1] || 1
            
            for (const a of luaFor(1, proj_count)) {
              add_projectile(proj)
            }
            
            setMana(mana - (data.mana ?? 0))
          } else {
            OnNotEnoughManaForAction(data.mana ?? 0, mana, data)
            break
          }
        }
      }
      
      c.pattern_degrees = 20
      
      draw_actions( 1, true )
    },
  },
  {
    id: "QUAD_SHOT",
    name: "$action_quad_shot",
    description: "$actiondesc_quad_shot",
    sprite: "var(--sprite-action-quad-shot)",
    sprite_unidentified: "data/ui_gfx/gun_actions/i_shape_unidentified.png",
    type: "utility",
    spawn_level: "1,2,4",
    spawn_probability: "0.1,0.2,0.5",
    price: 200,
    mana: 90,
    max_uses: 20,
    action: function(c: GunActionState) {
      let data
      
      if ( deck.length > 0 )  {
        data = deck[1 - 1]
      }
      
      if (( data != null ) && ( ( data.type === "projectile" ) || ( data.type === "static" ) ) && ( data.related_projectiles != null ) && ( ( data.uses_remaining == null ) || ( data.uses_remaining !== 0 ) ))  {
        let count = 4
        for (const i of luaFor(1, count-1)) {
          if ( mana >= (data.mana ?? 0) )  {
            let proj = data.related_projectiles[0]
            let proj_count = data.related_projectiles[1] || 1
            
            for (const a of luaFor(1, proj_count)) {
              add_projectile(proj)
            }
            
            setMana(mana - (data.mana ?? 0))
          } else {
            OnNotEnoughManaForAction(data.mana ?? 0, mana, data)
            break
          }
        }
      }
      
      c.pattern_degrees = 180
      
      draw_actions( 1, true )
    },
  },
  {
    id: "PENTA_SHOT",
    name: "$action_penta_shot",
    description: "$actiondesc_penta_shot",
    sprite: "var(--sprite-action-penta-shot)",
    sprite_unidentified: "data/ui_gfx/gun_actions/i_shape_unidentified.png",
    type: "utility",
    spawn_level: "3,4,5,6,10",
    spawn_probability: "0.1,0.2,0.5,0.5,0.2",
    price: 250,
    mana: 110,
    max_uses: 20,
    action: function(c: GunActionState) {
      let data
      
      if ( deck.length > 0 )  {
        data = deck[1 - 1]
      }
      
      if (( data != null ) && ( ( data.type === "projectile" ) || ( data.type === "static" ) ) && ( data.related_projectiles != null ) && ( ( data.uses_remaining == null ) || ( data.uses_remaining !== 0 ) ))  {
        let count = 5
        for (const i of luaFor(1, count-1)) {
          if ( mana >= (data.mana ?? 0) )  {
            let proj = data.related_projectiles[0]
            let proj_count = data.related_projectiles[1] || 1
            
            for (const a of luaFor(1, proj_count)) {
              add_projectile(proj)
            }
            
            setMana(mana - (data.mana ?? 0))
          } else {
            OnNotEnoughManaForAction(data.mana ?? 0, mana, data)
            break
          }
        }
      }
      
      c.pattern_degrees = 180
      
      draw_actions( 1, true )
    },
  },
  {
    id: "HEXA_SHOT",
    name: "$action_hexa_shot",
    description: "$actiondesc_hexa_shot",
    sprite: "var(--sprite-action-hexa-shot)",
    sprite_unidentified: "data/ui_gfx/gun_actions/i_shape_unidentified.png",
    type: "utility",
    spawn_level: "3,4,5,6,10",
    spawn_probability: "0.1,0.2,0.5,0.5,0.2",
    price: 280,
    mana: 130,
    max_uses: 20,
    action: function(c: GunActionState) {
      let data
      
      if ( deck.length > 0 )  {
        data = deck[1 - 1]
      }
      
      if (( data != null ) && ( ( data.type === "projectile" ) || ( data.type === "static" ) ) && ( data.related_projectiles != null ) && ( ( data.uses_remaining == null ) || ( data.uses_remaining !== 0 ) ))  {
        let count = 6
        for (const i of luaFor(1, count-1)) {
          if ( mana >= (data.mana ?? 0) )  {
            let proj = data.related_projectiles[0]
            let proj_count = data.related_projectiles[1] || 1
            
            for (const a of luaFor(1, proj_count)) {
              add_projectile(proj)
            }
            
            setMana(mana - (data.mana ?? 0))
          } else {
            OnNotEnoughManaForAction(data.mana ?? 0, mana, data)
            break
          }
        }
      }
      
      c.pattern_degrees = 180
      
      draw_actions( 1, true )
    },
  },
  {
    id: "SPREAD_REDUCE",
    name: "$action_spread_reduce",
    description: "$actiondesc_spread_reduce",
    sprite: "var(--sprite-action-spread-reduce)",
    sprite_unidentified: "data/ui_gfx/gun_actions/spread_reduce_unidentified.png",
    type: "modifier",
    spawn_level: "1,2,3,4,5,6",
    spawn_probability: "0.8,0.8,0.8,0.8,0.7,0.6",
    price: 100,
    mana: 1,
    
    action: function(c: GunActionState) {
      c.spread_degrees = c.spread_degrees - 60.0
      draw_actions( 1, true )
    },
  },
  {
    id: "HEAVY_SPREAD",
    name: "$action_heavy_spread",
    description: "$actiondesc_heavy_spread",
    sprite: "var(--sprite-action-heavy-spread)",
    sprite_unidentified: "data/ui_gfx/gun_actions/teleport_projectile_unidentified.png",
    type: "modifier",
    spawn_level: "0,1,2,4,5,6",
    spawn_probability: "0.6,0.7,0.8,0.8,0.8,0.6",
    price: 100,
    mana: 2,
    action: function(c: GunActionState) {
      c.fire_rate_wait = c.fire_rate_wait - 7
      setCurrentReloadTime(current_reload_time - 15)
      c.spread_degrees = c.spread_degrees + 720
      draw_actions( 1, true )
    },
  },
  {
    id: "RECHARGE",
    name: "$action_recharge",
    description: "$actiondesc_recharge",
    sprite: "var(--sprite-action-recharge)",
    sprite_unidentified: "data/ui_gfx/gun_actions/spread_reduce_unidentified.png",
    type: "modifier",
    spawn_level: "1,2,3,4,5,6",
    spawn_probability: "0.8,0.9,1,0.8,0.9,1",
    price: 200,
    mana: 12,
    
    action: function(c: GunActionState) {
      c.fire_rate_wait    = c.fire_rate_wait - 10
      setCurrentReloadTime(current_reload_time - 20)
      draw_actions( 1, true )
    },
  },
  {
    id: "LIFETIME",
    name: "$action_lifetime",
    description: "$actiondesc_lifetime",
    sprite: "var(--sprite-action-lifetime)",
    sprite_unidentified: "data/ui_gfx/gun_actions/spread_reduce_unidentified.png",
    type: "modifier",
    spawn_level: "3,4,5,6,10",
    spawn_probability: "0.5,0.5,0.5,0.75,0.1",
    price: 250,
    mana: 40,
    
    custom_xml_file: "data/entities/misc/custom_cards/lifetime.xml",
    action: function(c: GunActionState) {
      c.lifetime_add     = c.lifetime_add + 75
      c.fire_rate_wait = c.fire_rate_wait + 13
      draw_actions( 1, true )
    },
  },
  {
    id: "LIFETIME_DOWN",
    name: "$action_lifetime_down",
    description: "$actiondesc_lifetime_down",
    sprite: "var(--sprite-action-lifetime-down)",
    sprite_unidentified: "data/ui_gfx/gun_actions/spread_reduce_unidentified.png",
    type: "modifier",
    spawn_level: "3,4,5,6,10",
    spawn_probability: "0.5,0.5,0.75,0.5,0.1",
    price: 90,
    mana: 10,
    
    custom_xml_file: "data/entities/misc/custom_cards/lifetime_down.xml",
    action: function(c: GunActionState) {
      c.lifetime_add     = c.lifetime_add - 42
      c.fire_rate_wait = c.fire_rate_wait - 15
      draw_actions( 1, true )
    },
  },
  {
    id: "NOLLA",
    name: "$action_nolla",
    description: "$actiondesc_nolla",
    sprite: "var(--sprite-action-nolla)",
    sprite_unidentified: "data/ui_gfx/gun_actions/spread_reduce_unidentified.png",
    spawn_requires_flag: "card_unlocked_pyramid",
    related_extra_entities: [ "data/entities/misc/nolla.xml" ],
    type: "modifier",
    spawn_level: "2,4,5,6,10",
    spawn_probability: "0.2,0.2,0.5,0.5,1",
    price: 50,
    mana: 1,
    
    action: function(c: GunActionState) {
      c.extra_entities = c.extra_entities + "data/entities/misc/nolla.xml,"
      c.fire_rate_wait = c.fire_rate_wait - 15
      draw_actions( 1, true )
    },
  },
  {
    id: "SLOW_BUT_STEADY",
    name: "$action_slow_but_steady",
    description: "$actiondesc_slow_but_steady",
    sprite: "var(--sprite-action-slow-but-steady)",
    sprite_unidentified: "data/ui_gfx/gun_actions/spread_reduce_unidentified.png",
    spawn_requires_flag: "card_unlocked_maths",
    type: "modifier",
    spawn_level: "3,4,5,6,10",
    spawn_probability: "0.1,0.2,0.6,0.6,0.4",
    price: 50,
    mana: 0,
    action: function(c: GunActionState) {
      setCurrentReloadTime(90)
      shot_effects.recoil_knockback = shot_effects.recoil_knockback - 80.0
      draw_actions( 1, true )
    },
  },
  {
    id: "EXPLOSION_REMOVE",
    name: "$action_explosion_remove",
    description: "$actiondesc_explosion_remove",
    sprite: "var(--sprite-action-explosion-remove)",
    sprite_unidentified: "data/ui_gfx/gun_actions/spread_reduce_unidentified.png",
    related_extra_entities: [ "data/entities/misc/explosion_remove.xml" ],
    type: "modifier",
    spawn_level: "2,4,5,6",
    spawn_probability: "0.2,0.6,0.7,0.2",
    price: 50,
    mana: 0,
    
    action: function(c: GunActionState) {
      c.extra_entities = c.extra_entities + "data/entities/misc/explosion_remove.xml,"
      c.fire_rate_wait = c.fire_rate_wait - 15
      c.explosion_radius = c.explosion_radius - 30.0
      c.damage_explosion_add = c.damage_explosion_add - 0.8
      draw_actions( 1, true )
    },
  },
  {
    id: "EXPLOSION_TINY",
    name: "$action_explosion_tiny",
    description: "$actiondesc_explosion_tiny",
    sprite: "var(--sprite-action-explosion-tiny)",
    sprite_unidentified: "data/ui_gfx/gun_actions/spread_reduce_unidentified.png",
    related_extra_entities: [ "data/entities/misc/explosion_tiny.xml" ],
    type: "modifier",
    spawn_level: "2,4,5,6",
    spawn_probability: "0.2,0.6,0.7,0.2",
    price: 160,
    mana: 40,
    
    action: function(c: GunActionState) {
      c.extra_entities = c.extra_entities + "data/entities/misc/explosion_tiny.xml,"
      c.fire_rate_wait = c.fire_rate_wait + 15
      c.explosion_radius = c.explosion_radius - 30.0
      c.damage_explosion_add = c.damage_explosion_add + 0.8
      draw_actions( 1, true )
    },
  },
  {
    id: "LASER_EMITTER_WIDER",
    name: "$action_laser_emitter_wider",
    description: "$actiondesc_laser_emitter_wider",
    sprite: "var(--sprite-action-laser-emitter-wider)",
    sprite_unidentified: "data/ui_gfx/gun_actions/burn_trail_unidentified.png",
    related_extra_entities: [ "data/entities/misc/laser_emitter_wider.xml" ],
    type: "modifier",
    spawn_level: "2,3,4",
    spawn_probability: "0.3,0.3,0.4",
    price: 40,
    mana: 10,
    
    action: function(c: GunActionState) {
      c.extra_entities = c.extra_entities + "data/entities/misc/laser_emitter_wider.xml,"
      draw_actions( 1, true )
    },
  },
  
  {
    id: "MANA_REDUCE",
    name: "$action_mana_reduce",
    description: "$actiondesc_mana_reduce",
    sprite: "var(--sprite-action-mana-reduce)",
    sprite_unidentified: "data/ui_gfx/gun_actions/spread_reduce_unidentified.png",
    type: "modifier",
    spawn_level: "1,2,3,4,5,6",
    spawn_probability: "0.7,0.9,1,1,1,1",
    price: 250,
    mana: -30,
    
    custom_xml_file: "data/entities/misc/custom_cards/mana_reduce.xml",
    action: function(c: GunActionState) {
      c.fire_rate_wait = c.fire_rate_wait + 10
      draw_actions( 1, true )
    },
  },
  {
    id: "BLOOD_MAGIC",
    name: "$action_blood_magic",
    description: "$actiondesc_blood_magic",
    sprite: "var(--sprite-action-blood-magic)",
    sprite_unidentified: "data/ui_gfx/gun_actions/spread_reduce_unidentified.png",
    related_extra_entities: [ "data/entities/particles/blood_sparks.xml" ],
    type: "utility",
    spawn_level: "5,6,10",
    spawn_probability: "0.3,0.7,0.5",
    price: 150,
    mana: -100,
    custom_xml_file: "data/entities/misc/custom_cards/blood_magic.xml",
    action: function(c: GunActionState) {
      c.extra_entities = c.extra_entities + "data/entities/particles/blood_sparks.xml,"
      c.fire_rate_wait = c.fire_rate_wait - 20
      setCurrentReloadTime(current_reload_time - 20)
      draw_actions( 1, true )
      
      let entity_id = GetUpdatedEntityID(this.id, )
      
      let dcomps = EntityGetComponent(this.id,  entity_id, "DamageModelComponent" )
      
      if (( dcomps != null ) && ( dcomps.length > 0 ))  {
        for (const [a, b] of ipairs(dcomps, 'dcomps')) {
          let hp = ComponentGetValue2(this.id,  b, "hp" )
          hp = Math.max( hp - 0.16, 0.04 )
          ComponentSetValue2(this.id,  b, "hp", hp )
        }
      }
    },
  },
  {
    id: "MONEY_MAGIC",
    name: "$action_money_magic",
    description: "$actiondesc_money_magic",
    sprite: "var(--sprite-action-money-magic)",
    sprite_unidentified: "data/ui_gfx/gun_actions/spread_reduce_unidentified.png",
    related_extra_entities: [ "data/entities/particles/gold_sparks.xml" ],
    type: "utility",
    spawn_level: "3,5,6,10",
    spawn_probability: "0.2,0.8,0.3,0.5",
    price: 200,
    mana: 30,
    custom_xml_file: "data/entities/misc/custom_cards/money_magic.xml",
    action: function(c: GunActionState) {
      let entity_id = GetUpdatedEntityID(this.id, )
      
      let dcomp = EntityGetFirstComponent(this.id,  entity_id, "WalletComponent" )
      
      if ( dcomp != null )  {
        let money = ComponentGetValue2(this.id,  dcomp, "money" )
        let moneyspent = ComponentGetValue2(this.id,  dcomp, "money_spent" )
        let damage = Math.min( Math.floor( money * 0.05 ), 24000 )
        
        if (( damage > 1 ) && ( money >= 10 ))  {
          damage = Math.max( damage, 10 )
          
          c.extra_entities = c.extra_entities + "data/entities/particles/gold_sparks.xml,"
          
          money = money - damage
          moneyspent = moneyspent + damage
          ComponentSetValue2(this.id,  dcomp, "money", money )
          ComponentSetValue2(this.id,  dcomp, "money_spent", moneyspent )
          
          
          
          if ( damage < 120 )  {
            c.damage_projectile_add = c.damage_projectile_add + ( damage / 25 )
          } else if ( damage < 300 )  {
            c.damage_projectile_add = c.damage_projectile_add + ( damage / 35 )
          } else if ( damage < 500 )  {
            c.damage_projectile_add = c.damage_projectile_add + ( damage / 45 )
          } else {
            c.damage_projectile_add = c.damage_projectile_add + ( damage / 55 )
          }
        }
      }
      
      draw_actions( 1, true )
    },
  },
  {
    id: "BLOOD_TO_POWER",
    name: "$action_blood_to_power",
    description: "$actiondesc_blood_to_power",
    sprite: "var(--sprite-action-blood-to-power)",
    sprite_unidentified: "data/ui_gfx/gun_actions/spread_reduce_unidentified.png",
    related_extra_entities: [ "data/entities/particles/blood_sparks.xml" ],
    type: "utility",
    spawn_level: "2,5,6,10",
    spawn_probability: "0.2,0.8,0.2,0.5",
    price: 150,
    mana: 20,
    custom_xml_file: "data/entities/misc/custom_cards/blood_to_power.xml",
    action: function(c: GunActionState) {
      let entity_id = GetUpdatedEntityID(this.id, )
      
      let dcomp = EntityGetFirstComponent(this.id,  entity_id, "DamageModelComponent" )
      
      if ( dcomp != null )  {
        let hp = ComponentGetValue2(this.id,  dcomp, "hp" )
        let damage = Math.min( hp * 0.44, 960 )
        let self_damage = hp * 0.2
        
        if (( hp >= 0.4 ) && ( self_damage > 0.2 ))  {
          c.extra_entities = c.extra_entities + "data/entities/particles/blood_sparks.xml,"
          
          EntityInflictDamage(this.id,  entity_id, self_damage, "DAMAGE_CURSE", "$action_blood_to_power", "NONE", 0, 0, entity_id )
          
          
          
          c.damage_projectile_add = c.damage_projectile_add + damage
        }
      }
      
      draw_actions( 1, true )
    },
  },
  {
    id: "DUPLICATE",
    name: "$action_duplicate",
    description: "$actiondesc_duplicate",
    sprite: "var(--sprite-action-duplicate)",
    sprite_unidentified: "data/ui_gfx/gun_actions/spread_reduce_unidentified.png",
    spawn_requires_flag: "card_unlocked_mestari",
    type: "other",
    recursive: true,
    spawn_level: "5,6,10",
    spawn_probability: "0.1,0.2,1",
    price: 250,
    mana: 250,
    action: function(c: GunActionState, recursion_level: number = 0, iteration: number = 1) {
      let hand_count = hand.length
      
      for (const [i, v] of ipairs(hand, 'hand')) {
        let rec = check_recursion( v, recursion_level )
        if (( v.id !== "DUPLICATE" ) && ( i < hand_count ) && ( rec > -1 ))  {
          call_action("action", v, c,  rec )
        }
      }
      
      c.fire_rate_wait = c.fire_rate_wait + 20
      setCurrentReloadTime(current_reload_time + 20)
      
      draw_actions( 1, true )
    },
  },
  {
    id: "QUANTUM_SPLIT",
    name: "$action_quantum_split",
    description: "$actiondesc_quantum_split",
    sprite: "var(--sprite-action-quantum-split)",
    sprite_unidentified: "data/ui_gfx/gun_actions/spread_reduce_unidentified.png",
    related_extra_entities: [ "data/entities/misc/quantum_split.xml" ],
    type: "modifier",
    spawn_level: "2,3,4,5,6",
    spawn_probability: "0.5,0.6,0.5,0.5,1",
    price: 200,
    mana: 10,
    action: function(c: GunActionState) {
      c.extra_entities = c.extra_entities + "data/entities/misc/quantum_split.xml,"
      c.fire_rate_wait = c.fire_rate_wait + 5
      draw_actions( 1, true )
    },
  },
  {
    id: "GRAVITY",
    name: "$action_gravity",
    description: "$actiondesc_gravity",
    sprite: "var(--sprite-action-gravity)",
    sprite_unidentified: "data/ui_gfx/gun_actions/w_shape_unidentified.png",
    type: "modifier",
    spawn_level: "2,3,4,5,6",
    spawn_probability: "0.5,0.4,0.4,0.3,0.3",
    price: 50,
    mana: 1,
    
    action: function(c: GunActionState) {
      c.gravity = c.gravity + 600.0
      draw_actions( 1, true )
    },
  },
  {
    id: "GRAVITY_ANTI",
    name: "$action_gravity_anti",
    description: "$actiondesc_gravity_anti",
    sprite: "var(--sprite-action-gravity-anti)",
    sprite_unidentified: "data/ui_gfx/gun_actions/w_shape_unidentified.png",
    type: "modifier",
    spawn_level: "2,3,4,5,6",
    spawn_probability: "0.5,0.4,0.4,0.3,0.3",
    price: 50,
    mana: 1,
    
    action: function(c: GunActionState) {
      c.gravity = c.gravity - 600.0
      draw_actions( 1, true )
    },
  },
  
  {
    id: "SINEWAVE",
    name: "$action_sinewave",
    description: "$actiondesc_sinewave",
    sprite: "var(--sprite-action-sinewave)",
    sprite_unidentified: "data/ui_gfx/gun_actions/sinewave_unidentified.png",
    related_extra_entities: [ "data/entities/misc/sinewave.xml" ],
    type: "modifier",
    spawn_level: "2,4,6",
    spawn_probability: "0.4,0.55,0.4",
    price: 10,
    mana: 0,
    
    action: function(c: GunActionState) {
      c.extra_entities = c.extra_entities + "data/entities/misc/sinewave.xml,"
      c.speed_multiplier = c.speed_multiplier * 2
      
      if ( c.speed_multiplier >= 20 )  {
        c.speed_multiplier = Math.min( c.speed_multiplier, 20 )
      } else if ( c.speed_multiplier < 0 )  {
        c.speed_multiplier = 0
      }
      
      draw_actions( 1, true )
    },
  },
  {
    id: "CHAOTIC_ARC",
    name: "$action_chaotic_arc",
    description: "$actiondesc_chaotic_arc",
    sprite: "var(--sprite-action-chaotic-arc)",
    sprite_unidentified: "data/ui_gfx/gun_actions/sinewave_unidentified.png",
    related_extra_entities: [ "data/entities/misc/chaotic_arc.xml" ],
    type: "modifier",
    spawn_level: "1,3,5",
    spawn_probability: "0.4,0.55,0.4",
    price: 10,
    mana: 0,
    
    action: function(c: GunActionState) {
      c.extra_entities = c.extra_entities + "data/entities/misc/chaotic_arc.xml,"
      c.speed_multiplier = c.speed_multiplier * 2
      
      if ( c.speed_multiplier >= 20 )  {
        c.speed_multiplier = Math.min( c.speed_multiplier, 20 )
      } else if ( c.speed_multiplier < 0 )  {
        c.speed_multiplier = 0
      }
      
      draw_actions( 1, true )
    },
  },
  {
    id: "PINGPONG_PATH",
    name: "$action_pingpong_path",
    description: "$actiondesc_pingpong_path",
    sprite: "var(--sprite-action-pingpong-path)",
    sprite_unidentified: "data/ui_gfx/gun_actions/sinewave_unidentified.png",
    related_extra_entities: [ "data/entities/misc/pingpong_path.xml" ],
    type: "modifier",
    spawn_level: "1,3,5",
    spawn_probability: "0.4,0.5,0.4",
    price: 20,
    mana: 0,
    
    action: function(c: GunActionState) {
      c.extra_entities = c.extra_entities + "data/entities/misc/pingpong_path.xml,"
      c.lifetime_add = c.lifetime_add + 25
      draw_actions( 1, true )
    },
  },
  {
    id: "AVOIDING_ARC",
    name: "$action_avoiding_arc",
    description: "$actiondesc_avoiding_arc",
    sprite: "var(--sprite-action-avoiding-arc)",
    sprite_unidentified: "data/ui_gfx/gun_actions/sinewave_unidentified.png",
    related_extra_entities: [ "data/entities/misc/avoiding_arc.xml" ],
    type: "modifier",
    spawn_level: "2,4,6",
    spawn_probability: "0.5,0.4,0.4",
    price: 30,
    mana: 0,
    
    action: function(c: GunActionState) {
      c.extra_entities = c.extra_entities + "data/entities/misc/avoiding_arc.xml,"
      c.fire_rate_wait    = c.fire_rate_wait + 10
      draw_actions( 1, true )
    },
  },
  {
    id: "FLOATING_ARC",
    name: "$action_floating_arc",
    description: "$actiondesc_floating_arc",
    sprite: "var(--sprite-action-floating-arc)",
    sprite_unidentified: "data/ui_gfx/gun_actions/sinewave_unidentified.png",
    related_extra_entities: [ "data/entities/misc/floating_arc.xml" ],
    type: "modifier",
    spawn_level: "1,3,5",
    spawn_probability: "0.4,0.4,0.5",
    price: 30,
    mana: 0,
    
    action: function(c: GunActionState) {
      c.extra_entities = c.extra_entities + "data/entities/misc/floating_arc.xml,"
      c.fire_rate_wait    = c.fire_rate_wait + 10
      draw_actions( 1, true )
    },
  },
  {
    id: "FLY_DOWNWARDS",
    name: "$action_fly_downwards",
    description: "$actiondesc_fly_downwards",
    sprite: "var(--sprite-action-fly-downwards)",
    sprite_unidentified: "data/ui_gfx/gun_actions/sinewave_unidentified.png",
    related_extra_entities: [ "data/entities/misc/fly_downwards.xml" ],
    type: "modifier",
    spawn_level: "1,3,5",
    spawn_probability: "0.3,0.45,0.3",
    price: 30,
    mana: 0,
    
    action: function(c: GunActionState) {
      c.extra_entities = c.extra_entities + "data/entities/misc/fly_downwards.xml,"
      draw_actions( 1, true )
      c.fire_rate_wait    = c.fire_rate_wait - 8
      c.speed_multiplier  = c.speed_multiplier * 1.2
    },
  },
  {
    id: "FLY_UPWARDS",
    name: "$action_fly_upwards",
    description: "$actiondesc_fly_upwards",
    sprite: "var(--sprite-action-fly-upwards)",
    sprite_unidentified: "data/ui_gfx/gun_actions/sinewave_unidentified.png",
    related_extra_entities: [ "data/entities/misc/fly_upwards.xml" ],
    type: "modifier",
    spawn_level: "2,4,6",
    spawn_probability: "0.3,0.45,0.3",
    price: 20,
    mana: 0,
    
    action: function(c: GunActionState) {
      c.extra_entities = c.extra_entities + "data/entities/misc/fly_upwards.xml,"
      draw_actions( 1, true )
      c.fire_rate_wait    = c.fire_rate_wait - 8
      c.speed_multiplier  = c.speed_multiplier * 1.2
    },
  },
  {
    id: "HORIZONTAL_ARC",
    name: "$action_horizontal_arc",
    description: "$actiondesc_horizontal_arc",
    sprite: "var(--sprite-action-horizontal-arc)",
    sprite_unidentified: "data/ui_gfx/gun_actions/sinewave_unidentified.png",
    related_extra_entities: [ "data/entities/misc/horizontal_arc.xml" ],
    type: "modifier",
    spawn_level: "1,3,5",
    spawn_probability: "0.4,0.4,0.4",
    price: 20,
    mana: 0,
    
    action: function(c: GunActionState) {
      c.extra_entities = c.extra_entities + "data/entities/misc/horizontal_arc.xml,"
      draw_actions( 1, true )
      c.damage_projectile_add = c.damage_projectile_add + 0.3
      c.fire_rate_wait    = c.fire_rate_wait - 6
    },
  },
  {
    id: "LINE_ARC",
    name: "$action_line_arc",
    description: "$actiondesc_line_arc",
    sprite: "var(--sprite-action-line-arc)",
    sprite_unidentified: "data/ui_gfx/gun_actions/sinewave_unidentified.png",
    related_extra_entities: [ "data/entities/misc/line_arc.xml" ],
    type: "modifier",
    spawn_level: "1,3,5",
    spawn_probability: "0.3,0.4,0.5",
    price: 30,
    mana: 0,
    
    action: function(c: GunActionState) {
      c.extra_entities = c.extra_entities + "data/entities/misc/line_arc.xml,"
      draw_actions( 1, true )
      c.damage_projectile_add = c.damage_projectile_add + 0.2
      c.fire_rate_wait    = c.fire_rate_wait - 4
    },
  },
  {
    id: "ORBIT_SHOT",
    name: "$action_orbit_shot",
    description: "$actiondesc_orbit_shot",
    sprite: "var(--sprite-action-orbit-shot)",
    sprite_unidentified: "data/ui_gfx/gun_actions/sinewave_unidentified.png",
    related_extra_entities: [ "data/entities/misc/spiraling_shot.xml" ],
    type: "modifier",
    spawn_level: "1,2,3,4",
    spawn_probability: "0.2,0.4,0.4,0.3",
    price: 30,
    mana: 0,
    
    action: function(c: GunActionState) {
      c.extra_entities = c.extra_entities + "data/entities/misc/spiraling_shot.xml,"
      draw_actions( 1, true )
      c.damage_projectile_add = c.damage_projectile_add + 0.1
      c.fire_rate_wait    = c.fire_rate_wait - 6
      c.lifetime_add     = c.lifetime_add + 25
    },
  },
  {
    id: "SPIRALING_SHOT",
    name: "$action_spiraling_shot",
    description: "$actiondesc_spiraling_shot",
    sprite: "var(--sprite-action-spiraling-shot)",
    sprite_unidentified: "data/ui_gfx/gun_actions/sinewave_unidentified.png",
    related_extra_entities: [ "data/entities/misc/orbit_shot.xml" ],
    type: "modifier",
    spawn_level: "1,2,3,4",
    spawn_probability: "0.2,0.3,0.4,0.5",
    price: 30,
    mana: 0,
    
    action: function(c: GunActionState) {
      c.extra_entities = c.extra_entities + "data/entities/misc/orbit_shot.xml,"
      draw_actions( 1, true )
      c.damage_projectile_add = c.damage_projectile_add + 0.1
      c.fire_rate_wait    = c.fire_rate_wait - 6
      c.lifetime_add     = c.lifetime_add + 50
    },
  },
  {
    id: "PHASING_ARC",
    name: "$action_phasing_arc",
    description: "$actiondesc_phasing_arc",
    sprite: "var(--sprite-action-phasing-arc)",
    sprite_unidentified: "data/ui_gfx/gun_actions/sinewave_unidentified.png",
    related_extra_entities: [ "data/entities/misc/phasing_arc.xml" ],
    type: "modifier",
    spawn_level: "2,3,4,5",
    spawn_probability: "0.2,0.3,0.6,0.1",
    price: 170,
    mana: 2,
    
    action: function(c: GunActionState) {
      c.extra_entities = c.extra_entities + "data/entities/misc/phasing_arc.xml,"
      draw_actions( 1, true )
      c.fire_rate_wait    = c.fire_rate_wait - 12
      c.lifetime_add     = c.lifetime_add + 80
      c.speed_multiplier  = c.speed_multiplier * 0.33
      c.child_speed_multiplier  = c.child_speed_multiplier * 0.33
      
      if ( c.speed_multiplier >= 20 )  {
        c.speed_multiplier = Math.min( c.speed_multiplier, 20 )
      } else if ( c.speed_multiplier < 0 )  {
        c.speed_multiplier = 0
      }
    },
  },
  {
    id: "TRUE_ORBIT",
    name: "$action_true_orbit",
    description: "$actiondesc_true_orbit",
    sprite: "var(--sprite-action-true-orbit)",
    sprite_unidentified: "data/ui_gfx/gun_actions/sinewave_unidentified.png",
    related_extra_entities: [ "data/entities/misc/true_orbit.xml" ],
    type: "modifier",
    spawn_level: "2,3,4",
    spawn_probability: "0.2,0.3,0.4",
    price: 40,
    mana: 2,
    
    action: function(c: GunActionState) {
      c.extra_entities = c.extra_entities + "data/entities/misc/true_orbit.xml,"
      draw_actions( 1, true )
      c.damage_projectile_add = c.damage_projectile_add + 0.1
      c.fire_rate_wait    = c.fire_rate_wait - 20
      c.lifetime_add     = c.lifetime_add + 80
    },
  },
  {
    id: "BOUNCE",
    name: "$action_bounce",
    description: "$actiondesc_bounce",
    sprite: "var(--sprite-action-bounce)",
    sprite_unidentified: "data/ui_gfx/gun_actions/bounce_unidentified.png",
    type: "modifier",
    spawn_level: "2,3,4,6",
    spawn_probability: "1,1,0.4,0.2",
    price: 50,
    mana: 0,
    
    action: function(c: GunActionState) {
      c.bounces = c.bounces + 10
      draw_actions( 1, true )
    },
  },
  {
    id: "REMOVE_BOUNCE",
    name: "$action_remove_bounce",
    description: "$actiondesc_remove_bounce",
    sprite: "var(--sprite-action-remove-bounce)",
    sprite_unidentified: "data/ui_gfx/gun_actions/bounce_unidentified.png",
    type: "modifier",
    spawn_level: "2,3,4,5",
    spawn_probability: "0.2,0.2,1,1",
    price: 50,
    mana: 0,
    
    action: function(c: GunActionState) {
      c.extra_entities = c.extra_entities + "data/entities/misc/remove_bounce.xml,"
      c.bounces = 0
      draw_actions( 1, true )
    },
  },
  {
    id: "HOMING",
    name: "$action_homing",
    description: "$actiondesc_homing",
    sprite: "var(--sprite-action-homing)",
    sprite_unidentified: "data/ui_gfx/gun_actions/homing_unidentified.png",
    related_extra_entities: [ "data/entities/misc/homing.xml", "data/entities/particles/tinyspark_white.xml" ],
    type: "modifier",
    spawn_level: "1,2,3,4,5,6",
    spawn_probability: "0.1,0.4,0.4,0.4,0.4,0.4",
    price: 220,
    mana: 70,
    
    action: function(c: GunActionState) {
      c.extra_entities = c.extra_entities + "data/entities/misc/homing.xml,data/entities/particles/tinyspark_white.xml,"
      draw_actions( 1, true )
    },
  },
  {
    id: "ANTI_HOMING",
    name: "$action_anti_homing",
    description: "$actiondesc_anti_homing",
    sprite: "var(--sprite-action-anti-homing)",
    sprite_unidentified: "data/ui_gfx/gun_actions/anti_homing_unidentified.png",
    related_extra_entities: [ "data/entities/misc/anti_homing.xml", "data/entities/particles/tinyspark_white.xml" ],
    type: "modifier",
    spawn_level: "1,2,3,4,5,6",
    spawn_probability: "0.05,0.3,0.3,0.1,0.1,0.01",
    price: 110,
    mana: 1,
    
    action: function(c: GunActionState) {
      c.extra_entities = c.extra_entities + "data/entities/misc/anti_homing.xml,data/entities/particles/tinyspark_white.xml,"
      c.fire_rate_wait    = c.fire_rate_wait - 20
      draw_actions( 1, true )
    },
  },
  {
    id: "HOMING_WAND",
    name: "$action_homing_wand",
    description: "$actiondesc_homing_wand",
    sprite: "var(--sprite-action-homing-wand)",
    sprite_unidentified: "data/ui_gfx/gun_actions/homing_unidentified.png",
    spawn_requires_flag: "card_unlocked_homing_wand",
    related_extra_entities: [ "data/entities/misc/homing_wand.xml", "data/entities/particles/tinyspark_white.xml" ],
    type: "modifier",
    spawn_level: "1,2,4,5,6,10",
    spawn_probability: "0.00001,0.08,0.08,0.25,0.25,0.2",
    price: 500,
    mana: 200,
    
    action: function(c: GunActionState) {
      c.extra_entities = c.extra_entities + "data/entities/misc/homing_wand.xml,data/entities/particles/tinyspark_white.xml,"
      draw_actions( 1, true )
    },
  },
  {
    id: "HOMING_SHORT",
    name: "$action_homing_short",
    description: "$actiondesc_homing_short",
    sprite: "var(--sprite-action-homing-short)",
    sprite_unidentified: "data/ui_gfx/gun_actions/homing_unidentified.png",
    related_extra_entities: [ "data/entities/misc/homing_short.xml", "data/entities/particles/tinyspark_white_weak.xml" ],
    type: "modifier",
    spawn_level: "1,2,3,4,5,6",
    spawn_probability: "0.4,0.8,1,0.4,0.3,0.1",
    price: 160,
    mana: 40,
    
    action: function(c: GunActionState) {
      c.extra_entities = c.extra_entities + "data/entities/misc/homing_short.xml,data/entities/particles/tinyspark_white_weak.xml,"
      draw_actions( 1, true )
    },
  },
  {
    id: "HOMING_ROTATE",
    name: "$action_homing_rotate",
    description: "$actiondesc_homing_rotate",
    sprite: "var(--sprite-action-homing-rotate)",
    sprite_unidentified: "data/ui_gfx/gun_actions/homing_unidentified.png",
    related_extra_entities: [ "data/entities/misc/homing_rotate.xml", "data/entities/particles/tinyspark_white.xml" ],
    type: "modifier",
    spawn_level: "2,3,4,5,6",
    spawn_probability: "0.2,0.4,0.6,0.4,0.4",
    price: 175,
    mana: 40,
    
    action: function(c: GunActionState) {
      c.extra_entities = c.extra_entities + "data/entities/misc/homing_rotate.xml,data/entities/particles/tinyspark_white.xml,"
      draw_actions( 1, true )
    },
  },
  {
    id: "HOMING_SHOOTER",
    name: "$action_homing_shooter",
    description: "$actiondesc_homing_shooter",
    sprite: "var(--sprite-action-homing-shooter)",
    sprite_unidentified: "data/ui_gfx/gun_actions/homing_unidentified.png",
    related_extra_entities: [ "data/entities/misc/homing_shooter.xml", "data/entities/particles/tinyspark_white.xml" ],
    type: "modifier",
    spawn_level: "2,3,4,6",
    spawn_probability: "0.2,0.3,0.2,0.2",
    price: 100,
    mana: 10,
    
    action: function(c: GunActionState) {
      c.extra_entities = c.extra_entities + "data/entities/misc/homing_shooter.xml,data/entities/particles/tinyspark_white.xml,"
      draw_actions( 1, true )
    },
  },
  {
    id: "AUTOAIM",
    name: "$action_autoaim",
    description: "$actiondesc_autoaim",
    sprite: "var(--sprite-action-autoaim)",
    sprite_unidentified: "data/ui_gfx/gun_actions/autoaim_unidentified.png",
    related_extra_entities: [ "data/entities/misc/autoaim.xml" ],
    type: "modifier",
    spawn_level: "2,3,4,5,6",
    spawn_probability: "0.4,0.4,0.4,0.4,0.4",
    price: 150,
    mana: 25,
    action: function(c: GunActionState) {
      c.extra_entities = c.extra_entities + "data/entities/misc/autoaim.xml,"
      draw_actions( 1, true )
    },
  },
  {
    id: "HOMING_ACCELERATING",
    name: "$action_homing_accelerating",
    description: "$actiondesc_homing_accelerating",
    sprite: "var(--sprite-action-homing-accelerating)",
    sprite_unidentified: "data/ui_gfx/gun_actions/homing_unidentified.png",
    related_extra_entities: [ "data/entities/misc/homing_accelerating.xml", "data/entities/particles/tinyspark_white_small.xml" ],
    type: "modifier",
    spawn_level: "1,2,3,4",
    spawn_probability: "0.1,0.3,0.3,0.5",
    price: 180,
    mana: 60,
    
    action: function(c: GunActionState) {
      c.extra_entities = c.extra_entities + "data/entities/misc/homing_accelerating.xml,data/entities/particles/tinyspark_white_small.xml,"
      draw_actions( 1, true )
    },
  },
  {
    id: "HOMING_CURSOR",
    name: "$action_homing_cursor",
    description: "$actiondesc_homing_cursor",
    sprite: "var(--sprite-action-homing-cursor)",
    sprite_unidentified: "data/ui_gfx/gun_actions/homing_unidentified.png",
    related_extra_entities: [ "data/entities/misc/homing_cursor.xml", "data/entities/particles/tinyspark_white.xml" ],
    type: "modifier",
    spawn_level: "2,3,4,5,6",
    spawn_probability: "0.7,0.7,0.4,0.4,1",
    price: 175,
    mana: 30,
    
    action: function(c: GunActionState) {
      c.extra_entities = c.extra_entities + "data/entities/misc/homing_cursor.xml,data/entities/particles/tinyspark_white.xml,"
      draw_actions( 1, true )
    },
  },
  {
    id: "HOMING_AREA",
    name: "$action_homing_area",
    description: "$actiondesc_homing_area",
    sprite: "var(--sprite-action-homing-area)",
    sprite_unidentified: "data/ui_gfx/gun_actions/homing_unidentified.png",
    related_extra_entities: [ "data/entities/misc/homing_area.xml", "data/entities/particles/tinyspark_white.xml" ],
    type: "modifier",
    spawn_level: "2,3,4,5,6",
    spawn_probability: "0.2,0.4,0.6,0.7,0.4",
    price: 175,
    mana: 60,
    
    action: function(c: GunActionState) {
      c.extra_entities = c.extra_entities + "data/entities/misc/homing_area.xml,data/entities/particles/tinyspark_white.xml,"
      c.fire_rate_wait    = c.fire_rate_wait + 8
      c.spread_degrees = c.spread_degrees + 6
      c.speed_multiplier  = c.speed_multiplier * 0.75
      
      if ( c.speed_multiplier >= 20 )  {
        c.speed_multiplier = Math.min( c.speed_multiplier, 20 )
      } else if ( c.speed_multiplier < 0 )  {
        c.speed_multiplier = 0
      }
      
      draw_actions( 1, true )
    },
  },
  
  {
    id: "PIERCING_SHOT",
    name: "$action_piercing_shot",
    description: "$actiondesc_piercing_shot",
    sprite: "var(--sprite-action-piercing-shot)",
    sprite_unidentified: "data/ui_gfx/gun_actions/homing_unidentified.png",
    related_extra_entities: [ "data/entities/misc/piercing_shot.xml" ],
    type: "modifier",
    spawn_level: "2,3,4,5,6",
    spawn_probability: "0.4,0.5,0.6,0.6,0.4",
    price: 190,
    mana: 140,
    
    action: function(c: GunActionState) {
      c.damage_projectile_add = c.damage_projectile_add - 0.6
      c.extra_entities = c.extra_entities + "data/entities/misc/piercing_shot.xml,"
      c.friendly_fire    = true
      draw_actions( 1, true )
    },
  },
  {
    id: "CLIPPING_SHOT",
    name: "$action_clipping_shot",
    description: "$actiondesc_clipping_shot",
    sprite: "var(--sprite-action-clipping-shot)",
    sprite_unidentified: "data/ui_gfx/gun_actions/homing_unidentified.png",
    related_extra_entities: [ "data/entities/misc/clipping_shot.xml" ],
    type: "modifier",
    spawn_level: "2,3,4,5,6",
    spawn_probability: "0.2,0.3,0.6,0.4,0.6",
    price: 200,
    mana: 160,
    
    action: function(c: GunActionState) {
      c.extra_entities = c.extra_entities + "data/entities/misc/clipping_shot.xml,"
      c.fire_rate_wait = c.fire_rate_wait + 50
      setCurrentReloadTime(current_reload_time + 40)
      draw_actions( 1, true )
    },
  },
  {
    id: "DAMAGE",
    name: "$action_damage",
    description: "$actiondesc_damage",
    sprite: "var(--sprite-action-damage)",
    sprite_unidentified: "data/ui_gfx/gun_actions/damage_unidentified.png",
    related_extra_entities: [ "data/entities/particles/tinyspark_yellow.xml" ],
    type: "modifier",
    spawn_level: "1,2,3,4,5",
    spawn_probability: "0.6,0.6,0.8,0.6,0.6",
    price: 140,
    mana: 5,
    
    custom_xml_file: "data/entities/misc/custom_cards/damage.xml",
    action: function(c: GunActionState) {
      c.damage_projectile_add = c.damage_projectile_add + 0.4
      c.gore_particles    = c.gore_particles + 5
      c.fire_rate_wait    = c.fire_rate_wait + 5
      c.extra_entities    = c.extra_entities + "data/entities/particles/tinyspark_yellow.xml,"
      shot_effects.recoil_knockback = shot_effects.recoil_knockback + 10.0
      draw_actions( 1, true )
    },
  },
  {
    id: "DAMAGE_RANDOM",
    name: "$action_damage_random",
    description: "$actiondesc_damage_random",
    sprite: "var(--sprite-action-damage-random)",
    sprite_unidentified: "data/ui_gfx/gun_actions/damage_unidentified.png",
    spawn_requires_flag: "card_unlocked_pyramid",
    related_extra_entities: [ "data/entities/particles/tinyspark_yellow.xml" ],
    type: "modifier",
    spawn_level: "3,4,5",
    spawn_probability: "0.7,0.6,0.6",
    price: 200,
    mana: 15,
    
    custom_xml_file: "data/entities/misc/custom_cards/damage_random.xml",
    action: function(c: GunActionState) {
      SetRandomSeed(this.id,  GameGetFrameNum(), GameGetFrameNum() + 253 )
      let multiplier = 0
      multiplier = Random(this.id,  -3, 4 ) * Random(this.id,  0, 2 )
      let result = 0
      result = c.damage_projectile_add + 0.4 * multiplier
      c.damage_projectile_add = result
      c.gore_particles    = c.gore_particles + 5 * multiplier
      c.fire_rate_wait    = c.fire_rate_wait + 5
      c.extra_entities    = c.extra_entities + "data/entities/particles/tinyspark_yellow.xml,"
      shot_effects.recoil_knockback = shot_effects.recoil_knockback + 10.0 * multiplier
      draw_actions( 1, true )
    },
  },
  {
    id: "BLOODLUST",
    name: "$action_bloodlust",
    description: "$actiondesc_bloodlust",
    sprite: "var(--sprite-action-bloodlust)",
    sprite_unidentified: "data/ui_gfx/gun_actions/homing_unidentified.png",
    related_extra_entities: [ "data/entities/particles/tinyspark_red.xml" ],
    type: "modifier",
    spawn_level: "1,3,4,5,6",
    spawn_probability: "0.2,0.3,0.6,0.7,0.3",
    price: 160,
    mana: 2,
    
    action: function(c: GunActionState) {
      c.damage_projectile_add = c.damage_projectile_add + 1.3
      c.gore_particles    = c.gore_particles + 15
      c.fire_rate_wait    = c.fire_rate_wait + 8
      c.friendly_fire    = true
      shot_effects.recoil_knockback = shot_effects.recoil_knockback + 30.0
      c.spread_degrees = c.spread_degrees + 6
      c.extra_entities    = c.extra_entities + "data/entities/particles/tinyspark_red.xml,"
      draw_actions( 1, true )
    },
  },
  {
    id: "DAMAGE_FOREVER",
    name: "$action_damage_forever",
    description: "$actiondesc_damage_forever",
    sprite: "var(--sprite-action-damage-forever)",
    sprite_unidentified: "data/ui_gfx/gun_actions/damage_unidentified.png",
    related_extra_entities: [ "data/entities/particles/tinyspark_red.xml" ],
    type: "modifier",
    spawn_level: "2,3,4,5,6,10",
    spawn_probability: "0.2,0.3,0.6,0.5,0.2,0.2",
    price: 240,
    mana: 0,
    max_uses: 20,
    never_unlimited: true,
    custom_xml_file: "data/entities/misc/custom_cards/damage_forever.xml",
    action: function(c: GunActionState) {
      if ( mana > 50 )  {
        let manaforspell = mana - 50
        c.damage_projectile_add = c.damage_projectile_add + 0.025 * manaforspell
        setMana(50)
      }
      
      c.gore_particles    = c.gore_particles + 15
      c.fire_rate_wait    = c.fire_rate_wait + 15
      setCurrentReloadTime(current_reload_time + 10)
      c.extra_entities    = c.extra_entities + "data/entities/particles/tinyspark_red.xml,"
      shot_effects.recoil_knockback = shot_effects.recoil_knockback + 10.0
      draw_actions( 1, true )
    },
  },
  {
    id: "CRITICAL_HIT",
    name: "$action_critical_hit",
    description: "$actiondesc_critical_hit",
    sprite: "var(--sprite-action-critical-hit)",
    sprite_unidentified: "data/ui_gfx/gun_actions/damage_unidentified.png",
    type: "modifier",
    spawn_level: "1,2,3,4,5",
    spawn_probability: "0.5,0.6,0.6,0.7,0.6",
    price: 140,
    mana: 5,
    
    custom_xml_file: "data/entities/misc/custom_cards/critical_hit.xml",
    action: function(c: GunActionState) {
      c.damage_critical_chance = c.damage_critical_chance + 15
      draw_actions( 1, true )
    },
  },
  {
    id: "AREA_DAMAGE",
    name: "$action_area_damage",
    description: "$actiondesc_area_damage",
    sprite: "var(--sprite-action-area-damage)",
    sprite_unidentified: "data/ui_gfx/gun_actions/homing_unidentified.png",
    related_extra_entities: [ "data/entities/misc/area_damage.xml" ],
    type: "modifier",
    spawn_level: "2,3,4,5,6",
    spawn_probability: "0.4,0.5,0.5,0.5,0.6",
    price: 140,
    mana: 30,
    
    action: function(c: GunActionState) {
      c.extra_entities = c.extra_entities + "data/entities/misc/area_damage.xml,"
      draw_actions( 1, true )
    },
  },
  {
    id: "SPELLS_TO_POWER",
    name: "$action_spells_to_power",
    description: "$actiondesc_spells_to_power",
    sprite: "var(--sprite-action-spells-to-power)",
    sprite_unidentified: "data/ui_gfx/gun_actions/homing_unidentified.png",
    related_extra_entities: [ "data/entities/misc/spells_to_power.xml" ],
    type: "modifier",
    spawn_level: "2,3,4,5,6,10",
    spawn_probability: "0.3,0.3,0.5,0.5,0.5,0.1",
    price: 140,
    mana: 110,
    
    action: function(c: GunActionState) {
      c.extra_entities = c.extra_entities + "data/entities/misc/spells_to_power.xml,"
      c.fire_rate_wait    = c.fire_rate_wait + 40
      draw_actions( 1, true )
    },
  },
  {
    id: "ESSENCE_TO_POWER",
    name: "$action_enemies_to_power",
    description: "$actiondesc_enemies_to_power",
    sprite: "var(--sprite-action-essence-to-power)",
    sprite_unidentified: "data/ui_gfx/gun_actions/homing_unidentified.png",
    related_extra_entities: [ "data/entities/misc/essence_to_power.xml" ],
    type: "modifier",
    spawn_level: "1,2,3,6,10",
    spawn_probability: "0.2,0.5,0.5,0.5,0.1",
    price: 120,
    mana: 110,
    
    action: function(c: GunActionState) {
      c.extra_entities = c.extra_entities + "data/entities/misc/essence_to_power.xml,"
      c.fire_rate_wait    = c.fire_rate_wait + 20
      draw_actions( 1, true )
    },
  },
  {
    id: "ZERO_DAMAGE",
    name: "$action_zero_damage",
    description: "$actiondesc_zero_damage",
    sprite: "var(--sprite-action-zero-damage)",
    sprite_unidentified: "data/ui_gfx/gun_actions/damage_unidentified.png",
    related_extra_entities: [ "data/entities/particles/tinyspark_white_small.xml", "data/entities/misc/zero_damage.xml" ],
    type: "modifier",
    spawn_level: "3,4,5,10",
    spawn_probability: "0.3,0.3,0.6,0.3",
    price: 50,
    mana: 5,
    
    action: function(c: GunActionState) {
      c.damage_electricity_add = 0
      c.damage_explosion_add = 0
      c.damage_explosion = 0
      c.damage_critical_chance = 0
      c.damage_ice_add = 0
      c.damage_projectile_add = 0
      c.damage_null_all = 1
      c.gore_particles    = 0
      c.fire_rate_wait    = c.fire_rate_wait - 5
      c.extra_entities    = c.extra_entities + "data/entities/particles/tinyspark_white_small.xml,data/entities/misc/zero_damage.xml,"
      shot_effects.recoil_knockback = shot_effects.recoil_knockback - 10.0
      c.lifetime_add     = c.lifetime_add + 280
      draw_actions( 1, true )
    },
  },
  
  {
    id: "HEAVY_SHOT",
    name: "$action_heavy_shot",
    description: "$actiondesc_heavy_shot",
    sprite: "var(--sprite-action-heavy-shot)",
    sprite_unidentified: "data/ui_gfx/gun_actions/heavy_shot_unidentified.png",
    related_extra_entities: [ "data/entities/particles/heavy_shot.xml" ],
    type: "modifier",
    spawn_level: "2,3,4",
    spawn_probability: "0.4,0.4,0.5",
    price: 150,
    mana: 7,
    
    custom_xml_file: "data/entities/misc/custom_cards/heavy_shot.xml",
    action: function(c: GunActionState) {
      c.damage_projectile_add = c.damage_projectile_add + 1.75
      c.fire_rate_wait    = c.fire_rate_wait + 10
      c.gore_particles    = c.gore_particles + 10
      c.speed_multiplier = c.speed_multiplier * 0.3
      shot_effects.recoil_knockback = shot_effects.recoil_knockback + 50.0
      c.extra_entities = c.extra_entities + "data/entities/particles/heavy_shot.xml,"
      
      if ( c.speed_multiplier >= 20 )  {
        c.speed_multiplier = Math.min( c.speed_multiplier, 20 )
      } else if ( c.speed_multiplier < 0 )  {
        c.speed_multiplier = 0
      }
      
      draw_actions( 1, true )
    },
  },
  {
    id: "LIGHT_SHOT",
    name: "$action_light_shot",
    description: "$actiondesc_light_shot",
    sprite: "var(--sprite-action-light-shot)",
    sprite_unidentified: "data/ui_gfx/gun_actions/heavy_shot_unidentified.png",
    related_extra_entities: [ "data/entities/particles/light_shot.xml" ],
    type: "modifier",
    spawn_level: "2,3,4",
    spawn_probability: "0.3,0.5,0.4",
    price: 60,
    mana: 5,
    
    custom_xml_file: "data/entities/misc/custom_cards/light_shot.xml",
    action: function(c: GunActionState) {
      c.damage_projectile_add = c.damage_projectile_add - 1.0
      c.explosion_radius = c.explosion_radius - 10.0
      if (c.explosion_radius < 0)  {
        c.explosion_radius = 0
      }
      c.fire_rate_wait    = c.fire_rate_wait - 3
      c.speed_multiplier = c.speed_multiplier * 7.5
      c.spread_degrees = c.spread_degrees - 6
      shot_effects.recoil_knockback = shot_effects.recoil_knockback - 10.0
      c.extra_entities = c.extra_entities + "data/entities/particles/light_shot.xml,"
      
      if ( c.speed_multiplier >= 20 )  {
        c.speed_multiplier = Math.min( c.speed_multiplier, 20 )
      } else if ( c.speed_multiplier < 0 )  {
        c.speed_multiplier = 0
      }
      
      draw_actions( 1, true )
    },
  },
  
  {
    id: "KNOCKBACK",
    name: "$action_knockback",
    description: "$actiondesc_knockback",
    sprite: "var(--sprite-action-knockback)",
    sprite_unidentified: "data/ui_gfx/gun_actions/knockback_unidentified.png",
    type: "modifier",
    spawn_level: "3,5",
    spawn_probability: "0.7,0.6",
    price: 100,
    mana: 5,
    
    action: function(c: GunActionState) {
      c.knockback_force = c.knockback_force + 5
      draw_actions( 1, true )
    },
  },
  {
    id: "RECOIL",
    name: "$action_recoil",
    description: "$actiondesc_recoil",
    sprite: "var(--sprite-action-recoil)",
    sprite_unidentified: "data/ui_gfx/gun_actions/recoil_unidentified.png",
    type: "modifier",
    spawn_level: "2,4",
    spawn_probability: "0.6,0.7",
    price: 100,
    mana: 5,
    
    action: function(c: GunActionState) {
      shot_effects.recoil_knockback = shot_effects.recoil_knockback + 200.0
      draw_actions( 1, true )
    },
  },
  {
    id: "RECOIL_DAMPER",
    name: "$action_recoil_damper",
    description: "$actiondesc_recoil_damper",
    sprite: "var(--sprite-action-recoil-damper)",
    sprite_unidentified: "data/ui_gfx/gun_actions/recoil_damper_unidentified.png",
    type: "modifier",
    spawn_level: "3,6",
    spawn_probability: "0.6,0.7",
    price: 100,
    mana: 5,
    
    action: function(c: GunActionState) {
      shot_effects.recoil_knockback = shot_effects.recoil_knockback - 200
      draw_actions( 1, true )
    },
  },
  {
    id: "SPEED",
    name: "$action_speed",
    description: "$actiondesc_speed",
    sprite: "var(--sprite-action-speed)",
    sprite_unidentified: "data/ui_gfx/gun_actions/speed_unidentified.png",
    type: "modifier",
    spawn_level: "1,2,3",
    spawn_probability: "1,0.5,0.5",
    price: 100,
    mana: 3,
    
    custom_xml_file: "data/entities/misc/custom_cards/speed.xml",
    action: function(c: GunActionState) {
      c.speed_multiplier = c.speed_multiplier * 2.5
      
      if ( c.speed_multiplier >= 20 )  {
        c.speed_multiplier = Math.min( c.speed_multiplier, 20 )
      } else if ( c.speed_multiplier < 0 )  {
        c.speed_multiplier = 0
      }
      
      draw_actions( 1, true )
    },
  },
  {
    id: "ACCELERATING_SHOT",
    name: "$action_accelerating_shot",
    description: "$actiondesc_accelerating_shot",
    sprite: "var(--sprite-action-accelerating-shot)",
    sprite_unidentified: "data/ui_gfx/gun_actions/heavy_shot_unidentified.png",
    related_extra_entities: [ "data/entities/misc/accelerating_shot.xml" ],
    type: "modifier",
    spawn_level: "2,3,4",
    spawn_probability: "0.5,0.4,1",
    price: 190,
    mana: 20,
    
    custom_xml_file: "data/entities/misc/custom_cards/accelerating_shot.xml",
    action: function(c: GunActionState) {
      c.fire_rate_wait    = c.fire_rate_wait + 8
      c.speed_multiplier = c.speed_multiplier * 0.32
      shot_effects.recoil_knockback = shot_effects.recoil_knockback + 10.0
      c.extra_entities = c.extra_entities + "data/entities/misc/accelerating_shot.xml,"
      
      if ( c.speed_multiplier >= 20 )  {
        c.speed_multiplier = Math.min( c.speed_multiplier, 20 )
      } else if ( c.speed_multiplier < 0 )  {
        c.speed_multiplier = 0
      }
      
      draw_actions( 1, true )
    },
  },
  {
    id: "DECELERATING_SHOT",
    name: "$action_decelerating_shot",
    description: "$actiondesc_decelerating_shot",
    sprite: "var(--sprite-action-decelerating-shot)",
    sprite_unidentified: "data/ui_gfx/gun_actions/heavy_shot_unidentified.png",
    related_extra_entities: [ "data/entities/misc/decelerating_shot.xml" ],
    type: "modifier",
    spawn_level: "2,3,4",
    spawn_probability: "0.4,0.1,0.7",
    price: 80,
    mana: 10,
    
    custom_xml_file: "data/entities/misc/custom_cards/decelerating_shot.xml",
    action: function(c: GunActionState) {
      c.fire_rate_wait    = c.fire_rate_wait - 8
      c.speed_multiplier = c.speed_multiplier * 1.68
      shot_effects.recoil_knockback = shot_effects.recoil_knockback - 10.0
      c.extra_entities = c.extra_entities + "data/entities/misc/decelerating_shot.xml,"
      
      if ( c.speed_multiplier >= 20 )  {
        c.speed_multiplier = Math.min( c.speed_multiplier, 20 )
      } else if ( c.speed_multiplier < 0 )  {
        c.speed_multiplier = 0
      }
      
      draw_actions( 1, true )
    },
  },
  
  {
    id: "EXPLOSIVE_PROJECTILE",
    name: "$action_explosive_projectile",
    description: "$actiondesc_explosive_projectile",
    sprite: "var(--sprite-action-explosive-projectile)",
    sprite_unidentified: "data/ui_gfx/gun_actions/explosive_projectile_unidentified.png",
    type: "modifier",
    spawn_level: "2,3,4",
    spawn_probability: "1,1,0.8",
    price: 120,
    mana: 30,
    
    custom_xml_file: "data/entities/misc/custom_cards/explosive_projectile.xml",
    action: function(c: GunActionState) {
      c.explosion_radius = c.explosion_radius + 15.0
      c.damage_explosion_add = c.damage_explosion_add + 0.2
      c.fire_rate_wait   = c.fire_rate_wait + 40
      c.speed_multiplier = c.speed_multiplier * 0.75
      shot_effects.recoil_knockback = shot_effects.recoil_knockback + 30.0
      
      if ( c.speed_multiplier >= 20 )  {
        c.speed_multiplier = Math.min( c.speed_multiplier, 20 )
      } else if ( c.speed_multiplier < 0 )  {
        c.speed_multiplier = 0
      }
      
      draw_actions( 1, true )
    },
  },
  {
    id: "CLUSTERMOD",
    name: "$action_clustermod",
    description: "$actiondesc_clustermod",
    sprite: "var(--sprite-action-clustermod)",
    sprite_unidentified: "data/ui_gfx/gun_actions/explosive_projectile_unidentified.png",
    type: "modifier",
    spawn_level: "1,2,3",
    spawn_probability: "0.5,1,0.6",
    price: 160,
    mana: 30,
    
    custom_xml_file: "data/entities/misc/custom_cards/clusterbomb.xml",
    action: function(c: GunActionState) {
      c.explosion_radius = c.explosion_radius + 4.0
      c.damage_explosion_add = c.damage_explosion_add + 0.2
      c.fire_rate_wait   = c.fire_rate_wait + 20
      shot_effects.recoil_knockback = shot_effects.recoil_knockback + 10.0
      
      c.extra_entities = c.extra_entities + "data/entities/misc/clusterbomb.xml,"
      
      draw_actions( 1, true )
    },
  },
  {
    id: "WATER_TO_POISON",
    name: "$action_water_to_poison",
    description: "$actiondesc_water_to_poison",
    sprite: "var(--sprite-action-water-to-poison)",
    sprite_unidentified: "data/ui_gfx/gun_actions/explosive_projectile_unidentified.png",
    related_extra_entities: [ "data/entities/misc/water_to_poison.xml", "data/entities/particles/tinyspark_purple.xml" ],
    type: "modifier",
    spawn_level: "2,3,4",
    spawn_probability: "0.3,0.3,0.3",
    price: 80,
    mana: 30,
    
    action: function(c: GunActionState) {
      c.extra_entities = c.extra_entities + "data/entities/misc/water_to_poison.xml,data/entities/particles/tinyspark_purple.xml,"
      c.fire_rate_wait = c.fire_rate_wait + 10
      draw_actions( 1, true )
    },
  },
  {
    id: "BLOOD_TO_ACID",
    name: "$action_blood_to_acid",
    description: "$actiondesc_blood_to_acid",
    sprite: "var(--sprite-action-blood-to-acid)",
    sprite_unidentified: "data/ui_gfx/gun_actions/explosive_projectile_unidentified.png",
    related_extra_entities: [ "data/entities/misc/blood_to_acid.xml", "data/entities/particles/tinyspark_red.xml" ],
    type: "modifier",
    spawn_level: "2,3,4",
    spawn_probability: "0.3,0.3,0.3",
    price: 80,
    mana: 30,
    
    action: function(c: GunActionState) {
      c.extra_entities = c.extra_entities + "data/entities/misc/blood_to_acid.xml,data/entities/particles/tinyspark_red.xml,"
      c.fire_rate_wait = c.fire_rate_wait + 10
      draw_actions( 1, true )
    },
  },
  {
    id: "LAVA_TO_BLOOD",
    name: "$action_lava_to_blood",
    description: "$actiondesc_lava_to_blood",
    sprite: "var(--sprite-action-lava-to-blood)",
    sprite_unidentified: "data/ui_gfx/gun_actions/explosive_projectile_unidentified.png",
    related_extra_entities: [ "data/entities/misc/lava_to_blood.xml", "data/entities/particles/tinyspark_orange.xml" ],
    type: "modifier",
    spawn_level: "2,3,4",
    spawn_probability: "0.3,0.3,0.3",
    price: 80,
    mana: 30,
    
    action: function(c: GunActionState) {
      c.extra_entities = c.extra_entities + "data/entities/misc/lava_to_blood.xml,data/entities/particles/tinyspark_orange.xml,"
      c.fire_rate_wait = c.fire_rate_wait + 10
      draw_actions( 1, true )
    },
  },
  {
    id: "LIQUID_TO_EXPLOSION",
    name: "$action_liquid_to_explosion",
    description: "$actiondesc_liquid_to_explosion",
    sprite: "var(--sprite-action-liquid-to-explosion)",
    sprite_unidentified: "data/ui_gfx/gun_actions/explosive_projectile_unidentified.png",
    related_extra_entities: [ "data/entities/misc/liquid_to_explosion.xml", "data/entities/particles/tinyspark_red.xml" ],
    type: "modifier",
    spawn_level: "2,3,4",
    spawn_probability: "0.3,0.3,0.3",
    price: 120,
    mana: 40,
    
    action: function(c: GunActionState) {
      c.extra_entities = c.extra_entities + "data/entities/misc/liquid_to_explosion.xml,data/entities/particles/tinyspark_red.xml,"
      c.fire_rate_wait = c.fire_rate_wait + 20
      draw_actions( 1, true )
    },
  },
  {
    id: "TOXIC_TO_ACID",
    name: "$action_toxic_to_acid",
    description: "$actiondesc_toxic_to_acid",
    sprite: "var(--sprite-action-toxic-to-acid)",
    sprite_unidentified: "data/ui_gfx/gun_actions/explosive_projectile_unidentified.png",
    related_extra_entities: [ "data/entities/misc/toxic_to_acid.xml", "data/entities/particles/tinyspark_green.xml" ],
    type: "modifier",
    spawn_level: "2,3,4",
    spawn_probability: "0.3,0.3,0.3",
    price: 120,
    mana: 50,
    
    action: function(c: GunActionState) {
      c.extra_entities = c.extra_entities + "data/entities/misc/toxic_to_acid.xml,data/entities/particles/tinyspark_green.xml,"
      c.fire_rate_wait = c.fire_rate_wait + 10
      draw_actions( 1, true )
    },
  },
  {
    id: "STATIC_TO_SAND",
    name: "$action_static_to_sand",
    description: "$actiondesc_static_to_sand",
    sprite: "var(--sprite-action-static-to-sand)",
    sprite_unidentified: "data/ui_gfx/gun_actions/explosive_projectile_unidentified.png",
    related_extra_entities: [ "data/entities/misc/static_to_sand.xml", "data/entities/particles/tinyspark_yellow.xml" ],
    type: "modifier",
    spawn_level: "2,3,4,10",
    spawn_probability: "0.3,0.3,0.3,0.2",
    price: 140,
    mana: 70,
    max_uses: 8,
    action: function(c: GunActionState) {
      c.extra_entities = c.extra_entities + "data/entities/misc/static_to_sand.xml,data/entities/particles/tinyspark_yellow.xml,"
      c.fire_rate_wait = c.fire_rate_wait + 60
      draw_actions( 1, true )
    },
  },
  {
    id: "TRANSMUTATION",
    name: "$action_transmutation",
    description: "$actiondesc_transmutation",
    sprite: "var(--sprite-action-transmutation)",
    sprite_unidentified: "data/ui_gfx/gun_actions/explosive_projectile_unidentified.png",
    related_extra_entities: [ "data/entities/misc/transmutation.xml", "data/entities/particles/tinyspark_purple_bright.xml" ],
    type: "modifier",
    spawn_level: "2,3,4,5,6,10",
    spawn_probability: "0.3,0.3,0.3,0.3,0.3,0.2",
    price: 180,
    mana: 80,
    max_uses: 8,
    action: function(c: GunActionState) {
      c.extra_entities = c.extra_entities + "data/entities/misc/transmutation.xml,data/entities/particles/tinyspark_purple_bright.xml,"
      c.fire_rate_wait = c.fire_rate_wait + 20
      draw_actions( 1, true )
    },
  },
  {
    id: "RANDOM_EXPLOSION",
    name: "$action_random_explosion",
    description: "$actiondesc_random_explosion",
    sprite: "var(--sprite-action-random-explosion)",
    sprite_unidentified: "data/ui_gfx/gun_actions/explosive_projectile_unidentified.png",
    related_extra_entities: [ "data/entities/misc/random_explosion.xml", "data/entities/particles/tinyspark_purple_bright.xml" ],
    type: "modifier",
    spawn_level: "3,5,6",
    spawn_probability: "0.3,0.6,1",
    price: 240,
    mana: 120,
    max_uses: 30,
    action: function(c: GunActionState) {
      c.extra_entities = c.extra_entities + "data/entities/misc/random_explosion.xml,data/entities/particles/tinyspark_purple_bright.xml,"
      c.fire_rate_wait = c.fire_rate_wait + 40
      draw_actions( 1, true )
    },
  },
  {
    id: "NECROMANCY",
    name: "$action_necromancy",
    description: "$actiondesc_necromancy",
    spawn_requires_flag: "card_unlocked_necromancy",
    sprite: "var(--sprite-action-necromancy)",
    sprite_unidentified: "data/ui_gfx/gun_actions/explosive_projectile_unidentified.png",
    type: "modifier",
    spawn_level: "2,3,4,5",
    spawn_probability: "0.4,0.6,0.6,0.3",
    price: 80,
    mana: 20,
    
    action: function(c: GunActionState) {
      c.game_effect_entities = c.game_effect_entities + "data/entities/misc/effect_necromancy.xml,"
      c.fire_rate_wait = c.fire_rate_wait + 10
      draw_actions( 1, true )
    },
  },
  {
    id: "LIGHT",
    name: "$action_light",
    description: "$actiondesc_light",
    sprite: "var(--sprite-action-light)",
    related_extra_entities: [ "data/entities/misc/light.xml" ],
    type: "modifier",
    spawn_level: "0,1,2,3,4",
    spawn_probability: "1,0.8,0.6,0.4,0.2",
    price: 20,
    mana: 1,
    action: function(c: GunActionState) {
      c.extra_entities = c.extra_entities + "data/entities/misc/light.xml,"
      draw_actions( 1, true )
    },
  },
  {
    id: "EXPLOSION",
    name: "$action_explosion",
    description: "$actiondesc_explosion",
    sprite: "var(--sprite-action-explosion)",
    sprite_unidentified: "data/ui_gfx/gun_actions/explosion_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/explosion.xml"],
    type: "static",
    spawn_level: "0,2,4,5",
    spawn_probability: "0.5,1,1,0.7",
    price: 160,
    mana: 80,
    
    custom_xml_file: "data/entities/misc/custom_cards/explosion.xml",
    is_dangerous_blast: true,
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/explosion.xml")
      c.fire_rate_wait = c.fire_rate_wait + 3
      c.screenshake = c.screenshake + 2.5
    },
  },
  {
    id: "EXPLOSION_LIGHT",
    name: "$action_explosion_light",
    description: "$actiondesc_explosion_light",
    sprite: "var(--sprite-action-explosion-light)",
    sprite_unidentified: "data/ui_gfx/gun_actions/explosion_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/explosion_light.xml"],
    type: "static",
    spawn_level: "2,3,5,6",
    spawn_probability: "0.5,1,0.7,0.5",
    price: 160,
    mana: 80,
    
    custom_xml_file: "data/entities/misc/custom_cards/explosion_light.xml",
    is_dangerous_blast: true,
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/explosion_light.xml")
      c.fire_rate_wait = c.fire_rate_wait + 3
      c.screenshake = c.screenshake + 2.5
    },
  },
  {
    id: "FIRE_BLAST",
    name: "$action_fire_blast",
    description: "$actiondesc_fire_blast",
    sprite: "var(--sprite-action-fire-blast)",
    sprite_unidentified: "data/ui_gfx/gun_actions/fire_blast_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/fireblast.xml"],
    type: "static",
    spawn_level: "0,1,3,5",
    spawn_probability: "0.5,0.7,0.6,0.4",
    price: 120,
    mana: 10,
    
    custom_xml_file: "data/entities/misc/custom_cards/fire_blast.xml",
    is_dangerous_blast: true,
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/fireblast.xml")
      c.fire_rate_wait = c.fire_rate_wait + 3
      c.screenshake = c.screenshake + 0.5
    },
  },
  {
    id: "POISON_BLAST",
    name: "$action_poison_blast",
    description: "$actiondesc_poison_blast",
    sprite: "var(--sprite-action-poison-blast)",
    sprite_unidentified: "data/ui_gfx/gun_actions/poison_blast_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/poison_blast.xml"],
    type: "static",
    spawn_level: "1,2,4,6",
    spawn_probability: "0.5,0.8,0.4,0.3",
    price: 140,
    mana: 30,
    
    custom_xml_file: "data/entities/misc/custom_cards/poison_blast.xml",
    is_dangerous_blast: true,
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/poison_blast.xml")
      c.fire_rate_wait = c.fire_rate_wait + 3
      c.screenshake = c.screenshake + 0.5
    },
  },
  {
    id: "ALCOHOL_BLAST",
    name: "$action_alcohol_blast",
    description: "$actiondesc_alcohol_blast",
    sprite: "var(--sprite-action-alcohol-blast)",
    sprite_unidentified: "data/ui_gfx/gun_actions/poison_blast_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/alcohol_blast.xml"],
    type: "static",
    spawn_level: "1,2,4,6",
    spawn_probability: "0.5,0.6,0.65,0.3",
    price: 140,
    mana: 30,
    
    custom_xml_file: "data/entities/misc/custom_cards/alcohol_blast.xml",
    is_dangerous_blast: true,
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/alcohol_blast.xml")
      c.fire_rate_wait = c.fire_rate_wait + 3
      c.screenshake = c.screenshake + 0.5
    },
  },
  {
    id: "THUNDER_BLAST",
    name: "$action_thunder_blast",
    description: "$actiondesc_thunder_blast",
    sprite: "var(--sprite-action-thunder-blast)",
    sprite_unidentified: "data/ui_gfx/gun_actions/thunder_blast_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/thunder_blast.xml"],
    type: "static",
    spawn_level: "1,3,5,6,10",
    spawn_probability: "0.5,0.6,0.7,0.5,0.1",
    price: 180,
    mana: 110,
    
    custom_xml_file: "data/entities/misc/custom_cards/thunder_blast.xml",
    is_dangerous_blast: true,
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/thunder_blast.xml")
      c.fire_rate_wait = c.fire_rate_wait + 15
      c.screenshake = c.screenshake + 3.0
      shot_effects.recoil_knockback = shot_effects.recoil_knockback + 30.0
    },
  },
  
  {
    id: "BERSERK_FIELD",
    name: "$action_berserk_field",
    description: "$actiondesc_berserk_field",
    sprite: "var(--sprite-action-berserk-field)",
    sprite_unidentified: "data/ui_gfx/gun_actions/berserk_field_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/berserk_field.xml"],
    type: "static",
    spawn_level: "2,3,4",
    spawn_probability: "0.3,0.6,0.3",
    price: 200,
    mana: 30,
    max_uses: 15,
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/berserk_field.xml")
      c.fire_rate_wait = c.fire_rate_wait + 15
    },
  },
  {
    id: "POLYMORPH_FIELD",
    name: "$action_polymorph_field",
    description: "$actiondesc_polymorph_field",
    sprite: "var(--sprite-action-polymorph-field)",
    sprite_unidentified: "data/ui_gfx/gun_actions/polymorph_field_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/polymorph_field.xml"],
    type: "static",
    spawn_level: "0,1,2,3,4,5,6",
    spawn_probability: "0.3,0.3,0.3,0.8,0.8,0.3,0.3",
    price: 200,
    mana: 50,
    max_uses: 5,
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/polymorph_field.xml")
      c.fire_rate_wait = c.fire_rate_wait + 15
    },
  },
  {
    id: "CHAOS_POLYMORPH_FIELD",
    name: "$action_chaos_polymorph_field",
    description: "$actiondesc_chaos_polymorph_field",
    sprite: "var(--sprite-action-chaos-polymorph-field)",
    sprite_unidentified: "data/ui_gfx/gun_actions/chaos_polymorph_field_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/chaos_polymorph_field.xml"],
    type: "static",
    spawn_level: "1,2,3,4,5,6",
    spawn_probability: "0.3,0.3,0.5,0.6,0.3,0.3",
    price: 200,
    mana: 20,
    max_uses: 10,
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/chaos_polymorph_field.xml")
      c.fire_rate_wait = c.fire_rate_wait + 15
    },
  },
  {
    id: "ELECTROCUTION_FIELD",
    name: "$action_electrocution_field",
    description: "$actiondesc_electrocution_field",
    sprite: "var(--sprite-action-electrocution-field)",
    sprite_unidentified: "data/ui_gfx/gun_actions/electrocution_field_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/electrocution_field.xml"],
    type: "static",
    spawn_level: "1,3,5,6",
    spawn_probability: "0.3,0.6,0.8,0.3",
    price: 200,
    mana: 60,
    max_uses: 15,
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/electrocution_field.xml")
      c.fire_rate_wait = c.fire_rate_wait + 15
    },
  },
  {
    id: "FREEZE_FIELD",
    name: "$action_freeze_field",
    description: "$actiondesc_freeze_field",
    sprite: "var(--sprite-action-freeze-field)",
    sprite_unidentified: "data/ui_gfx/gun_actions/freeze_field_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/freeze_field.xml"],
    type: "static",
    spawn_level: "0,2,4,5",
    spawn_probability: "0.3,0.6,0.7,0.3",
    price: 200,
    mana: 50,
    max_uses: 15,
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/freeze_field.xml")
      c.fire_rate_wait = c.fire_rate_wait + 15
    },
  },
  {
    id: "REGENERATION_FIELD",
    name: "$action_regeneration_field",
    description: "$actiondesc_regeneration_field",
    sprite: "var(--sprite-action-regeneration-field)",
    sprite_unidentified: "data/ui_gfx/gun_actions/regeneration_field_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/regeneration_field.xml"],
    type: "static",
    spawn_level: "1,2,3,4",
    spawn_probability: "0.3,0.3,0.4,0.3",
    price: 250,
    mana: 80,
    max_uses: 2,
    never_unlimited: true,
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/regeneration_field.xml")
      c.fire_rate_wait = c.fire_rate_wait + 15
    },
  },
  {
    id: "TELEPORTATION_FIELD",
    name: "$action_teleportation_field",
    description: "$actiondesc_teleportation_field",
    sprite: "var(--sprite-action-teleportation-field)",
    sprite_unidentified: "data/ui_gfx/gun_actions/teleportation_field_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/teleportation_field.xml"],
    type: "static",
    spawn_level: "0,1,2,3,4,5",
    spawn_probability: "0.3,0.6,0.3,0.3,0.6,0.3",
    price: 150,
    mana: 30,
    max_uses: 15,
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/teleportation_field.xml")
      c.fire_rate_wait = c.fire_rate_wait + 15
    },
  },
  {
    id: "LEVITATION_FIELD",
    name: "$action_levitation_field",
    description: "$actiondesc_levitation_field",
    sprite: "var(--sprite-action-levitation-field)",
    sprite_unidentified: "data/ui_gfx/gun_actions/levitation_field_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/levitation_field.xml"],
    type: "static",
    spawn_level: "1,2,3,4",
    spawn_probability: "0.3,0.6,0.6,0.3",
    price: 120,
    mana: 10,
    max_uses: 15,
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/levitation_field.xml")
      c.fire_rate_wait = c.fire_rate_wait + 15
    },
  },
  
  {
    id: "SHIELD_FIELD",
    name: "$action_shield_field",
    description: "$actiondesc_shield_field",
    sprite: "var(--sprite-action-shield-field)",
    sprite_unidentified: "data/ui_gfx/gun_actions/shield_field_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/shield_field.xml"],
    type: "static",
    spawn_level: "2,3,4,5,6",
    spawn_probability: "0.3,0.3,0.4,0.5,0.3",
    price: 160,
    mana: 20,
    max_uses: 10,
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/shield_field.xml")
      c.fire_rate_wait = c.fire_rate_wait + 15
    },
  },
  {
    id: "PROJECTILE_TRANSMUTATION_FIELD",
    name: "$action_projectile_transmutation_field",
    description: "$actiondesc_projectile_transmutation_field",
    sprite: "var(--sprite-action-projectile-transmutation-field)",
    sprite_unidentified: "data/ui_gfx/gun_actions/chaos_polymorph_field_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/projectile_transmutation_field.xml"],
    type: "static",
    spawn_level: "2,3,4,5,6",
    spawn_probability: "0.3,0.4,0.4,0.3,0.3",
    price: 250,
    mana: 120,
    max_uses: 6,
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/projectile_transmutation_field.xml")
      c.fire_rate_wait = c.fire_rate_wait + 15
    },
  },
  {
    id: "PROJECTILE_THUNDER_FIELD",
    name: "$action_projectile_thunder_field",
    description: "$actiondesc_projectile_thunder_field",
    sprite: "var(--sprite-action-projectile-thunder-field)",
    sprite_unidentified: "data/ui_gfx/gun_actions/chaos_polymorph_field_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/projectile_thunder_field.xml"],
    type: "static",
    spawn_level: "3,4,5,6",
    spawn_probability: "0.3,0.3,0.5,0.3",
    price: 300,
    mana: 140,
    max_uses: 6,
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/projectile_thunder_field.xml")
      c.fire_rate_wait = c.fire_rate_wait + 15
    },
  },
  {
    id: "PROJECTILE_GRAVITY_FIELD",
    name: "$action_projectile_gravity_field",
    description: "$actiondesc_projectile_gravity_field",
    sprite: "var(--sprite-action-projectile-gravity-field)",
    sprite_unidentified: "data/ui_gfx/gun_actions/chaos_polymorph_field_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/projectile_gravity_field.xml"],
    type: "static",
    spawn_level: "2,5,6",
    spawn_probability: "0.6,0.3,0.3",
    price: 250,
    mana: 120,
    max_uses: 6,
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/projectile_gravity_field.xml")
      c.fire_rate_wait = c.fire_rate_wait + 15
    },
  },
  {
    id: "VACUUM_POWDER",
    name: "$action_vacuum_powder",
    description: "$actiondesc_vacuum_powder",
    sprite: "var(--sprite-action-vacuum-powder)",
    sprite_unidentified: "data/ui_gfx/gun_actions/chaos_polymorph_field_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/vacuum_powder.xml"],
    type: "static",
    spawn_level: "2,3,5,6",
    spawn_probability: "0.3,0.7,0.3,0.4",
    price: 150,
    mana: 40,
    max_uses: 20,
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/vacuum_powder.xml")
      c.fire_rate_wait = c.fire_rate_wait + 10
    },
  },
  {
    id: "VACUUM_LIQUID",
    name: "$action_vacuum_liquid",
    description: "$actiondesc_vacuum_liquid",
    sprite: "var(--sprite-action-vacuum-liquid)",
    sprite_unidentified: "data/ui_gfx/gun_actions/chaos_polymorph_field_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/vacuum_liquid.xml"],
    type: "static",
    spawn_level: "2,4,5,6",
    spawn_probability: "0.3,0.7,0.4,0.3",
    price: 150,
    mana: 40,
    max_uses: 20,
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/vacuum_liquid.xml")
      c.fire_rate_wait = c.fire_rate_wait + 10
    },
  },
  {
    id: "VACUUM_ENTITIES",
    name: "$action_vacuum_entities",
    description: "$actiondesc_vacuum_entities",
    sprite: "var(--sprite-action-vacuum-entities)",
    sprite_unidentified: "data/ui_gfx/gun_actions/chaos_polymorph_field_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/vacuum_entities.xml"],
    type: "static",
    spawn_level: "2,3,5,6",
    spawn_probability: "0.3,0.7,0.3,0.4",
    price: 200,
    mana: 50,
    max_uses: 20,
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/vacuum_entities.xml")
      c.fire_rate_wait = c.fire_rate_wait + 10
    },
  },
  {
    id: "SEA_LAVA",
    name: "$action_sea_lava",
    description: "$actiondesc_sea_lava",
    spawn_requires_flag: "card_unlocked_sea_lava",
    sprite: "var(--sprite-action-sea-lava)",
    sprite_unidentified: "data/ui_gfx/gun_actions/sea_lava_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/sea_lava.xml"],
    type: "material",
    spawn_level: "0,4,5,6",
    spawn_probability: "0.2,0.2,0.5,0.6",
    price: 350,
    mana: 140,
    max_uses: 3,
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/sea_lava.xml")
      c.fire_rate_wait = c.fire_rate_wait + 15
    },
  },
  {
    id: "SEA_ALCOHOL",
    name: "$action_sea_alcohol",
    description: "$actiondesc_sea_alcohol",
    sprite: "var(--sprite-action-sea-alcohol)",
    sprite_unidentified: "data/ui_gfx/gun_actions/sea_lava_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/sea_alcohol.xml"],
    type: "material",
    spawn_level: "0,4,5,6",
    spawn_probability: "0.3,0.5,0.6,0.3",
    price: 350,
    mana: 140,
    max_uses: 3,
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/sea_alcohol.xml")
      c.fire_rate_wait = c.fire_rate_wait + 15
    },
  },
  {
    id: "SEA_OIL",
    name: "$action_sea_oil",
    description: "$actiondesc_sea_oil",
    sprite: "var(--sprite-action-sea-oil)",
    sprite_unidentified: "data/ui_gfx/gun_actions/sea_oil_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/sea_oil.xml"],
    type: "material",
    spawn_level: "0,4,5,6",
    spawn_probability: "0.3,0.5,0.6,0.3",
    price: 350,
    mana: 140,
    max_uses: 3,
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/sea_oil.xml")
      c.fire_rate_wait = c.fire_rate_wait + 15
    },
  },
  {
    id: "SEA_WATER",
    name: "$action_sea_water",
    description: "$actiondesc_sea_water",
    sprite: "var(--sprite-action-sea-water)",
    sprite_unidentified: "data/ui_gfx/gun_actions/sea_water_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/sea_water.xml"],
    type: "material",
    spawn_level: "0,4,5,6",
    spawn_probability: "0.5,0.4,0.3,0.2",
    price: 350,
    mana: 140,
    max_uses: 3,
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/sea_water.xml")
      c.fire_rate_wait = c.fire_rate_wait + 15
    },
  },
  {
    id: "SEA_SWAMP",
    name: "$action_sea_swamp",
    description: "$actiondesc_sea_swamp",
    sprite: "var(--sprite-action-sea-swamp)",
    sprite_unidentified: "data/ui_gfx/gun_actions/sea_swamp_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/sea_swamp.xml"],
    type: "material",
    spawn_level: "0",
    spawn_probability: "0",
    price: 350,
    mana: 140,
    max_uses: 3,
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/sea_swamp.xml")
      c.fire_rate_wait = c.fire_rate_wait + 15
    },
  },
  {
    id: "SEA_ACID",
    name: "$action_sea_acid",
    description: "$actiondesc_sea_acid",
    sprite: "var(--sprite-action-sea-acid)",
    sprite_unidentified: "data/ui_gfx/gun_actions/sea_acid_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/sea_acid.xml"],
    type: "material",
    spawn_level: "0,4,5,6",
    spawn_probability: "0.2,0.2,0.4,0.5",
    price: 350,
    mana: 140,
    max_uses: 3,
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/sea_acid.xml")
      c.fire_rate_wait = c.fire_rate_wait + 15
    },
  },
  {
    id: "SEA_ACID_GAS",
    name: "$action_sea_acid_gas",
    description: "$actiondesc_sea_acid_gas",
    sprite: "var(--sprite-action-sea-acid-gas)",
    sprite_unidentified: "data/ui_gfx/gun_actions/sea_acid_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/sea_acid_gas.xml"],
    type: "material",
    spawn_level: "0,4,5,6",
    spawn_probability: "0.3,0.4,0.4,0.3",
    price: 200,
    mana: 140,
    max_uses: 3,
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/sea_acid_gas.xml")
      c.fire_rate_wait = c.fire_rate_wait + 15
    },
  },
  {
    id: "SEA_MIMIC",
    name: "$action_sea_mimic",
    description: "$actiondesc_sea_mimic",
    sprite: "var(--sprite-action-sea-mimic)",
    sprite_unidentified: "data/ui_gfx/gun_actions/sea_acid_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/sea_mimic.xml"],
    type: "material",
    spawn_level: "0,4,5,6,10",
    spawn_probability: "0.05,0.05,0.1,0.1,0.2",
    spawn_requires_flag: "card_unlocked_sea_mimic",
    price: 350,
    mana: 140,
    max_uses: 2,
    never_unlimited: true,
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/sea_mimic.xml")
      c.fire_rate_wait = c.fire_rate_wait + 15
    },
  },
  {
    id: "CLOUD_WATER",
    name: "$action_cloud_water",
    description: "$actiondesc_cloud_water",
    sprite: "var(--sprite-action-cloud-water)",
    sprite_unidentified: "data/ui_gfx/gun_actions/cloud_water_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/cloud_water.xml"],
    type: "static",
    spawn_level: "0,1,2,3,4,5",
    spawn_probability: "0.2,0.3,0.4,0.4,0.3,0.2",
    price: 140,
    mana: 30,
    max_uses: 10,
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/cloud_water.xml")
      c.fire_rate_wait = c.fire_rate_wait + 15
    },
  },
  {
    id: "CLOUD_OIL",
    name: "$action_cloud_oil",
    description: "$actiondesc_cloud_oil",
    sprite: "var(--sprite-action-cloud-oil)",
    sprite_unidentified: "data/ui_gfx/gun_actions/cloud_water_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/cloud_oil.xml"],
    type: "static",
    spawn_level: "0,1,2,3,4,5",
    spawn_probability: "0.2,0.3,0.4,0.4,0.3,0.2",
    price: 100,
    mana: 20,
    max_uses: 15,
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/cloud_oil.xml")
      c.fire_rate_wait = c.fire_rate_wait + 15
    },
  },
  {
    id: "CLOUD_BLOOD",
    name: "$action_cloud_blood",
    description: "$actiondesc_cloud_blood",
    sprite: "var(--sprite-action-cloud-blood)",
    sprite_unidentified: "data/ui_gfx/gun_actions/cloud_water_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/cloud_blood.xml"],
    type: "static",
    spawn_level: "0,1,2,3,4,5",
    spawn_probability: "0.2,0.3,0.3,0.4,0.3,0.2",
    price: 200,
    mana: 60,
    max_uses: 3,
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/cloud_blood.xml")
      c.fire_rate_wait = c.fire_rate_wait + 30
    },
  },
  {
    id: "CLOUD_ACID",
    name: "$action_cloud_acid",
    description: "$actiondesc_cloud_acid",
    sprite: "var(--sprite-action-cloud-acid)",
    sprite_unidentified: "data/ui_gfx/gun_actions/cloud_water_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/cloud_acid.xml"],
    type: "static",
    spawn_level: "0,1,2,3,4,5",
    spawn_probability: "0.2,0.2,0.4,0.2,0.2,0.5",
    price: 180,
    mana: 90,
    max_uses: 8,
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/cloud_acid.xml")
      c.fire_rate_wait = c.fire_rate_wait + 15
    },
  },
  {
    id: "CLOUD_THUNDER",
    name: "$action_cloud_thunder",
    description: "$actiondesc_cloud_thunder",
    sprite: "var(--sprite-action-cloud-thunder)",
    spawn_requires_flag: "card_unlocked_cloud_thunder",
    sprite_unidentified: "data/ui_gfx/gun_actions/cloud_water_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/cloud_thunder.xml"],
    type: "static",
    spawn_level: "0,1,2,3,4,5",
    spawn_probability: "0.3,0.3,0.2,0.3,0.4,0.5",
    price: 190,
    mana: 90,
    max_uses: 5,
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/cloud_thunder.xml")
      c.fire_rate_wait = c.fire_rate_wait + 30
    },
  },
  {
    id: "ELECTRIC_CHARGE",
    name: "$action_electric_charge",
    description: "$actiondesc_electric_charge",
    sprite: "var(--sprite-action-electric-charge)",
    sprite_unidentified: "data/ui_gfx/gun_actions/electric_charge_unidentified.png",
    related_extra_entities: [ "data/entities/particles/electricity.xml" ],
    type: "modifier",
    spawn_level: "1,2,4,5",
    spawn_probability: "1,1,0.8,0.7",
    price: 150,
    mana: 8,
    
    custom_xml_file: "data/entities/misc/custom_cards/electric_charge.xml",
    action: function(c: GunActionState) {
      c.lightning_count = c.lightning_count + 1
      c.damage_electricity_add = c.damage_electricity_add + 0.1
      c.extra_entities = c.extra_entities + "data/entities/particles/electricity.xml,"
      draw_actions( 1, true )
    },
  },
  {
    id: "MATTER_EATER",
    name: "$action_matter_eater",
    description: "$actiondesc_matter_eater",
    sprite: "var(--sprite-action-matter-eater)",
    sprite_unidentified: "data/ui_gfx/gun_actions/electric_charge_unidentified.png",
    related_extra_entities: [ "data/entities/misc/matter_eater.xml" ],
    type: "modifier",
    spawn_level: "1,2,4,5,10",
    spawn_probability: "0.1,0.9,0.1,0.2,0.2",
    price: 280,
    mana: 120,
    max_uses: 10,
    never_unlimited: true,
    action: function(c: GunActionState) {
      c.extra_entities = c.extra_entities + "data/entities/misc/matter_eater.xml,"
      draw_actions( 1, true )
    },
  },
  {
    id: "FREEZE",
    name: "$action_freeze",
    description: "$actiondesc_freeze",
    sprite: "var(--sprite-action-freeze)",
    sprite_unidentified: "data/ui_gfx/gun_actions/freeze_unidentified.png",
    related_extra_entities: [ "data/entities/particles/freeze_charge.xml" ],
    type: "modifier",
    spawn_level: "1,3,4,5",
    spawn_probability: "1,1,0.9,0.8",
    price: 140,
    mana: 10,
    
    custom_xml_file: "data/entities/misc/custom_cards/freeze.xml",
    action: function(c: GunActionState) {
      c.damage_ice_add = c.damage_ice_add + 0.2
      c.game_effect_entities = c.game_effect_entities + "data/entities/misc/effect_frozen.xml,"
      c.extra_entities = c.extra_entities + "data/entities/particles/freeze_charge.xml,"
      draw_actions( 1, true )
    },
  },
  {
    id: "HITFX_BURNING_CRITICAL_HIT",
    name: "$action_hitfx_burning_critical_hit",
    description: "$actiondesc_hitfx_burning_critical_hit",
    sprite: "var(--sprite-action-hitfx-burning-critical-hit)",
    sprite_unidentified: "data/entities/misc/hitfx_burning_critical_hit.xml",
    related_extra_entities: [ "data/entities/particles/freeze_charge.xml" ],
    type: "modifier",
    spawn_level: "1,3,4,5",
    spawn_probability: "0.2,0.4,0.2,0.2",
    price: 70,
    mana: 10,
    
    action: function(c: GunActionState) {
      c.extra_entities = c.extra_entities + "data/entities/misc/hitfx_burning_critical_hit.xml,"
      draw_actions( 1, true )
    },
  },
  {
    id: "HITFX_CRITICAL_WATER",
    name: "$action_hitfx_critical_water",
    description: "$actiondesc_hitfx_critical_water",
    sprite: "var(--sprite-action-hitfx-critical-water)",
    sprite_unidentified: "data/ui_gfx/gun_actions/freeze_unidentified.png",
    related_extra_entities: [ "data/entities/misc/hitfx_critical_water.xml" ],
    type: "modifier",
    spawn_level: "1,3,4,5",
    spawn_probability: "0.2,0.2,0.4,0.2",
    price: 70,
    mana: 10,
    
    action: function(c: GunActionState) {
      c.extra_entities = c.extra_entities + "data/entities/misc/hitfx_critical_water.xml,"
      draw_actions( 1, true )
    },
  },
  {
    id: "HITFX_CRITICAL_OIL",
    name: "$action_hitfx_critical_oil",
    description: "$actiondesc_hitfx_critical_oil",
    sprite: "var(--sprite-action-hitfx-critical-oil)",
    sprite_unidentified: "data/ui_gfx/gun_actions/freeze_unidentified.png",
    related_extra_entities: [ "data/entities/misc/hitfx_critical_oil.xml" ],
    type: "modifier",
    spawn_level: "1,3,4,5",
    spawn_probability: "0.2,0.4,0.2,0.2",
    price: 70,
    mana: 10,
    
    action: function(c: GunActionState) {
      c.extra_entities = c.extra_entities + "data/entities/misc/hitfx_critical_oil.xml,"
      draw_actions( 1, true )
    },
  },
  {
    id: "HITFX_CRITICAL_BLOOD",
    name: "$action_hitfx_critical_blood",
    description: "$actiondesc_hitfx_critical_blood",
    sprite: "var(--sprite-action-hitfx-critical-blood)",
    sprite_unidentified: "data/ui_gfx/gun_actions/freeze_unidentified.png",
    related_extra_entities: [ "data/entities/misc/hitfx_critical_blood.xml" ],
    type: "modifier",
    spawn_level: "1,3,4,5",
    spawn_probability: "0.2,0.2,0.2,0.4",
    price: 70,
    mana: 10,
    
    action: function(c: GunActionState) {
      c.extra_entities = c.extra_entities + "data/entities/misc/hitfx_critical_blood.xml,"
      draw_actions( 1, true )
    },
  },
  {
    id: "HITFX_TOXIC_CHARM",
    name: "$action_hitfx_toxic_charm",
    description: "$actiondesc_hitfx_toxic_charm",
    sprite: "var(--sprite-action-hitfx-toxic-charm)",
    sprite_unidentified: "data/ui_gfx/gun_actions/freeze_unidentified.png",
    related_extra_entities: [ "data/entities/misc/hitfx_toxic_charm.xml" ],
    type: "modifier",
    spawn_level: "1,3,4,5",
    spawn_probability: "0.2,0.2,0.3,0.2",
    price: 150,
    mana: 70,
    
    action: function(c: GunActionState) {
      c.extra_entities = c.extra_entities + "data/entities/misc/hitfx_toxic_charm.xml,"
      draw_actions( 1, true )
    },
  },
  {
    id: "HITFX_EXPLOSION_SLIME",
    name: "$action_hitfx_explosion_slime",
    description: "$actiondesc_hitfx_explosion_slime",
    sprite: "var(--sprite-action-hitfx-explosion-slime)",
    sprite_unidentified: "data/ui_gfx/gun_actions/freeze_unidentified.png",
    related_extra_entities: [ "data/entities/misc/hitfx_explode_slime.xml" ],
    type: "modifier",
    spawn_level: "1,3,4,5",
    spawn_probability: "0.2,0.3,0.2,0.2",
    price: 140,
    mana: 20,
    
    action: function(c: GunActionState) {
      c.extra_entities = c.extra_entities + "data/entities/misc/hitfx_explode_slime.xml,"
      draw_actions( 1, true )
    },
  },
  {
    id: "HITFX_EXPLOSION_SLIME_GIGA",
    name: "$action_hitfx_explosion_slime_giga",
    description: "$actiondesc_hitfx_explosion_slime_giga",
    sprite: "var(--sprite-action-hitfx-explosion-slime-giga)",
    sprite_unidentified: "data/ui_gfx/gun_actions/freeze_unidentified.png",
    related_extra_entities: [ "data/entities/misc/hitfx_explode_slime_giga.xml", "data/entities/particles/tinyspark_purple.xml" ],
    type: "modifier",
    spawn_level: "1,3,4,5",
    spawn_probability: "0.1,0.1,0.3,0.1",
    price: 300,
    mana: 200,
    max_uses: 20,
    action: function(c: GunActionState) {
      c.extra_entities = c.extra_entities + "data/entities/misc/hitfx_explode_slime_giga.xml,data/entities/particles/tinyspark_purple.xml,"
      draw_actions( 1, true )
    },
  },
  {
    id: "HITFX_EXPLOSION_ALCOHOL",
    name: "$action_hitfx_explosion_alcohol",
    description: "$actiondesc_hitfx_explosion_alcohol",
    sprite: "var(--sprite-action-hitfx-explosion-alcohol)",
    sprite_unidentified: "data/ui_gfx/gun_actions/freeze_unidentified.png",
    related_extra_entities: [ "data/entities/misc/hitfx_explode_alcohol.xml" ],
    type: "modifier",
    spawn_level: "1,3,4,5",
    spawn_probability: "0.3,0.2,0.2,0.2",
    price: 140,
    mana: 20,
    
    action: function(c: GunActionState) {
      c.extra_entities = c.extra_entities + "data/entities/misc/hitfx_explode_alcohol.xml,"
      draw_actions( 1, true )
    },
  },
  {
    id: "HITFX_EXPLOSION_ALCOHOL_GIGA",
    name: "$action_hitfx_explosion_alcohol_giga",
    description: "$actiondesc_hitfx_explosion_alcohol_giga",
    sprite: "var(--sprite-action-hitfx-explosion-alcohol-giga)",
    sprite_unidentified: "data/ui_gfx/gun_actions/freeze_unidentified.png",
    related_extra_entities: [ "data/entities/misc/hitfx_explode_alcohol_giga.xml", "data/entities/particles/tinyspark_orange.xml" ],
    type: "modifier",
    spawn_level: "1,3,4,5",
    spawn_probability: "0.1,0.1,0.1,0.3",
    price: 300,
    mana: 200,
    max_uses: 20,
    action: function(c: GunActionState) {
      c.extra_entities = c.extra_entities + "data/entities/misc/hitfx_explode_alcohol_giga.xml,data/entities/particles/tinyspark_orange.xml,"
      draw_actions( 1, true )
    },
  },
  {
    id: "HITFX_PETRIFY",
    name: "$action_petrify",
    description: "$actiondesc_petrify_a",
    sprite: "var(--sprite-action-hitfx-petrify)",
    sprite_unidentified: "data/ui_gfx/gun_actions/explosive_projectile_unidentified.png",
    type: "modifier",
    spawn_level: "2,3,5,6",
    spawn_probability: "0.2,0.3,0.2,0.3",
    price: 140,
    mana: 10,
    action: function(c: GunActionState) {
      c.extra_entities = c.extra_entities + "data/entities/misc/hitfx_petrify.xml,"
      draw_actions( 1, true )
    },
  },
  
  {
    id: "ROCKET_DOWNWARDS",
    name: "$action_rocket_downwards",
    description: "$actiondesc_rocket_downwards",
    sprite: "var(--sprite-action-rocket-downwards)",
    sprite_unidentified: "data/ui_gfx/gun_actions/sinewave_unidentified.png",
    related_extra_entities: [ "data/entities/misc/rocket_downwards.xml" ],
    type: "modifier",
    spawn_level: "1,2,3,4",
    spawn_probability: "0.2,0.5,0.7,0.7",
    price: 200,
    mana: 90,
    action: function(c: GunActionState) {
      c.extra_entities = c.extra_entities + "data/entities/misc/rocket_downwards.xml,"
      c.fire_rate_wait = c.fire_rate_wait + 25
      draw_actions( 1, true )
    },
  },
  {
    id: "ROCKET_OCTAGON",
    name: "$action_rocket_octagon",
    description: "$actiondesc_rocket_octagon",
    sprite: "var(--sprite-action-rocket-octagon)",
    sprite_unidentified: "data/ui_gfx/gun_actions/sinewave_unidentified.png",
    related_extra_entities: [ "data/entities/misc/rocket_octagon.xml" ],
    type: "modifier",
    spawn_level: "2,3,4",
    spawn_probability: "0.5,0.6,0.3",
    price: 200,
    mana: 100,
    action: function(c: GunActionState) {
      c.extra_entities = c.extra_entities + "data/entities/misc/rocket_octagon.xml,"
      c.fire_rate_wait = c.fire_rate_wait + 20
      draw_actions( 1, true )
    },
  },
  {
    id: "FIZZLE",
    name: "$action_fizzle",
    description: "$actiondesc_fizzle",
    sprite: "var(--sprite-action-fizzle)",
    sprite_unidentified: "data/ui_gfx/gun_actions/sinewave_unidentified.png",
    related_extra_entities: [ "data/entities/misc/fizzle.xml" ],
    type: "modifier",
    spawn_level: "3,4,5",
    spawn_probability: "0.4,0.3,0.1",
    price: 0,
    mana: 0,
    
    action: function(c: GunActionState) {
      c.extra_entities = c.extra_entities + "data/entities/misc/fizzle.xml,"
      c.speed_multiplier = c.speed_multiplier * 1.2
      c.fire_rate_wait = c.fire_rate_wait - 10
      
      if ( c.speed_multiplier >= 20 )  {
        c.speed_multiplier = Math.min( c.speed_multiplier, 20 )
      } else if ( c.speed_multiplier < 0 )  {
        c.speed_multiplier = 0
      }
      
      draw_actions( 1, true )
    },
  },
  {
    id: "BOUNCE_EXPLOSION",
    name: "$action_bounce_explosion",
    description: "$actiondesc_bounce_explosion",
    sprite: "var(--sprite-action-bounce-explosion)",
    sprite_unidentified: "data/ui_gfx/gun_actions/sinewave_unidentified.png",
    related_extra_entities: [ "data/entities/misc/bounce_explosion.xml" ],
    type: "modifier",
    spawn_level: "2,3,4,5",
    spawn_probability: "0.2,0.6,0.8,0.8",
    price: 180,
    mana: 20,
    
    action: function(c: GunActionState) {
      c.extra_entities = c.extra_entities + "data/entities/misc/bounce_explosion.xml,"
      c.bounces = c.bounces + 1
      c.fire_rate_wait = c.fire_rate_wait + 25
      shot_effects.recoil_knockback = shot_effects.recoil_knockback + 20.0
      draw_actions( 1, true )
    },
  },
  {
    id: "BOUNCE_SPARK",
    name: "$action_bounce_spark",
    description: "$actiondesc_bounce_spark",
    sprite: "var(--sprite-action-bounce-spark)",
    sprite_unidentified: "data/ui_gfx/gun_actions/sinewave_unidentified.png",
    related_extra_entities: [ "data/entities/misc/bounce_spark.xml" ],
    type: "modifier",
    spawn_level: "1,2,3,4",
    spawn_probability: "0.2,0.6,0.6,0.6",
    price: 120,
    mana: 20,
    
    action: function(c: GunActionState) {
      c.extra_entities = c.extra_entities + "data/entities/misc/bounce_spark.xml,"
      c.bounces = c.bounces + 1
      c.fire_rate_wait = c.fire_rate_wait + 8
      shot_effects.recoil_knockback = shot_effects.recoil_knockback + 5.0
      draw_actions( 1, true )
    },
  },
  {
    id: "BOUNCE_LASER",
    name: "$action_bounce_laser",
    description: "$actiondesc_bounce_laser",
    sprite: "var(--sprite-action-bounce-laser)",
    sprite_unidentified: "data/ui_gfx/gun_actions/sinewave_unidentified.png",
    related_extra_entities: [ "data/entities/misc/bounce_laser.xml" ],
    type: "modifier",
    spawn_level: "3,4,5",
    spawn_probability: "0.4,0.8,0.4",
    price: 180,
    mana: 30,
    
    action: function(c: GunActionState) {
      c.extra_entities = c.extra_entities + "data/entities/misc/bounce_laser.xml,"
      c.bounces = c.bounces + 1
      c.fire_rate_wait = c.fire_rate_wait + 12
      shot_effects.recoil_knockback = shot_effects.recoil_knockback + 5.0
      draw_actions( 1, true )
    },
  },
  {
    id: "BOUNCE_LASER_EMITTER",
    name: "$action_bounce_laser_emitter",
    description: "$actiondesc_bounce_laser_emitter",
    sprite: "var(--sprite-action-bounce-laser-emitter)",
    sprite_unidentified: "data/ui_gfx/gun_actions/sinewave_unidentified.png",
    related_extra_entities: [ "data/entities/misc/bounce_laser_emitter.xml" ],
    type: "modifier",
    spawn_level: "3,4,5",
    spawn_probability: "0.4,0.8,0.4",
    price: 180,
    mana: 40,
    
    action: function(c: GunActionState) {
      c.extra_entities = c.extra_entities + "data/entities/misc/bounce_laser_emitter.xml,"
      c.bounces = c.bounces + 1
      c.fire_rate_wait = c.fire_rate_wait + 12
      shot_effects.recoil_knockback = shot_effects.recoil_knockback + 5.0
      draw_actions( 1, true )
    },
  },
  {
    id: "BOUNCE_LARPA",
    name: "$action_bounce_larpa",
    description: "$actiondesc_bounce_larpa",
    sprite: "var(--sprite-action-bounce-larpa)",
    sprite_unidentified: "data/ui_gfx/gun_actions/sinewave_unidentified.png",
    related_extra_entities: [ "data/entities/misc/bounce_larpa.xml" ],
    type: "modifier",
    spawn_level: "4,5,6",
    spawn_probability: "0.4,0.6,0.4",
    price: 250,
    mana: 80,
    
    action: function(c: GunActionState) {
      c.extra_entities = c.extra_entities + "data/entities/misc/bounce_larpa.xml,"
      c.bounces = c.bounces + 1
      c.fire_rate_wait = c.fire_rate_wait + 32
      shot_effects.recoil_knockback = shot_effects.recoil_knockback + 10.0
      draw_actions( 1, true )
    },
  },
  {
    id: "BOUNCE_SMALL_EXPLOSION",
    name: "$action_bounce_small_explosion",
    description: "$actiondesc_bounce_small_explosion",
    sprite: "var(--sprite-action-bounce-small-explosion)",
    sprite_unidentified: "data/ui_gfx/gun_actions/sinewave_unidentified.png",
    related_extra_entities: [ "data/entities/misc/bounce_small_explosion.xml" ],
    type: "modifier",
    spawn_level: "0,1,2",
    spawn_probability: "0.5,0.3,0.3",
    price: 100,
    mana: 10,
    
    action: function(c: GunActionState) {
      c.extra_entities = c.extra_entities + "data/entities/misc/bounce_small_explosion.xml,"
      c.bounces = c.bounces + 1
      c.fire_rate_wait = c.fire_rate_wait + 9
      shot_effects.recoil_knockback = shot_effects.recoil_knockback + 10.0
      draw_actions( 1, true )
    },
  },
  {
    id: "BOUNCE_LIGHTNING",
    name: "$action_bounce_lightning",
    description: "$actiondesc_bounce_lightning",
    sprite: "var(--sprite-action-bounce-lightning)",
    sprite_unidentified: "data/ui_gfx/gun_actions/sinewave_unidentified.png",
    related_extra_entities: [ "data/entities/misc/bounce_lightning.xml" ],
    type: "modifier",
    spawn_level: "1,3,5",
    spawn_probability: "0.1,0.3,0.6",
    price: 180,
    mana: 40,
    
    action: function(c: GunActionState) {
      c.extra_entities = c.extra_entities + "data/entities/misc/bounce_lightning.xml,"
      c.bounces = c.bounces + 1
      c.fire_rate_wait = c.fire_rate_wait + 25
      shot_effects.recoil_knockback = shot_effects.recoil_knockback + 10.0
      draw_actions( 1, true )
    },
  },
  {
    id: "BOUNCE_HOLE",
    name: "$action_bounce_hole",
    description: "$actiondesc_bounce_hole",
    sprite: "var(--sprite-action-bounce-hole)",
    sprite_unidentified: "data/ui_gfx/gun_actions/sinewave_unidentified.png",
    related_extra_entities: [ "data/entities/misc/bounce_hole.xml" ],
    type: "modifier",
    spawn_level: "2,4,6,10",
    spawn_probability: "0.1,0.4,0.4,0.1",
    price: 220,
    mana: 60,
    max_uses: 20,
    never_unlimited: true,
    action: function(c: GunActionState) {
      c.extra_entities = c.extra_entities + "data/entities/misc/bounce_hole.xml,"
      c.bounces = c.bounces + 1
      c.fire_rate_wait = c.fire_rate_wait + 40
      shot_effects.recoil_knockback = shot_effects.recoil_knockback + 10.0
      draw_actions( 1, true )
    },
  },
  {
    id: "FIREBALL_RAY",
    name: "$action_fireball_ray",
    description: "$actiondesc_fireball_ray",
    sprite: "var(--sprite-action-fireball-ray)",
    sprite_unidentified: "data/ui_gfx/gun_actions/electric_charge_unidentified.png",
    related_extra_entities: [ "data/entities/misc/fireball_ray.xml" ],
    type: "modifier",
    spawn_level: "1,2,4,5",
    spawn_probability: "0.6,0.6,0.4,0.4",
    price: 150,
    mana: 110,
    max_uses: 16,
    action: function(c: GunActionState) {
      c.extra_entities = c.extra_entities + "data/entities/misc/fireball_ray.xml,"
      draw_actions( 1, true )
    },
  },
  {
    id: "LIGHTNING_RAY",
    name: "$action_lightning_ray",
    description: "$actiondesc_lightning_ray",
    sprite: "var(--sprite-action-lightning-ray)",
    sprite_unidentified: "data/ui_gfx/gun_actions/electric_charge_unidentified.png",
    related_extra_entities: [ "data/entities/misc/lightning_ray.xml" ],
    type: "modifier",
    spawn_level: "1,2,3,4,5",
    spawn_probability: "0,0.2,0.4,0.4,0.4",
    price: 180,
    mana: 110,
    max_uses: 16,
    custom_xml_file: "data/entities/misc/custom_cards/electric_charge.xml",
    action: function(c: GunActionState) {
      c.extra_entities = c.extra_entities + "data/entities/misc/lightning_ray.xml,"
      draw_actions( 1, true )
    },
  },
  {
    id: "TENTACLE_RAY",
    name: "$action_tentacle_ray",
    description: "$actiondesc_tentacle_ray",
    sprite: "var(--sprite-action-tentacle-ray)",
    sprite_unidentified: "data/ui_gfx/gun_actions/electric_charge_unidentified.png",
    related_extra_entities: [ "data/entities/misc/tentacle_ray.xml" ],
    type: "modifier",
    spawn_level: "1,2,3,4,5",
    spawn_probability: "0.1,0,0.4,0.4,0.4",
    price: 150,
    mana: 110,
    max_uses: 16,
    action: function(c: GunActionState) {
      c.extra_entities = c.extra_entities + "data/entities/misc/tentacle_ray.xml,"
      draw_actions( 1, true )
    },
  },
  {
    id: "LASER_EMITTER_RAY",
    name: "$action_laser_emitter_ray",
    description: "$actiondesc_laser_emitter_ray",
    sprite: "var(--sprite-action-laser-emitter-ray)",
    sprite_unidentified: "data/ui_gfx/gun_actions/electric_charge_unidentified.png",
    related_extra_entities: [ "data/entities/misc/laser_emitter_ray.xml" ],
    type: "modifier",
    spawn_level: "1,2,3,4,5",
    spawn_probability: "0,0.1,0.4,0.4,0.4",
    price: 150,
    mana: 110,
    max_uses: 16,
    action: function(c: GunActionState) {
      c.extra_entities = c.extra_entities + "data/entities/misc/laser_emitter_ray.xml,"
      draw_actions( 1, true )
    },
  },
  {
    id: "FIREBALL_RAY_LINE",
    name: "$action_fireball_ray_line",
    description: "$actiondesc_fireball_ray_line",
    sprite: "var(--sprite-action-fireball-ray-line)",
    sprite_unidentified: "data/ui_gfx/gun_actions/electric_charge_unidentified.png",
    related_extra_entities: [ "data/entities/misc/fireball_ray_line.xml" ],
    type: "modifier",
    spawn_level: "2,3,4,5,6",
    spawn_probability: "0.6,0.4,0.4,0.4,1",
    price: 120,
    mana: 130,
    max_uses: 20,
    action: function(c: GunActionState) {
      c.extra_entities = c.extra_entities + "data/entities/misc/fireball_ray_line.xml,"
      draw_actions( 1, true )
    },
  },
  {
    id: "FIREBALL_RAY_ENEMY",
    name: "$action_fireball_ray_enemy",
    description: "$actiondesc_fireball_ray_enemy",
    sprite: "var(--sprite-action-fireball-ray-enemy)",
    sprite_unidentified: "data/ui_gfx/gun_actions/electric_charge_unidentified.png",
    related_extra_entities: [ "data/entities/misc/hitfx_fireball_ray_enemy.xml" ],
    type: "modifier",
    spawn_level: "1,2,4,5",
    spawn_probability: "0.5,0.6,0.4,0.3",
    price: 100,
    mana: 90,
    max_uses: 20,
    action: function(c: GunActionState) {
      c.extra_entities = c.extra_entities + "data/entities/misc/hitfx_fireball_ray_enemy.xml,"
      draw_actions( 1, true )
    },
  },
  {
    id: "LIGHTNING_RAY_ENEMY",
    name: "$action_lightning_ray_enemy",
    description: "$actiondesc_lightning_ray_enemy",
    sprite: "var(--sprite-action-lightning-ray-enemy)",
    sprite_unidentified: "data/ui_gfx/gun_actions/electric_charge_unidentified.png",
    related_extra_entities: [ "data/entities/misc/hitfx_lightning_ray_enemy.xml" ],
    type: "modifier",
    spawn_level: "1,2,3,4,5",
    spawn_probability: "0,0.2,0.4,0.4,0.5",
    price: 150,
    mana: 90,
    max_uses: 20,
    custom_xml_file: "data/entities/misc/custom_cards/electric_charge.xml",
    action: function(c: GunActionState) {
      c.extra_entities = c.extra_entities + "data/entities/misc/hitfx_lightning_ray_enemy.xml,"
      draw_actions( 1, true )
    },
  },
  {
    id: "TENTACLE_RAY_ENEMY",
    name: "$action_tentacle_ray_enemy",
    description: "$actiondesc_tentacle_ray_enemy",
    sprite: "var(--sprite-action-tentacle-ray-enemy)",
    sprite_unidentified: "data/ui_gfx/gun_actions/electric_charge_unidentified.png",
    related_extra_entities: [ "data/entities/misc/hitfx_tentacle_ray_enemy.xml" ],
    type: "modifier",
    spawn_level: "1,2,3,4,5",
    spawn_probability: "0,0.1,0.4,0.5,0.4",
    price: 150,
    mana: 90,
    max_uses: 20,
    action: function(c: GunActionState) {
      c.extra_entities = c.extra_entities + "data/entities/misc/hitfx_tentacle_ray_enemy.xml,"
      draw_actions( 1, true )
    },
  },
  {
    id: "GRAVITY_FIELD_ENEMY",
    name: "$action_gravity_field_enemy",
    description: "$actiondesc_gravity_field_enemy",
    sprite: "var(--sprite-action-gravity-field-enemy)",
    sprite_unidentified: "data/ui_gfx/gun_actions/electric_charge_unidentified.png",
    related_extra_entities: [ "data/entities/misc/hitfx_gravity_field_enemy.xml" ],
    type: "modifier",
    spawn_level: "1,2,4,5",
    spawn_probability: "0.5,0.6,0.4,0.4",
    price: 250,
    mana: 110,
    max_uses: 20,
    action: function(c: GunActionState) {
      c.extra_entities = c.extra_entities + "data/entities/misc/hitfx_gravity_field_enemy.xml,"
      draw_actions( 1, true )
    },
  },
  {
    id: "CURSE",
    name: "$action_curse",
    description: "$actiondesc_curse",
    sprite: "var(--sprite-action-curse)",
    sprite_unidentified: "data/ui_gfx/gun_actions/electric_charge_unidentified.png",
    related_extra_entities: [ "data/entities/misc/hitfx_curse.xml" ],
    type: "modifier",
    spawn_level: "2,3,5,10",
    spawn_probability: "0.6,0.7,0.4,0.1",
    price: 140,
    mana: 30,
    action: function(c: GunActionState) {
      c.extra_entities = c.extra_entities + "data/entities/misc/hitfx_curse.xml,"
      draw_actions( 1, true )
    },
  },
  {
    id: "CURSE_WITHER_PROJECTILE",
    name: "$action_curse_wither_projectile",
    description: "$actiondesc_curse_wither_projectile",
    sprite: "var(--sprite-action-curse-wither-projectile)",
    sprite_unidentified: "data/ui_gfx/gun_actions/electric_charge_unidentified.png",
    related_extra_entities: [ "data/entities/misc/hitfx_curse_wither_projectile.xml" ],
    type: "modifier",
    spawn_level: "3,4,5,6,10",
    spawn_probability: "0.2,0.4,0.7,0.7,0.1",
    price: 100,
    mana: 50,
    action: function(c: GunActionState) {
      c.extra_entities = c.extra_entities + "data/entities/misc/hitfx_curse_wither_projectile.xml,"
      draw_actions( 1, true )
    },
  },
  {
    id: "CURSE_WITHER_EXPLOSION",
    name: "$action_curse_wither_explosion",
    description: "$actiondesc_curse_wither_explosion",
    sprite: "var(--sprite-action-curse-wither-explosion)",
    sprite_unidentified: "data/ui_gfx/gun_actions/electric_charge_unidentified.png",
    related_extra_entities: [ "data/entities/misc/hitfx_curse_wither_explosion.xml" ],
    type: "modifier",
    spawn_level: "2,3,4,5,10",
    spawn_probability: "0.2,0.4,0.7,0.7,0.1",
    price: 100,
    mana: 50,
    action: function(c: GunActionState) {
      c.extra_entities = c.extra_entities + "data/entities/misc/hitfx_curse_wither_explosion.xml,"
      draw_actions( 1, true )
    },
  },
  {
    id: "CURSE_WITHER_MELEE",
    name: "$action_curse_wither_melee",
    description: "$actiondesc_curse_wither_melee",
    sprite: "var(--sprite-action-curse-wither-melee)",
    sprite_unidentified: "data/ui_gfx/gun_actions/electric_charge_unidentified.png",
    related_extra_entities: [ "data/entities/misc/hitfx_curse_wither_melee.xml" ],
    type: "modifier",
    spawn_level: "3,4,5,6,10",
    spawn_probability: "0.2,0.4,0.7,0.7,0.1",
    price: 100,
    mana: 50,
    action: function(c: GunActionState) {
      c.extra_entities = c.extra_entities + "data/entities/misc/hitfx_curse_wither_melee.xml,"
      draw_actions( 1, true )
    },
  },
  {
    id: "CURSE_WITHER_ELECTRICITY",
    name: "$action_curse_wither_electricity",
    description: "$actiondesc_curse_wither_electricity",
    sprite: "var(--sprite-action-curse-wither-electricity)",
    sprite_unidentified: "data/ui_gfx/gun_actions/electric_charge_unidentified.png",
    related_extra_entities: [ "data/entities/misc/hitfx_curse_wither_electricity.xml" ],
    type: "modifier",
    spawn_level: "1,4,5,6,10",
    spawn_probability: "0.2,0.4,0.7,0.7,0.1",
    price: 100,
    mana: 50,
    action: function(c: GunActionState) {
      c.extra_entities = c.extra_entities + "data/entities/misc/hitfx_curse_wither_electricity.xml,"
      draw_actions( 1, true )
    },
  },
  {
    id: "ORBIT_DISCS",
    name: "$action_orbit_discs",
    description: "$actiondesc_orbit_discs",
    sprite: "var(--sprite-action-orbit-discs)",
    sprite_unidentified: "data/ui_gfx/gun_actions/electric_charge_unidentified.png",
    related_extra_entities: [ "data/entities/misc/orbit_discs.xml" ],
    spawn_requires_flag: "card_unlocked_dragon",
    type: "modifier",
    spawn_level: "1,2,4,5",
    spawn_probability: "0.3,0.65,0.4,0.3",
    price: 200,
    mana: 70,
    action: function(c: GunActionState) {
      c.extra_entities = c.extra_entities + "data/entities/misc/orbit_discs.xml,"
      draw_actions( 1, true )
    },
  },
  {
    id: "ORBIT_FIREBALLS",
    name: "$action_orbit_fireballs",
    description: "$actiondesc_orbit_fireballs",
    sprite: "var(--sprite-action-orbit-fireballs)",
    sprite_unidentified: "data/ui_gfx/gun_actions/electric_charge_unidentified.png",
    related_extra_entities: [ "data/entities/misc/orbit_fireballs.xml" ],
    spawn_requires_flag: "card_unlocked_dragon",
    type: "modifier",
    spawn_level: "0,1,2,4,5",
    spawn_probability: "0.2,0.3,0.7,0.4,0.2",
    price: 140,
    mana: 40,
    action: function(c: GunActionState) {
      c.extra_entities = c.extra_entities + "data/entities/misc/orbit_fireballs.xml,"
      draw_actions( 1, true )
    },
  },
  {
    id: "ORBIT_NUKES",
    name: "$action_orbit_nukes",
    description: "$actiondesc_orbit_nukes",
    sprite: "var(--sprite-action-orbit-nukes)",
    sprite_unidentified: "data/ui_gfx/gun_actions/electric_charge_unidentified.png",
    related_extra_entities: [ "data/entities/misc/orbit_nukes.xml" ],
    spawn_requires_flag: "card_unlocked_dragon",
    type: "modifier",
    ai_never_uses: true,
    spawn_level: "2,4,5,6,10",
    spawn_probability: "0.1,0.2,0.1,0.2,1",
    price: 400,
    mana: 250,
    max_uses: 3,
    action: function(c: GunActionState) {
      c.extra_entities = c.extra_entities + "data/entities/misc/orbit_nukes.xml,"
      draw_actions( 1, true )
    },
  },
  {
    id: "ORBIT_LASERS",
    name: "$action_orbit_lasers",
    description: "$actiondesc_orbit_lasers",
    sprite: "var(--sprite-action-orbit-lasers)",
    sprite_unidentified: "data/ui_gfx/gun_actions/electric_charge_unidentified.png",
    related_extra_entities: [ "data/entities/misc/orbit_lasers.xml" ],
    spawn_requires_flag: "card_unlocked_dragon",
    type: "modifier",
    spawn_level: "1,2,4,5,10",
    spawn_probability: "0.2,0.7,0.4,0.3,0.2",
    price: 200,
    mana: 100,
    action: function(c: GunActionState) {
      c.extra_entities = c.extra_entities + "data/entities/misc/orbit_lasers.xml,"
      draw_actions( 1, true )
    },
  },
  {
    id: "ORBIT_LARPA",
    name: "$action_orbit_larpa",
    description: "$actiondesc_orbit_larpa",
    sprite: "var(--sprite-action-orbit-larpa)",
    sprite_unidentified: "data/ui_gfx/gun_actions/electric_charge_unidentified.png",
    related_extra_entities: [ "data/entities/misc/orbit_larpa.xml" ],
    spawn_requires_flag: "card_unlocked_dragon",
    type: "modifier",
    spawn_level: "3,4,6,10",
    spawn_probability: "0.2,0.2,0.8,0.2",
    price: 240,
    mana: 90,
    action: function(c: GunActionState) {
      c.extra_entities = c.extra_entities + "data/entities/misc/orbit_larpa.xml,"
      draw_actions( 1, true )
    },
  },
  {
    id: "CHAIN_SHOT",
    name: "$action_chain_shot",
    description: "$actiondesc_chain_shot",
    sprite: "var(--sprite-action-chain-shot)",
    sprite_unidentified: "data/ui_gfx/gun_actions/homing_unidentified.png",
    related_extra_entities: [ "data/entities/misc/chain_shot.xml" ],
    type: "modifier",
    spawn_level: "2,4,5",
    spawn_probability: "0.4,0.6,0.8",
    price: 240,
    mana: 70,
    
    action: function(c: GunActionState) {
      c.extra_entities = c.extra_entities + "data/entities/misc/chain_shot.xml,"
      c.lifetime_add = c.lifetime_add - 30
      c.damage_projectile_add = c.damage_projectile_add - 0.2
      c.explosion_radius = c.explosion_radius - 5.0
      if (c.explosion_radius < 0)  {
        c.explosion_radius = 0
      }
      c.spread_degrees = c.spread_degrees + 10.0
      draw_actions( 1, true )
    },
  },
  
  
  
  {
    id: "ARC_ELECTRIC",
    name: "$action_arc_electric",
    description: "$actiondesc_arc_electric",
    sprite: "var(--sprite-action-arc-electric)",
    sprite_unidentified: "data/ui_gfx/gun_actions/arc_electric_unidentified.png",
    related_extra_entities: [ "data/entities/misc/arc_electric.xml" ],
    type: "modifier",
    spawn_level: "2,3,4,5,6",
    spawn_probability: "0.4,0.4,0.4,0.4,0.8",
    price: 170,
    
    mana: 15,
    custom_xml_file: "data/entities/misc/custom_cards/arc_electric.xml",
    action: function(c: GunActionState) {
      c.extra_entities = c.extra_entities + "data/entities/misc/arc_electric.xml,"
      draw_actions( 1, true )
    },
  },
  {
    id: "ARC_FIRE",
    name: "$action_arc_fire",
    description: "$actiondesc_arc_fire",
    sprite: "var(--sprite-action-arc-fire)",
    sprite_unidentified: "data/ui_gfx/gun_actions/arc_fire_unidentified.png",
    related_extra_entities: [ "data/entities/misc/arc_fire.xml" ],
    type: "modifier",
    spawn_level: "1,2,3,4,5",
    spawn_probability: "0.4,0.2,0.2,0.5,0.2",
    price: 160,
    
    mana: 15,
    custom_xml_file: "data/entities/misc/custom_cards/arc_fire.xml",
    action: function(c: GunActionState) {
      c.extra_entities = c.extra_entities + "data/entities/misc/arc_fire.xml,"
      draw_actions( 1, true )
    },
  },
  {
    id: "ARC_GUNPOWDER",
    name: "$action_arc_gunpowder",
    description: "$actiondesc_arc_gunpowder",
    sprite: "var(--sprite-action-arc-gunpowder)",
    sprite_unidentified: "data/ui_gfx/gun_actions/arc_fire_unidentified.png",
    related_extra_entities: [ "data/entities/misc/arc_gunpowder.xml" ],
    type: "modifier",
    spawn_level: "1,2,3,4,5",
    spawn_probability: "0.4,0.4,0.2,0.4,0.2",
    price: 160,
    
    mana: 15,
    
    action: function(c: GunActionState) {
      c.extra_entities = c.extra_entities + "data/entities/misc/arc_gunpowder.xml,"
      draw_actions( 1, true )
    },
  },
  {
    id: "ARC_POISON",
    name: "$action_arc_poison",
    description: "$actiondesc_arc_poison",
    sprite: "var(--sprite-action-arc-poison)",
    sprite_unidentified: "data/ui_gfx/gun_actions/arc_fire_unidentified.png",
    related_extra_entities: [ "data/entities/misc/arc_poison.xml" ],
    type: "modifier",
    spawn_level: "1,2,3,4,5",
    spawn_probability: "0.4,0.2,0.4,0.2,0.4",
    price: 160,
    
    mana: 15,
    
    action: function(c: GunActionState) {
      c.extra_entities = c.extra_entities + "data/entities/misc/arc_poison.xml,"
      draw_actions( 1, true )
    },
  },
  {
    id: "CRUMBLING_EARTH_PROJECTILE",
    name: "$action_crumbling_earth_projectile",
    description: "$actiondesc_crumbling_earth_projectile",
    sprite: "var(--sprite-action-crumbling-earth-projectile)",
    sprite_unidentified: "data/ui_gfx/gun_actions/arc_fire_unidentified.png",
    related_extra_entities: [ "data/entities/misc/crumbling_earth_projectile.xml" ],
    type: "modifier",
    spawn_level: "1,2,3,4,5",
    spawn_probability: "0.2,0.3,0.4,0.4,0.3",
    price: 200,
    max_uses: 15,
    mana: 45,
    
    action: function(c: GunActionState) {
      c.extra_entities = c.extra_entities + "data/entities/misc/crumbling_earth_projectile.xml,"
      draw_actions( 1, true )
    },
  },
  
  {
    id: "X_RAY",
    name: "$action_x_ray",
    description: "$actiondesc_x_ray",
    sprite: "var(--sprite-action-x-ray)",
    sprite_unidentified: "data/ui_gfx/gun_actions/x_ray_unidentified.png",
    related_projectiles: ["data/entities/projectiles/deck/xray.xml"],
    type: "utility",
    spawn_level: "0,1,2,3,4,5,6",
    spawn_probability: "0.8,1,1,0.7,0.5,0.3,0.2",
    price: 230,
    max_uses: 10,
    mana: 100,
    custom_xml_file: "data/entities/misc/custom_cards/xray.xml",
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/xray.xml")
    },
  },
  
  {
    id: "UNSTABLE_GUNPOWDER",
    name: "$action_unstable_gunpowder",
    description: "$actiondesc_unstable_gunpowder",
    sprite: "var(--sprite-action-unstable-gunpowder)",
    sprite_unidentified: "data/ui_gfx/gun_actions/unstable_gunpowder_unidentified.png",
    type: "modifier",
    spawn_level: "2,3,4",
    spawn_probability: "0.3,0.4,0.4",
    price: 140,
    mana: 15,
    
    custom_xml_file: "data/entities/misc/custom_cards/unstable_gunpowder.xml",
    action: function(c: GunActionState) {
      c.material = "gunpowder_unstable"
      c.material_amount = c.material_amount + 10
      
      draw_actions( 1, true )
    },
  },
  {
    id: "ACID_TRAIL",
    name: "$action_acid_trail",
    description: "$actiondesc_acid_trail",
    sprite: "var(--sprite-action-acid-trail)",
    sprite_unidentified: "data/ui_gfx/gun_actions/acid_trail_unidentified.png",
    type: "modifier",
    spawn_level: "1,2,3,4,5",
    spawn_probability: "0.3,0.2,0.3,0.3,0.4",
    price: 160,
    mana: 15,
    
    custom_xml_file: "data/entities/misc/custom_cards/acid_trail.xml",
    action: function(c: GunActionState) {
      c.trail_material = c.trail_material + "acid,"
      c.trail_material_amount = c.trail_material_amount + 5
      draw_actions( 1, true )
    },
  },
  {
    id: "POISON_TRAIL",
    name: "$action_poison_trail",
    description: "$actiondesc_poison_trail",
    sprite: "var(--sprite-action-poison-trail)",
    sprite_unidentified: "data/ui_gfx/gun_actions/poison_trail_unidentified.png",
    type: "modifier",
    spawn_level: "2,3,4",
    spawn_probability: "0.3,0.3,0.3",
    price: 160,
    mana: 10,
    
    custom_xml_file: "data/entities/misc/custom_cards/poison_trail.xml",
    action: function(c: GunActionState) {
      c.game_effect_entities = c.game_effect_entities + "data/entities/misc/effect_apply_poison.xml,"
      c.trail_material = c.trail_material + "poison,"
      c.trail_material_amount = c.trail_material_amount + 9
      draw_actions( 1, true )
    },
  },
  {
    id: "OIL_TRAIL",
    name: "$action_oil_trail",
    description: "$actiondesc_oil_trail",
    sprite: "var(--sprite-action-oil-trail)",
    sprite_unidentified: "data/ui_gfx/gun_actions/oil_trail_unidentified.png",
    type: "modifier",
    spawn_level: "2,3,4",
    spawn_probability: "0.3,0.3,0.3",
    price: 160,
    mana: 10,
    
    custom_xml_file: "data/entities/misc/custom_cards/oil_trail.xml",
    action: function(c: GunActionState) {
      c.game_effect_entities = c.game_effect_entities + "data/entities/misc/effect_apply_oiled.xml,"
      c.trail_material = c.trail_material + "oil,"
      c.trail_material_amount = c.trail_material_amount + 20
      draw_actions( 1, true )
    },
  },
  {
    id: "WATER_TRAIL",
    name: "$action_water_trail",
    description: "$actiondesc_water_trail",
    sprite: "var(--sprite-action-water-trail)",
    sprite_unidentified: "data/ui_gfx/gun_actions/oil_trail_unidentified.png",
    type: "modifier",
    spawn_level: "1,2,3,4",
    spawn_probability: "0.3,0.3,0.3,0.3",
    price: 160,
    mana: 10,
    
    custom_xml_file: "data/entities/misc/custom_cards/water_trail.xml",
    action: function(c: GunActionState) {
      c.game_effect_entities = c.game_effect_entities + "data/entities/misc/effect_apply_wet.xml,"
      c.trail_material = c.trail_material + "water,"
      c.trail_material_amount = c.trail_material_amount + 20
      draw_actions( 1, true )
    },
  },
  
  
  
  
  
  
  {
    id: "GUNPOWDER_TRAIL",
    name: "$action_gunpowder_trail",
    description: "$actiondesc_gunpowder_trail",
    sprite: "var(--sprite-action-gunpowder-trail)",
    sprite_unidentified: "data/ui_gfx/gun_actions/oil_trail_unidentified.png",
    type: "modifier",
    spawn_level: "2,3,4",
    spawn_probability: "0.3,0.3,0.3",
    price: 160,
    mana: 10,
    
    custom_xml_file: "data/entities/misc/custom_cards/gunpowder_trail.xml",
    action: function(c: GunActionState) {
      c.trail_material = c.trail_material + "gunpowder,"
      c.trail_material_amount = c.trail_material_amount + 20
      draw_actions( 1, true )
    },
  },
  {
    id: "FIRE_TRAIL",
    name: "$action_fire_trail",
    description: "$actiondesc_fire_trail",
    sprite: "var(--sprite-action-fire-trail)",
    sprite_unidentified: "data/ui_gfx/gun_actions/fire_trail_unidentified.png",
    type: "modifier",
    spawn_level: "0,1,2,3,4",
    spawn_probability: "0.4,0.5,0.3,0.3,0.2",
    price: 130,
    mana: 10,
    
    custom_xml_file: "data/entities/misc/custom_cards/fire_trail.xml",
    action: function(c: GunActionState) {
      c.game_effect_entities = c.game_effect_entities + "data/entities/misc/effect_apply_on_fire.xml,"
      c.trail_material = c.trail_material + "fire,"
      c.trail_material_amount = c.trail_material_amount + 10
      draw_actions( 1, true )
    },
  },
  {
    id: "BURN_TRAIL",
    name: "$action_burn_trail",
    description: "$actiondesc_burn_trail",
    sprite: "var(--sprite-action-burn-trail)",
    sprite_unidentified: "data/ui_gfx/gun_actions/burn_trail_unidentified.png",
    related_extra_entities: [ "data/entities/misc/burn.xml" ],
    type: "modifier",
    spawn_level: "0,1,2",
    spawn_probability: "0.4,0.3,0.3",
    price: 100,
    mana: 5,
    
    custom_xml_file: "data/entities/misc/custom_cards/burn_trail.xml",
    action: function(c: GunActionState) {
      c.game_effect_entities = c.game_effect_entities + "data/entities/misc/effect_apply_on_fire.xml,"
      c.extra_entities = c.extra_entities + "data/entities/misc/burn.xml,"
      draw_actions( 1, true )
    },
  },
  {
    id: "TORCH",
    name: "$action_torch",
    description: "$actiondesc_torch",
    sprite: "var(--sprite-action-torch)",
    sprite_unidentified: "data/ui_gfx/gun_actions/torch_unidentified.png",
    type: "passive",
    spawn_level: "0,1,2",
    spawn_probability: "1,0.6,0.5",
    price: 100,
    mana: 0,
    
    custom_xml_file: "data/entities/misc/custom_cards/torch.xml",
    action: function(c: GunActionState) {
      draw_actions( 1, true )
    },
  },
  {
    id: "TORCH_ELECTRIC",
    name: "$action_torch_electric",
    description: "$actiondesc_torch_electric",
    sprite: "var(--sprite-action-torch-electric)",
    sprite_unidentified: "data/ui_gfx/gun_actions/torch_unidentified.png",
    type: "passive",
    spawn_level: "0,1,2",
    spawn_probability: "0.8,0.6,0.4",
    price: 150,
    mana: 0,
    
    custom_xml_file: "data/entities/misc/custom_cards/torch_electric.xml",
    action: function(c: GunActionState) {
      draw_actions( 1, true )
    },
  },
  {
    id: "ENERGY_SHIELD",
    name: "$action_energy_shield",
    description: "$actiondesc_energy_shield",
    sprite: "var(--sprite-action-energy-shield)",
    sprite_unidentified: "data/ui_gfx/gun_actions/energy_shield_unidentified.png",
    type: "passive",
    spawn_level: "1,2,3,4,5,6",
    spawn_probability: "0.05,0.4,0.8,0.4,0.4,0.6",
    price: 220,
    custom_xml_file: "data/entities/misc/custom_cards/energy_shield.xml",
    action: function(c: GunActionState) {
      
      draw_actions( 1, true )
    },
  },
  {
    id: "ENERGY_SHIELD_SECTOR",
    name: "$action_energy_shield_sector",
    description: "$actiondesc_energy_shield_sector",
    sprite: "var(--sprite-action-energy-shield-sector)",
    sprite_unidentified: "data/ui_gfx/gun_actions/energy_shield_sector_unidentified.png",
    type: "passive",
    spawn_level: "0,1,2,3,4,5",
    spawn_probability: "0.1,0.5,0.6,0.8,0.5,0.4",
    price: 160,
    custom_xml_file: "data/entities/misc/custom_cards/energy_shield_sector.xml",
    action: function(c: GunActionState) {
      
      draw_actions( 1, true )
    },
  },
  {
    id: "ENERGY_SHIELD_SHOT",
    name: "$action_energy_shield_shot",
    description: "$actiondesc_energy_shield_shot",
    sprite: "var(--sprite-action-energy-shield-shot)",
    sprite_unidentified: "data/ui_gfx/gun_actions/energy_shield_shot_unidentified.png",
    related_extra_entities: [ "data/entities/misc/energy_shield_shot.xml" ],
    type: "modifier",
    spawn_level: "2,3,4,5,6",
    spawn_probability: "0.3,0.3,0.5,0.4,0.3",
    price: 180,
    mana: 5,
    action: function(c: GunActionState) {
      c.speed_multiplier = c.speed_multiplier * 0.4
      c.extra_entities = c.extra_entities + "data/entities/misc/energy_shield_shot.xml,"
      
      if ( c.speed_multiplier >= 20 )  {
        c.speed_multiplier = Math.min( c.speed_multiplier, 20 )
      } else if ( c.speed_multiplier < 0 )  {
        c.speed_multiplier = 0
      }
      
      draw_actions( 1, true )
    },
  },
  {
    id: "TINY_GHOST",
    name: "$action_tiny_ghost",
    description: "$actiondesc_tiny_ghost",
    sprite: "var(--sprite-action-tiny-ghost)",
    sprite_unidentified: "data/ui_gfx/gun_actions/torch_unidentified.png",
    type: "passive",
    spawn_level: "1,2,3,4,5,6",
    spawn_probability: "0.1,0.5,1,0.8,0.7,0.5",
    price: 160,
    mana: 0,
    custom_xml_file: "data/entities/misc/custom_cards/tiny_ghost.xml",
    action: function(c: GunActionState) {
      draw_actions( 1, true )
    },
  },
  

  
  
  
    
  {
    id: "OCARINA_A",
    name: "$action_ocarina_a",
    description: "$actiondesc_ocarina_a",
    spawn_requires_flag: "card_unlocked_ocarina",
    sprite: "var(--sprite-action-ocarina-a)",
    related_projectiles: ["data/entities/projectiles/deck/ocarina/ocarina_a.xml"],
    type: "other",
    spawn_level: "10",
    spawn_probability: "0",
    price: 10,
    mana: 1,
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/ocarina/ocarina_a.xml")
      c.fire_rate_wait = c.fire_rate_wait + 15
    },
  },
  {
    id: "OCARINA_B",
    name: "$action_ocarina_b",
    description: "$actiondesc_ocarina_b",
    spawn_requires_flag: "card_unlocked_ocarina",
    sprite: "var(--sprite-action-ocarina-b)",
    related_projectiles: ["data/entities/projectiles/deck/ocarina/ocarina_b.xml"],
    type: "other",
    spawn_level: "10",
    spawn_probability: "0",
    price: 10,
    mana: 1,
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/ocarina/ocarina_b.xml")
      c.fire_rate_wait = c.fire_rate_wait + 15
    },
  },
  {
    id: "OCARINA_C",
    name: "$action_ocarina_c",
    description: "$actiondesc_ocarina_c",
    spawn_requires_flag: "card_unlocked_ocarina",
    sprite: "var(--sprite-action-ocarina-c)",
    related_projectiles: ["data/entities/projectiles/deck/ocarina/ocarina_c.xml"],
    type: "other",
    spawn_level: "10",
    spawn_probability: "0",
    price: 10,
    mana: 1,
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/ocarina/ocarina_c.xml")
      c.fire_rate_wait = c.fire_rate_wait + 15
    },
  },
  {
    id: "OCARINA_D",
    name: "$action_ocarina_d",
    description: "$actiondesc_ocarina_d",
    spawn_requires_flag: "card_unlocked_ocarina",
    sprite: "var(--sprite-action-ocarina-d)",
    related_projectiles: ["data/entities/projectiles/deck/ocarina/ocarina_d.xml"],
    type: "other",
    spawn_level: "10",
    spawn_probability: "0",
    price: 10,
    mana: 1,
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/ocarina/ocarina_d.xml")
      c.fire_rate_wait = c.fire_rate_wait + 15
    },
  },
  {
    id: "OCARINA_E",
    name: "$action_ocarina_e",
    description: "$actiondesc_ocarina_e",
    spawn_requires_flag: "card_unlocked_ocarina",
    sprite: "var(--sprite-action-ocarina-e)",
    related_projectiles: ["data/entities/projectiles/deck/ocarina/ocarina_e.xml"],
    type: "other",
    spawn_level: "10",
    spawn_probability: "0",
    price: 10,
    mana: 1,
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/ocarina/ocarina_e.xml")
      c.fire_rate_wait = c.fire_rate_wait + 15
    },
  },
  {
    id: "OCARINA_F",
    name: "$action_ocarina_f",
    description: "$actiondesc_ocarina_f",
    spawn_requires_flag: "card_unlocked_ocarina",
    sprite: "var(--sprite-action-ocarina-f)",
    related_projectiles: ["data/entities/projectiles/deck/ocarina/ocarina_f.xml"],
    type: "other",
    spawn_level: "10",
    spawn_probability: "0",
    price: 10,
    mana: 1,
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/ocarina/ocarina_f.xml")
      c.fire_rate_wait = c.fire_rate_wait + 15
    },
  },
  {
    id: "OCARINA_GSHARP",
    name: "$action_ocarina_gsharp",
    description: "$actiondesc_ocarina_gsharp",
    spawn_requires_flag: "card_unlocked_ocarina",
    sprite: "var(--sprite-action-ocarina-gsharp)",
    related_projectiles: ["data/entities/projectiles/deck/ocarina/ocarina_gsharp.xml"],
    type: "other",
    spawn_level: "10",
    spawn_probability: "0",
    price: 10,
    mana: 1,
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/ocarina/ocarina_gsharp.xml")
      c.fire_rate_wait = c.fire_rate_wait + 15
    },
  },
  {
    id: "OCARINA_A2",
    name: "$action_ocarina_a2",
    description: "$actiondesc_ocarina_a2",
    spawn_requires_flag: "card_unlocked_ocarina",
    sprite: "var(--sprite-action-ocarina-a2)",
    related_projectiles: ["data/entities/projectiles/deck/ocarina/ocarina_a2.xml"],
    type: "other",
    spawn_level: "10",
    spawn_probability: "0",
    price: 10,
    mana: 1,
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/ocarina/ocarina_a2.xml")
      c.fire_rate_wait = c.fire_rate_wait + 15
    },
  },
  {
    id: "KANTELE_A",
    name: "$action_kantele_a",
    description: "$actiondesc_kantele_a",
    spawn_requires_flag: "card_unlocked_kantele",
    sprite: "var(--sprite-action-kantele-a)",
    related_projectiles: ["data/entities/projectiles/deck/kantele/kantele_a.xml"],
    type: "other",
    spawn_level: "10",
    spawn_probability: "0",
    price: 10,
    mana: 1,
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/kantele/kantele_a.xml")
      c.fire_rate_wait = c.fire_rate_wait + 15
    },
  },
  {
    id: "KANTELE_D",
    name: "$action_kantele_d",
    description: "$actiondesc_kantele_d",
    spawn_requires_flag: "card_unlocked_kantele",
    sprite: "var(--sprite-action-kantele-d)",
    related_projectiles: ["data/entities/projectiles/deck/kantele/kantele_d.xml"],
    type: "other",
    spawn_level: "10",
    spawn_probability: "0",
    price: 10,
    mana: 1,
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/kantele/kantele_d.xml")
      c.fire_rate_wait = c.fire_rate_wait + 15
    },
  },
  {
    id: "KANTELE_DIS",
    name: "$action_kantele_dis",
    description: "$actiondesc_kantele_dis",
    spawn_requires_flag: "card_unlocked_kantele",
    sprite: "var(--sprite-action-kantele-dis)",
    related_projectiles: ["data/entities/projectiles/deck/kantele/kantele_dis.xml"],
    type: "other",
    spawn_level: "10",
    spawn_probability: "0",
    price: 10,
    mana: 1,
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/kantele/kantele_dis.xml")
      c.fire_rate_wait = c.fire_rate_wait + 15
    },
  },
  {
    id: "KANTELE_E",
    name: "$action_kantele_e",
    description: "$actiondesc_kantele_e",
    spawn_requires_flag: "card_unlocked_kantele",
    sprite: "var(--sprite-action-kantele-e)",
    related_projectiles: ["data/entities/projectiles/deck/kantele/kantele_e.xml"],
    type: "other",
    spawn_level: "10",
    spawn_probability: "0",
    price: 10,
    mana: 1,
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/kantele/kantele_e.xml")
      c.fire_rate_wait = c.fire_rate_wait + 15
    },
  },
  {
    id: "KANTELE_G",
    name: "$action_kantele_g",
    description: "$actiondesc_kantele_g",
    spawn_requires_flag: "card_unlocked_kantele",
    sprite: "var(--sprite-action-kantele-g)",
    related_projectiles: ["data/entities/projectiles/deck/kantele/kantele_g.xml"],
    type: "other",
    spawn_level: "10",
    spawn_probability: "0",
    price: 10,
    mana: 1,
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/kantele/kantele_g.xml")
      c.fire_rate_wait = c.fire_rate_wait + 15
    },
  },
  {
    id: "RANDOM_SPELL",
    name: "$action_random_spell",
    description: "$actiondesc_random_spell",
    sprite: "var(--sprite-action-random-spell)",
    sprite_unidentified: "data/ui_gfx/gun_actions/spread_reduce_unidentified.png",
    spawn_requires_flag: "card_unlocked_pyramid",
    type: "other",
    recursive: true,
    spawn_level: "3,4,5,6,10",
    spawn_probability: "0.2,0.3,0.2,0.1,0.5",
    price: 100,
    mana: 5,
    action: function(c: GunActionState, recursion_level: number = 0, iteration: number = 1) {
      SetRandomSeed(this.id,  GameGetFrameNum() + deck.length, GameGetFrameNum() + 263 )
      let rnd = Random(this.id,  1, actions.length )
      let data = actions[rnd - 1]
      
      let safety = 0
      let rec = check_recursion( data, recursion_level )
      let flag = data.spawn_requires_flag
      let usable = true
      if (( flag != null ) && ( HasFlagPersistent(this.id,  flag ) === false ))  {
        usable = false
      }
      
      while (( safety < 100 ) && ( ( rec === -1 ) || ( usable === false ) )) {
        rnd = Random(this.id,  1, actions.length )
        data = actions[rnd - 1]
        rec = check_recursion( data, recursion_level )
        flag = data.spawn_requires_flag
        usable = true
        if (( flag != null ) && ( HasFlagPersistent(this.id,  flag ) === false ))  {
          usable = false
        }
        
        safety = safety + 1
      }
      
      call_action("action", data, c,  rec )
    },
  },
  {
    id: "RANDOM_PROJECTILE",
    name: "$action_random_projectile",
    description: "$actiondesc_random_projectile",
    sprite: "var(--sprite-action-random-projectile)",
    sprite_unidentified: "data/ui_gfx/gun_actions/spread_reduce_unidentified.png",
    spawn_requires_flag: "card_unlocked_pyramid",
    type: "projectile",
    recursive: true,
    spawn_level: "2,4,5,6,10",
    spawn_probability: "0.2,0.4,0.1,0.2,0.5",
    price: 150,
    mana: 20,
    action: function(c: GunActionState, recursion_level: number = 0, iteration: number = 1) {
      SetRandomSeed(this.id,  GameGetFrameNum() + deck.length, GameGetFrameNum() + 203 )
      let rnd = Random(this.id,  1, actions.length )
      let data = actions[rnd - 1]
      
      let safety = 0
      let rec = check_recursion( data, recursion_level )
      let flag = data.spawn_requires_flag
      let usable = true
      if (( flag != null ) && ( HasFlagPersistent(this.id,  flag ) === false ))  {
        usable = false
      }
      
      while (( safety < 100 ) && ( ( data.type !== "projectile" ) || ( rec === -1 ) || ( usable === false ) )) {
        rnd = Random(this.id,  1, actions.length )
        data = actions[rnd - 1]
        rec = check_recursion( data, recursion_level )
        flag = data.spawn_requires_flag
        usable = true
        if (( flag != null ) && ( HasFlagPersistent(this.id,  flag ) === false ))  {
          usable = false
        }
        
        safety = safety + 1
      }
      
      call_action("action", data, c,  rec )
    },
  },
  {
    id: "RANDOM_MODIFIER",
    name: "$action_random_modifier",
    description: "$actiondesc_random_modifier",
    sprite: "var(--sprite-action-random-modifier)",
    sprite_unidentified: "data/ui_gfx/gun_actions/spread_reduce_unidentified.png",
    spawn_requires_flag: "card_unlocked_pyramid",
    type: "modifier",
    recursive: true,
    spawn_level: "4,5,6,10",
    spawn_probability: "0.3,0.2,0.1,0.5",
    price: 120,
    mana: 20,
    action: function(c: GunActionState, recursion_level: number = 0, iteration: number = 1) {
      SetRandomSeed(this.id,  GameGetFrameNum() + deck.length, GameGetFrameNum() + 133 )
      let rnd = Random(this.id,  1, actions.length )
      let data = actions[rnd - 1]
      
      let safety = 0
      let rec = check_recursion( data, recursion_level )
      let flag = data.spawn_requires_flag
      let usable = true
      if (( flag != null ) && ( HasFlagPersistent(this.id,  flag ) === false ))  {
        usable = false
      }
      
      while (( safety < 100 ) && ( ( data.type !== "modifier" ) || ( rec === -1 ) || ( usable === false ) )) {
        rnd = Random(this.id,  1, actions.length )
        data = actions[rnd - 1]
        rec = check_recursion( data, recursion_level )
        flag = data.spawn_requires_flag
        usable = true
        if (( flag != null ) && ( HasFlagPersistent(this.id,  flag ) === false ))  {
          usable = false
        }
        
        safety = safety + 1
      }
      
      call_action("action", data, c,  rec )
    },
  },
  {
    id: "RANDOM_STATIC_PROJECTILE",
    name: "$action_random_static_projectile",
    description: "$actiondesc_random_static_projectile",
    sprite: "var(--sprite-action-random-static-projectile)",
    sprite_unidentified: "data/ui_gfx/gun_actions/spread_reduce_unidentified.png",
    spawn_requires_flag: "card_unlocked_pyramid",
    type: "static",
    recursive: true,
    spawn_level: "3,5,6,10",
    spawn_probability: "0.2,0.1,0.2,0.5",
    price: 160,
    mana: 20,
    action: function(c: GunActionState, recursion_level: number = 0, iteration: number = 1) {
      SetRandomSeed(this.id,  GameGetFrameNum() + deck.length, GameGetFrameNum() + 253 )
      let rnd = Random(this.id,  1, actions.length )
      let data = actions[rnd - 1]
      
      let safety = 0
      let rec = check_recursion( data, recursion_level )
      let flag = data.spawn_requires_flag
      let usable = true
      if (( flag != null ) && ( HasFlagPersistent(this.id,  flag ) === false ))  {
        usable = false
      }
      
      while (( safety < 100 ) && ( ( data.type !== "static" ) || ( rec === -1 ) || ( usable === false ) )) {
        rnd = Random(this.id,  1, actions.length )
        data = actions[rnd - 1]
        rec = check_recursion( data, recursion_level )
        flag = data.spawn_requires_flag
        usable = true
        if (( flag != null ) && ( HasFlagPersistent(this.id,  flag ) === false ))  {
          usable = false
        }
        
        safety = safety + 1
      }
      
      call_action("action", data, c,  rec )
    },
  },
  {
    id: "DRAW_RANDOM",
    name: "$action_draw_random",
    description: "$actiondesc_draw_random",
    sprite: "var(--sprite-action-draw-random)",
    sprite_unidentified: "data/ui_gfx/gun_actions/spread_reduce_unidentified.png",
    spawn_requires_flag: "card_unlocked_pyramid",
    type: "other",
    recursive: true,
    spawn_level: "2,3,4,5,6,10",
    spawn_probability: "0.3,0.2,0.2,0.1,0.1,1",
    price: 150,
    mana: 20,
    action: function(c: GunActionState, recursion_level: number = 0, iteration: number = 1) {
      SetRandomSeed(this.id,  GameGetFrameNum() + deck.length, GameGetFrameNum() - 325 + discarded.length )
      let datasize = deck.length + discarded.length
      let rnd = Random(this.id,  1, datasize )
      
      let data: Spell | null = null
        
      if ( rnd <= deck.length )  {
        data = deck[rnd - 1]
      } else {
        data = discarded[rnd - deck.length - 1]
      }
      
      let checks = 0
      let rec = check_recursion( data, recursion_level )
      
      while (( data != null ) && ( ( rec === -1 ) || ( ( data.uses_remaining != null ) && ( data.uses_remaining === 0 ) ) ) && ( checks < datasize )) {
        rnd = ( rnd % datasize ) + 1
        checks = checks + 1
        
        if ( rnd <= deck.length )  {
          data = deck[rnd - 1]
        } else {
          data = discarded[rnd - deck.length - 1]
        }
        
        rec = check_recursion( data, recursion_level )
      }
      
      if (( data != null ) && ( rec > -1 ) && ( ( data.uses_remaining == null ) || ( data.uses_remaining !== 0 ) ))  {
        call_action("action", data, c,  rec )
        
        if (( data.uses_remaining != null ) && ( data.uses_remaining > 0 ))  {
          data.uses_remaining = data.uses_remaining - 1
          
          let reduce_uses = ActionUsesRemainingChanged(this.id,  data.inventoryitem_id, data.uses_remaining )
          if (!reduce_uses) {
            data.uses_remaining = data.uses_remaining + 1 
          }
        }
      }
    },
  },
  {
    id: "DRAW_RANDOM_X3",
    name: "$action_draw_random_x3",
    description: "$actiondesc_draw_random_x3",
    sprite: "var(--sprite-action-draw-random-x3)",
    sprite_unidentified: "data/ui_gfx/gun_actions/spread_reduce_unidentified.png",
    spawn_requires_flag: "card_unlocked_pyramid",
    type: "other",
    recursive: true,
    spawn_level: "3,4,5,6,10",
    spawn_probability: "0.1,0.3,0.1,0.1,1",
    price: 250,
    mana: 50,
    action: function(c: GunActionState, recursion_level: number = 0, iteration: number = 1) {
      SetRandomSeed(this.id,  GameGetFrameNum() + deck.length, GameGetFrameNum() - 325 + discarded.length )
      let datasize = deck.length + discarded.length
      let rnd = Random(this.id,  1, datasize )
      
      let data: Spell | null = null
        
      if ( rnd <= deck.length )  {
        data = deck[rnd - 1]
      } else {
        data = discarded[rnd - deck.length - 1]
      }
      
      let checks = 0
      let rec = check_recursion( data, recursion_level )
      
      while (( data != null ) && ( ( rec === -1 ) || ( ( data.uses_remaining != null ) && ( data.uses_remaining === 0 ) ) ) && ( checks < datasize )) {
        rnd = ( rnd % datasize ) + 1
        checks = checks + 1
        
        if ( rnd <= deck.length )  {
          data = deck[rnd - 1]
        } else {
          data = discarded[rnd - deck.length - 1]
        }
        
        rec = check_recursion( data, recursion_level )
      }
      
      if (( data != null ) && ( rec > -1 ) && ( ( data.uses_remaining == null ) || ( data.uses_remaining !== 0 ) ))  {
        for (const i of luaFor(1, 3)) {
          call_action("action", data, c,  rec )
        }
        
        if (( data.uses_remaining != null ) && ( data.uses_remaining > 0 ))  {
          data.uses_remaining = data.uses_remaining - 1
          
          let reduce_uses = ActionUsesRemainingChanged(this.id,  data.inventoryitem_id, data.uses_remaining )
          if (!reduce_uses) {
            data.uses_remaining = data.uses_remaining + 1 
          }
        }
      }
    },
  },
  {
    id: "DRAW_3_RANDOM",
    name: "$action_draw_3_random",
    description: "$actiondesc_draw_3_random",
    sprite: "var(--sprite-action-draw-3-random)",
    sprite_unidentified: "data/ui_gfx/gun_actions/spread_reduce_unidentified.png",
    spawn_requires_flag: "card_unlocked_pyramid",
    type: "other",
    recursive: true,
    spawn_level: "2,3,5,6,10",
    spawn_probability: "0.1,0.2,0.1,0.1,1",
    price: 200,
    mana: 40,
    action: function(c: GunActionState, recursion_level: number = 0, iteration: number = 1) {
      SetRandomSeed(this.id,  GameGetFrameNum() + deck.length, GameGetFrameNum() - 325 + discarded.length )
      let datasize = deck.length + discarded.length
      
      for (const i of luaFor(1, 3)) {
        let rnd = Random(this.id,  1, datasize )
        
        let data: Spell | null = null
        
        if ( rnd <= deck.length )  {
          data = deck[rnd - 1]
        } else {
          data = discarded[rnd - deck.length - 1]
        }
        
        let checks = 0
        let rec = check_recursion( data, recursion_level )
        
        while (( data != null ) && ( ( rec === -1 ) || ( ( data.uses_remaining != null ) && ( data.uses_remaining === 0 ) ) ) && ( checks < datasize )) {
          rnd = ( rnd % datasize ) + 1
          checks = checks + 1
          
          if ( rnd <= deck.length )  {
            data = deck[rnd - 1]
          } else {
            data = discarded[rnd - deck.length - 1]
          }
          
          rec = check_recursion( data, recursion_level )
        }
        
        if (( data != null ) && ( rec > -1 ) && ( ( data.uses_remaining == null ) || ( data.uses_remaining !== 0 ) ))  {
          call_action("action", data, c,  rec )
          
          if (( data.uses_remaining != null ) && ( data.uses_remaining > 0 ))  {
            data.uses_remaining = data.uses_remaining - 1
            
            let reduce_uses = ActionUsesRemainingChanged(this.id,  data.inventoryitem_id, data.uses_remaining )
            if (!reduce_uses) {
              data.uses_remaining = data.uses_remaining + 1 
            }
          }
        }
      }
    },
  },
  {
    id: "ALL_NUKES",
    name: "$action_all_nukes",
    description: "$actiondesc_all_nukes",
    sprite: "var(--sprite-action-all-nukes)",
    sprite_unidentified: "data/ui_gfx/gun_actions/rocket_unidentified.png",
    spawn_requires_flag: "card_unlocked_alchemy",
    never_unlimited: true,
    type: "utility",
    spawn_level: "6,10",
    spawn_probability: "0.1,1",
    price: 600,
    mana: 600,
    ai_never_uses: true,
    max_uses: 2,
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/all_nukes.xml")
      c.fire_rate_wait = c.fire_rate_wait + 100
      setCurrentReloadTime(current_reload_time + 100)
    },
  },
  {
    id: "ALL_DISCS",
    name: "$action_all_discs",
    description: "$actiondesc_all_discs",
    sprite: "var(--sprite-action-all-discs)",
    sprite_unidentified: "data/ui_gfx/gun_actions/rocket_unidentified.png",
    spawn_requires_flag: "card_unlocked_alchemy",
    type: "utility",
    spawn_level: "0,6,10",
    spawn_probability: "0.1,0.05,1",
    price: 400,
    mana: 100,
    
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/all_discs.xml")
      c.fire_rate_wait = c.fire_rate_wait + 50
      setCurrentReloadTime(current_reload_time + 50)
    },
  },
  {
    id: "ALL_ROCKETS",
    name: "$action_all_rockets",
    description: "$actiondesc_all_rockets",
    sprite: "var(--sprite-action-all-rockets)",
    sprite_unidentified: "data/ui_gfx/gun_actions/rocket_unidentified.png",
    spawn_requires_flag: "card_unlocked_alchemy",
    never_unlimited: true,
    type: "utility",
    spawn_level: "1,6,10",
    spawn_probability: "0.1,0.05,1",
    price: 400,
    mana: 100,
    max_uses: 10,
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/all_rockets.xml")
      c.fire_rate_wait = c.fire_rate_wait + 50
      setCurrentReloadTime(current_reload_time + 50)
    },
  },
  {
    id: "ALL_DEATHCROSSES",
    name: "$action_all_deathcrosses",
    description: "$actiondesc_all_deathcrosses",
    sprite: "var(--sprite-action-all-deathcrosses)",
    sprite_unidentified: "data/ui_gfx/gun_actions/rocket_unidentified.png",
    spawn_requires_flag: "card_unlocked_alchemy",
    never_unlimited: true,
    type: "utility",
    spawn_level: "2,6,10",
    spawn_probability: "0.1,0.05,1",
    price: 350,
    mana: 80,
    max_uses: 15,
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/all_deathcrosses.xml")
      c.fire_rate_wait = c.fire_rate_wait + 40
      setCurrentReloadTime(current_reload_time + 40)
    },
  },
  {
    id: "ALL_BLACKHOLES",
    name: "$action_all_blackholes",
    description: "$actiondesc_all_blackholes",
    sprite: "var(--sprite-action-all-blackholes)",
    sprite_unidentified: "data/ui_gfx/gun_actions/rocket_unidentified.png",
    spawn_requires_flag: "card_unlocked_alchemy",
    never_unlimited: true,
    type: "utility",
    spawn_level: "3,6,10",
    spawn_probability: "0.1,0.05,1",
    price: 500,
    mana: 200,
    max_uses: 10,
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/all_blackholes.xml")
      c.fire_rate_wait = c.fire_rate_wait + 100
      setCurrentReloadTime(current_reload_time + 100)
    },
  },
  {
    id: "ALL_ACID",
    name: "$action_all_acid",
    description: "$actiondesc_all_acid",
    sprite: "var(--sprite-action-all-acid)",
    sprite_unidentified: "data/ui_gfx/gun_actions/rocket_unidentified.png",
    spawn_requires_flag: "card_unlocked_alchemy",
    type: "utility",
    spawn_level: "4,6,10",
    spawn_probability: "0.1,0.05,1",
    price: 600,
    mana: 200,
    
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/all_acid.xml")
      c.fire_rate_wait = c.fire_rate_wait + 100
      setCurrentReloadTime(current_reload_time + 100)
    },
  },
  {
    id: "ALL_SPELLS",
    name: "$action_all_spells",
    description: "$actiondesc_all_spells",
    sprite: "var(--sprite-action-all-spells)",
    sprite_unidentified: "data/ui_gfx/gun_actions/spread_reduce_unidentified.png",
    spawn_requires_flag: "card_unlocked_everything",
    spawn_manual_unlock: true,
    never_unlimited: true,
    type: "other",
    recursive: true,
    ai_never_uses: true,
    spawn_level: "10",
    spawn_probability: "1",
    price: 1000,
    mana: 600,
    max_uses: 1,
    action: function(c: GunActionState) {
      let players = EntityGetWithTag(this.id,  "player_unit" )
      for (const [i, v] of ipairs(players, 'players')) {
        let [x, y] = EntityGetTransform(this.id,  v )
        let eid = EntityLoad(this.id, "data/entities/projectiles/deck/all_spells_loader.xml", x, y)
      }
      c.fire_rate_wait = c.fire_rate_wait + 100
      setCurrentReloadTime(current_reload_time + 100)
    },
  },
  {
    id: "SUMMON_PORTAL",
    name: "$action_summon_portal",
    description: "$actiondesc_summon_portal",
    sprite: "var(--sprite-action-summon-portal)",
    sprite_unidentified: "data/ui_gfx/gun_actions/spread_reduce_unidentified.png",
    type: "other",
    spawn_level: "10",
    spawn_probability: "0",
    price: 100,
    mana: 50,
    max_uses: 7,
    custom_xml_file: "data/entities/misc/custom_cards/summon_portal.xml",
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/summon_portal.xml")
      c.fire_rate_wait = c.fire_rate_wait + 80
    },
  },
  {
    id: "ADD_TRIGGER",
    name: "$action_add_trigger",
    description: "$actiondesc_add_trigger",
    sprite: "var(--sprite-action-add-trigger)",
    sprite_unidentified: "data/ui_gfx/gun_actions/damage_unidentified.png",
    spawn_requires_flag: "card_unlocked_mestari",
    type: "other",
    spawn_level: "3,4,5,10",
    spawn_probability: "0.3,0.6,0.6,1",
    price: 100,
    mana: 10,
    
    action: function(c: GunActionState) {
      let data: Spell | null = null
      
      let how_many = 1
      
      if ( deck.length > 0 )  {
        data = deck[1 - 1]
      } else {
        data = null
      }
      
      if ( data != null )  {
        while (( deck.length >= how_many ) && ( ( data.type === "modifier" ) || ( data.type === "passive" ) || ( data.type === "other" ) || ( data.type === "multicast" ) )) {
          if (( ( data.uses_remaining == null ) || ( data.uses_remaining !== 0 ) ) && ( data.id !== "ADD_TRIGGER" ) && ( data.id !== "ADD_TIMER" ) && ( data.id !== "ADD_DEATH_TRIGGER" ))  {
            if ( data.type === "modifier" )  {
              setDontDrawActions(true)
              call_action("action", data, c, )
              setDontDrawActions(false)
            }
          }
          how_many = how_many + 1
          data = deck[how_many - 1]
        }
        
        if (( data != null ) && ( data.related_projectiles != null ) && ( ( data.uses_remaining == null ) || ( data.uses_remaining !== 0 ) ))  {
          let target = data.related_projectiles[0]
          let count = data.related_projectiles[1] || 1
          
          for (const i of luaFor(1, how_many)) {
            data = deck[1 - 1]
            discarded.push(data)
            deck.splice(1 - 1, 1)
          }
          
          let valid = false
          
          for (const i of luaFor(1, deck.length)) {
            let check = deck[i - 1]
            
            if (( check != null ) && ( ( check.type === "projectile" ) || ( check.type === "static" ) || ( check.type === "material" ) || ( check.type === "utility" ) ))  {
              valid = true
              break
            }
          }
          
          if (( data.uses_remaining != null ) && ( data.uses_remaining > 0 ))  {
            data.uses_remaining = data.uses_remaining - 1
            
            let reduce_uses = ActionUsesRemainingChanged(this.id,  data.inventoryitem_id, data.uses_remaining )
            if (!reduce_uses) {
              data.uses_remaining = data.uses_remaining + 1 
            }
          }
          
          if (valid ) {
            for (const i of luaFor(1, count)) {
              add_projectile_trigger_hit_world(target, 1)
            }
          } else {
            setDontDrawActions(true)
            call_action("action", data, c, )
            setDontDrawActions(false)
          }
        }
      }
    },
  },
  {
    id: "ADD_TIMER",
    name: "$action_add_timer",
    description: "$actiondesc_add_timer",
    sprite: "var(--sprite-action-add-timer)",
    sprite_unidentified: "data/ui_gfx/gun_actions/damage_unidentified.png",
    spawn_requires_flag: "card_unlocked_mestari",
    type: "other",
    spawn_level: "3,4,5,10",
    spawn_probability: "0.3,0.6,0.6,1",
    price: 150,
    mana: 20,
    
    action: function(c: GunActionState) {
      let data: Spell | null = null
      
      let how_many = 1
      
      if ( deck.length > 0 )  {
        data = deck[1 - 1]
      } else {
        data = null
      }
      
      if ( data != null )  {
        while (( deck.length >= how_many ) && ( ( data.type === "modifier" ) || ( data.type === "passive" ) || ( data.type === "other" ) || ( data.type === "multicast" ) )) {
          if (( ( data.uses_remaining == null ) || ( data.uses_remaining !== 0 ) ) && ( data.id !== "ADD_TRIGGER" ) && ( data.id !== "ADD_TIMER" ) && ( data.id !== "ADD_DEATH_TRIGGER" ))  {
            if ( data.type === "modifier" )  {
              setDontDrawActions(true)
              call_action("action", data, c, )
              setDontDrawActions(false)
            }
          }
          how_many = how_many + 1
          data = deck[how_many - 1]
        }
        
        if (( data != null ) && ( data.related_projectiles != null ) && ( ( data.uses_remaining == null ) || ( data.uses_remaining !== 0 ) ))  {
          let target = data.related_projectiles[0]
          let count = data.related_projectiles[1] || 1
          
          for (const i of luaFor(1, how_many)) {
            data = deck[1 - 1]
            discarded.push(data)
            deck.splice(1 - 1, 1)
          }
          
          let valid = false
          
          for (const i of luaFor(1, deck.length)) {
            let check = deck[i - 1]
            
            if (( check != null ) && ( ( check.type === "projectile" ) || ( check.type === "static" ) || ( check.type === "material" ) || ( check.type === "utility" ) ))  {
              valid = true
              break
            }
          }
          
          if (( data.uses_remaining != null ) && ( data.uses_remaining > 0 ))  {
            data.uses_remaining = data.uses_remaining - 1
            
            let reduce_uses = ActionUsesRemainingChanged(this.id,  data.inventoryitem_id, data.uses_remaining )
            if (!reduce_uses) {
              data.uses_remaining = data.uses_remaining + 1 
            }
          }
          
          if (valid ) {
            for (const i of luaFor(1, count)) {
              add_projectile_trigger_timer(target, 20, 1)
            }
          } else {
            setDontDrawActions(true)
            call_action("action", data, c, )
            setDontDrawActions(false)
          }
        }
      }
    },
  },
  {
    id: "ADD_DEATH_TRIGGER",
    name: "$action_add_death_trigger",
    description: "$actiondesc_add_death_trigger",
    sprite: "var(--sprite-action-add-death-trigger)",
    sprite_unidentified: "data/ui_gfx/gun_actions/damage_unidentified.png",
    spawn_requires_flag: "card_unlocked_mestari",
    type: "other",
    spawn_level: "3,4,5,10",
    spawn_probability: "0.3,0.6,0.6,1",
    price: 150,
    mana: 20,
    
    action: function(c: GunActionState) {
      let data: Spell | null = null
      
      let how_many = 1
      
      if ( deck.length > 0 )  {
        data = deck[1 - 1]
      } else {
        data = null
      }
      
      if ( data != null )  {
        while (( deck.length >= how_many ) && ( ( data.type === "modifier" ) || ( data.type === "passive" ) || ( data.type === "other" ) || ( data.type === "multicast" ) )) {
          if (( ( data.uses_remaining == null ) || ( data.uses_remaining !== 0 ) ) && ( data.id !== "ADD_TRIGGER" ) && ( data.id !== "ADD_TIMER" ) && ( data.id !== "ADD_DEATH_TRIGGER" ))  {
            if ( data.type === "modifier" )  {
              setDontDrawActions(true)
              call_action("action", data, c, )
              setDontDrawActions(false)
            }
          }
          how_many = how_many + 1
          data = deck[how_many - 1]
        }
        
        if (( data != null ) && ( data.related_projectiles != null ) && ( ( data.uses_remaining == null ) || ( data.uses_remaining !== 0 ) ))  {
          let target = data.related_projectiles[0]
          let count = data.related_projectiles[1] || 1
          
          for (const i of luaFor(1, how_many)) {
            data = deck[1 - 1]
            discarded.push(data)
            deck.splice(1 - 1, 1)
          }
          
          let valid = false
          
          for (const i of luaFor(1, deck.length)) {
            let check = deck[i - 1]
            
            if (( check != null ) && ( ( check.type === "projectile" ) || ( check.type === "static" ) || ( check.type === "material" ) || ( check.type === "utility" ) ))  {
              valid = true
              break
            }
          }
          
          if (( data.uses_remaining != null ) && ( data.uses_remaining > 0 ))  {
            data.uses_remaining = data.uses_remaining - 1
            
            let reduce_uses = ActionUsesRemainingChanged(this.id,  data.inventoryitem_id, data.uses_remaining )
            if (!reduce_uses) {
              data.uses_remaining = data.uses_remaining + 1 
            }
          }
          
          if (valid ) {
            for (const i of luaFor(1, count)) {
              add_projectile_trigger_death(target, 1)
            }
          } else {
            setDontDrawActions(true)
            call_action("action", data, c, )
            setDontDrawActions(false)
          }
        }
      }
    },
  },
  {
    id: "LARPA_CHAOS",
    name: "$action_larpa_chaos",
    description: "$actiondesc_larpa_chaos",
    sprite: "var(--sprite-action-larpa-chaos)",
    sprite_unidentified: "data/ui_gfx/gun_actions/electric_charge_unidentified.png",
    related_extra_entities: [ "data/entities/misc/larpa_chaos.xml" ],
    type: "modifier",
    spawn_level: "2,3,4,5,10",
    spawn_probability: "0.1,0.2,0.3,0.4,0.2",
    price: 260,
    mana: 100,
    
    action: function(c: GunActionState) {
      c.fire_rate_wait = c.fire_rate_wait + 15
      c.extra_entities = c.extra_entities + "data/entities/misc/larpa_chaos.xml,"
      draw_actions( 1, true )
    },
  },
  {
    id: "LARPA_DOWNWARDS",
    name: "$action_larpa_downwards",
    description: "$actiondesc_larpa_downwards",
    sprite: "var(--sprite-action-larpa-downwards)",
    sprite_unidentified: "data/ui_gfx/gun_actions/electric_charge_unidentified.png",
    related_extra_entities: [ "data/entities/misc/larpa_downwards.xml" ],
    type: "modifier",
    spawn_level: "2,3,4,5,10",
    spawn_probability: "0.1,0.3,0.4,0.2,0.2",
    price: 290,
    mana: 120,
    
    action: function(c: GunActionState) {
      c.fire_rate_wait = c.fire_rate_wait + 15
      c.extra_entities = c.extra_entities + "data/entities/misc/larpa_downwards.xml,"
      draw_actions( 1, true )
    },
  },
  {
    id: "LARPA_UPWARDS",
    name: "$action_larpa_upwards",
    description: "$actiondesc_larpa_upwards",
    sprite: "var(--sprite-action-larpa-upwards)",
    sprite_unidentified: "data/ui_gfx/gun_actions/electric_charge_unidentified.png",
    related_extra_entities: [ "data/entities/misc/larpa_upwards.xml" ],
    type: "modifier",
    spawn_level: "2,3,4,5,10",
    spawn_probability: "0.1,0.1,0.2,0.4,0.2",
    price: 290,
    mana: 120,
    
    action: function(c: GunActionState) {
      c.fire_rate_wait = c.fire_rate_wait + 15
      c.extra_entities = c.extra_entities + "data/entities/misc/larpa_upwards.xml,"
      draw_actions( 1, true )
    },
  },
  {
    id: "LARPA_CHAOS_2",
    name: "$action_larpa_chaos_2",
    description: "$actiondesc_larpa_chaos_2",
    sprite: "var(--sprite-action-larpa-chaos-2)",
    sprite_unidentified: "data/ui_gfx/gun_actions/electric_charge_unidentified.png",
    spawn_requires_flag: "card_unlocked_alchemy",
    related_extra_entities: [ "data/entities/misc/larpa_chaos_2.xml" ],
    type: "modifier",
    spawn_level: "3,5,10",
    spawn_probability: "0.1,0.4,0.1",
    price: 300,
    mana: 150,
    
    action: function(c: GunActionState) {
      c.fire_rate_wait = c.fire_rate_wait + 20
      c.extra_entities = c.extra_entities + "data/entities/misc/larpa_chaos_2.xml,"
      draw_actions( 1, true )
    },
  },
  {
    id: "LARPA_DEATH",
    name: "$action_larpa_death",
    description: "$actiondesc_larpa_death",
    sprite: "var(--sprite-action-larpa-death)",
    sprite_unidentified: "data/ui_gfx/gun_actions/electric_charge_unidentified.png",
    related_extra_entities: [ "data/entities/misc/larpa_death.xml" ],
    type: "modifier",
    spawn_level: "2,3,4,5,10",
    spawn_probability: "0.1,0.1,0.3,0.4,0.2",
    price: 150,
    mana: 90,
    max_uses: 30,
    action: function(c: GunActionState) {
      c.fire_rate_wait = c.fire_rate_wait + 15
      c.extra_entities = c.extra_entities + "data/entities/misc/larpa_death.xml,"
      draw_actions( 1, true )
    },
  },
  {
    id: "ALPHA",
    name: "$action_alpha",
    description: "$actiondesc_alpha",
    sprite: "var(--sprite-action-alpha)",
    sprite_unidentified: "data/ui_gfx/gun_actions/spread_reduce_unidentified.png",
    spawn_requires_flag: "card_unlocked_duplicate",
    type: "other",
    recursive: true,
    spawn_level: "5,6,10",
    spawn_probability: "0.1,0.2,1",
    price: 200,
    mana: 40,
    action: function(c: GunActionState, recursion_level: number = 0, iteration: number = 1) {
      c.fire_rate_wait = c.fire_rate_wait + 15
      
      let data: Spell | null = null
      
      if ( discarded.length > 0 )  {
        data = discarded[1 - 1]
      } else if ( hand.length > 0 )  {
        data = hand[1 - 1]
      } else if ( deck.length > 0 )  {
        data = deck[1 - 1]
      } else {
        data = null
      }
      
      let rec = check_recursion( data, recursion_level )
      
      if (( data != null ) && ( rec > -1 ))  {
        call_action("action", data, c,  rec )
      }
      
      
    },
  },
  {
    id: "GAMMA",
    name: "$action_gamma",
    description: "$actiondesc_gamma",
    sprite: "var(--sprite-action-gamma)",
    sprite_unidentified: "data/ui_gfx/gun_actions/spread_reduce_unidentified.png",
    spawn_requires_flag: "card_unlocked_duplicate",
    type: "other",
    recursive: true,
    spawn_level: "5,6,10",
    spawn_probability: "0.1,0.2,1",
    price: 200,
    mana: 40,
    action: function(c: GunActionState, recursion_level: number = 0, iteration: number = 1) {
      c.fire_rate_wait = c.fire_rate_wait + 15
      
      let data: Spell | null = null
      
      if ( deck.length > 0 )  {
        data = deck[deck.length - 1]
      } else if ( hand.length > 0 )  {
        data = hand[hand.length - 1]
      } else {
        data = null
      }
      
      let rec = check_recursion( data, recursion_level )
      
      if (( data != null ) && ( rec > -1 ))  {
        call_action("action", data, c,  rec )
      }
      
      
    },
  },
  {
    id: "TAU",
    name: "$action_tau",
    description: "$actiondesc_tau",
    sprite: "var(--sprite-action-tau)",
    sprite_unidentified: "data/ui_gfx/gun_actions/spread_reduce_unidentified.png",
    spawn_requires_flag: "card_unlocked_duplicate",
    type: "other",
    recursive: true,
    spawn_level: "5,6,10",
    spawn_probability: "0.1,0.2,1",
    price: 200,
    mana: 90,
    action: function(c: GunActionState, recursion_level: number = 0, iteration: number = 1) {
      c.fire_rate_wait = c.fire_rate_wait + 35
      
      let data1: any = []
      let data2: any = []
      
      let s1 = ""
      let s2 = ""
      
      if ( deck.length > 0 )  {
        s1 = "deck"
        data1 = deck[1 - 1]
      } else {
        data1 = null
      }
      
      if ( deck.length > 0 )  {
        s2 = "deck 2"
        data2 = deck[2 - 1]
      } else {
        data2 = null
      }
      
      let rec1 = check_recursion( data1, recursion_level )
      let rec2 = check_recursion( data2, recursion_level )
      
      if (( data1 != null ) && ( rec1 > -1 ))  {
        
        call_action("action", data1, c,  rec1 )
      }
      
      if (( data2 != null ) && ( rec2 > -1 ))  {
        
        call_action("action", data2, c,  rec2 )
      }
      
      
    },
  },
  {
    id: "OMEGA",
    name: "$action_omega",
    description: "$actiondesc_omega",
    sprite: "var(--sprite-action-omega)",
    sprite_unidentified: "data/ui_gfx/gun_actions/spread_reduce_unidentified.png",
    spawn_requires_flag: "card_unlocked_duplicate",
    type: "other",
    recursive: true,
    spawn_level: "5,6,10",
    spawn_probability: "0.1,0.1,1",
    price: 600,
    mana: 320,
    action: function(c: GunActionState, recursion_level: number = 0, iteration: number = 1) {
      c.fire_rate_wait = c.fire_rate_wait + 50
      
      if ( discarded != null )  {
        for (const [i, data] of ipairs(discarded, 'discarded')) {
          let rec = check_recursion( data, recursion_level )
          if (( data != null ) && ( rec > -1 ) && ( data.id !== "RESET" ))  {
            setDontDrawActions(true)
            call_action("action", data, c,  rec )
            setDontDrawActions(false)
          }
        }
      }
      
      if ( hand != null )  {
        for (const [i, data] of ipairs(hand, 'hand')) {
          let rec = check_recursion( data, recursion_level )
          if (( data != null ) && ( ( data.recursive == null ) || ( data.recursive === false ) ))  {
            setDontDrawActions(true)
            call_action("action", data, c,  rec )
            setDontDrawActions(false)
          }
        }
      }
      
      if ( deck != null )  {
        for (const [i, data] of ipairs(deck, 'deck')) {
          let rec = check_recursion( data, recursion_level )
          if (( data != null ) && ( rec > -1 ) && ( data.id !== "RESET" ))  {
            setDontDrawActions(true)
            call_action("action", data, c,  rec )
            setDontDrawActions(false)
          }
        }
      }
    },
  },
  {
    id: "MU",
    name: "$action_mu",
    description: "$actiondesc_mu",
    sprite: "var(--sprite-action-mu)",
    sprite_unidentified: "data/ui_gfx/gun_actions/spread_reduce_unidentified.png",
    spawn_requires_flag: "card_unlocked_duplicate",
    type: "other",
    recursive: true,
    spawn_level: "5,6,10",
    spawn_probability: "0.1,0.2,1",
    price: 500,
    mana: 120,
    action: function(c: GunActionState, recursion_level: number = 0, iteration: number = 1) {
      c.fire_rate_wait = c.fire_rate_wait + 50
      
      let firerate = c.fire_rate_wait
      let reload = current_reload_time
      let mana_ = mana
      
      if ( discarded != null )  {
        for (const [i, data] of ipairs(discarded, 'discarded')) {
          let rec = check_recursion( data, recursion_level )
          if (( data != null ) && ( data.type === "modifier" ) && ( rec > -1 ))  {
            setDontDrawActions(true)
            call_action("action", data, c,  rec )
            setDontDrawActions(false)
          }
        }
      }
      
      if ( hand != null )  {
        for (const [i, data] of ipairs(hand, 'hand')) {
          let rec = check_recursion( data, recursion_level )
          if (( data != null ) && ( data.type === "modifier" ) && ( rec > -1 ))  {
            setDontDrawActions(true)
            call_action("action", data, c,  rec )
            setDontDrawActions(false)
          }
        }
      }
      
      if ( deck != null )  {
        for (const [i, data] of ipairs(deck, 'deck')) {
          let rec = check_recursion( data, recursion_level )
          if (( data != null ) && ( data.type === "modifier" ) && ( rec > -1 ))  {
            setDontDrawActions(true)
            call_action("action", data, c,  rec )
            setDontDrawActions(false)
          }
        }
      }
      
      c.fire_rate_wait = firerate
      setCurrentReloadTime(reload)
      setMana(mana_)
      
      draw_actions( 1, true )
    },
  },
  {
    id: "PHI",
    name: "$action_phi",
    description: "$actiondesc_phi",
    sprite: "var(--sprite-action-phi)",
    sprite_unidentified: "data/ui_gfx/gun_actions/spread_reduce_unidentified.png",
    spawn_requires_flag: "card_unlocked_duplicate",
    type: "other",
    recursive: true,
    spawn_level: "5,6,10",
    spawn_probability: "0.1,0.2,1",
    price: 500,
    mana: 120,
    action: function(c: GunActionState, recursion_level: number = 0, iteration: number = 1) {
      c.fire_rate_wait = c.fire_rate_wait + 50
      
      let firerate = c.fire_rate_wait
      let reload = current_reload_time
      let mana_ = mana
      
      if ( discarded != null )  {
        for (const [i, data] of ipairs(discarded, 'discarded')) {
          let rec = check_recursion( data, recursion_level )
          if (( data != null ) && ( data.type === "projectile" ) && ( rec > -1 ))  {
            setDontDrawActions(true)
            call_action("action", data, c,  rec )
            setDontDrawActions(false)
          }
        }
      }
      
      if ( hand != null )  {
        for (const [i, data] of ipairs(hand, 'hand')) {
          let rec = check_recursion( data, recursion_level )
          if (( data != null ) && ( data.type === "projectile" ) && ( rec > -1 ))  {
            setDontDrawActions(true)
            call_action("action", data, c,  rec )
            setDontDrawActions(false)
          }
        }
      }
      
      if ( deck != null )  {
        for (const [i, data] of ipairs(deck, 'deck')) {
          let rec = check_recursion( data, recursion_level )
          if (( data != null ) && ( data.type === "projectile" ) && ( rec > -1 ))  {
            setDontDrawActions(true)
            call_action("action", data, c,  rec )
            setDontDrawActions(false)
          }
        }
      }
      
      c.fire_rate_wait = firerate
      setCurrentReloadTime(reload)
      setMana(mana_)
    },
  },
  {
    id: "SIGMA",
    name: "$action_sigma",
    description: "$actiondesc_sigma",
    sprite: "var(--sprite-action-sigma)",
    sprite_unidentified: "data/ui_gfx/gun_actions/spread_reduce_unidentified.png",
    spawn_requires_flag: "card_unlocked_duplicate",
    type: "other",
    recursive: true,
    spawn_level: "4,5,10",
    spawn_probability: "0.1,0.2,1",
    price: 500,
    mana: 120,
    action: function(c: GunActionState, recursion_level: number = 0, iteration: number = 1) {
      c.fire_rate_wait = c.fire_rate_wait + 30
      
      let firerate = c.fire_rate_wait
      let reload = current_reload_time
      let mana_ = mana
      
      if ( discarded != null )  {
        for (const [i, data] of ipairs(discarded, 'discarded')) {
          let rec = check_recursion( data, recursion_level )
          if (( data != null ) && ( data.type === "static" ) && ( rec > -1 ))  {
            setDontDrawActions(true)
            call_action("action", data, c,  rec )
            setDontDrawActions(false)
          }
        }
      }
      
      if ( hand != null )  {
        for (const [i, data] of ipairs(hand, 'hand')) {
          let rec = check_recursion( data, recursion_level )
          if (( data != null ) && ( data.type === "static" ) && ( rec > -1 ))  {
            setDontDrawActions(true)
            call_action("action", data, c,  rec )
            setDontDrawActions(false)
          }
        }
      }
      
      if ( deck != null )  {
        for (const [i, data] of ipairs(deck, 'deck')) {
          let rec = check_recursion( data, recursion_level )
          if (( data != null ) && ( data.type === "static" ) && ( rec > -1 ))  {
            setDontDrawActions(true)
            call_action("action", data, c,  rec )
            setDontDrawActions(false)
          }
        }
      }
      
      c.fire_rate_wait = firerate
      setCurrentReloadTime(reload)
      setMana(mana_)
      
      draw_actions( 1, true )
    },
  },
  {
    id: "ZETA",
    name: "$action_zeta",
    description: "$actiondesc_zeta",
    sprite: "var(--sprite-action-zeta)",
    sprite_unidentified: "data/ui_gfx/gun_actions/spread_reduce_unidentified.png",
    spawn_requires_flag: "card_unlocked_duplicate",
    type: "other",
    spawn_manual_unlock: true,
    recursive: true,
    spawn_level: "2,5,10",
    spawn_probability: "0.2,0.4,0.5",
    price: 200,
    mana: 10,
    action: function(c: GunActionState, recursion_level: number = 0, iteration: number = 1) {
      let entity_id = GetUpdatedEntityID(this.id, )
      let [x, y] = EntityGetTransform(this.id,  entity_id )
      let options: any = []
      
      let children = EntityGetAllChildren(this.id,  entity_id )
      let inventory = EntityGetFirstComponent(this.id,  entity_id, "Inventory2Component" )
      
      if (( children != null ) && ( inventory != null ))  {
        let active_wand = ComponentGetValue2(this.id,  inventory, "mActiveItem" )
        
        for (const [i, child_id] of ipairs(children, 'children')) {
          if ( EntityGetName(this.id,  child_id ) === "inventory_quick" )  {
            let wands = EntityGetAllChildren(this.id,  child_id )
            
            if ( wands != null )  {
              for (const [k, wand_id] of ipairs(wands, 'wands')) {
                if (( wand_id !== active_wand ) && EntityHasTag(this.id,  wand_id, "wand" ))  {
                  let spells = EntityGetAllChildren(this.id,  wand_id )
                  
                  if ( spells != null )  {
                    for (const [j, spell_id] of ipairs(spells, 'spells')) {
                      let comp = EntityGetFirstComponentIncludingDisabled(this.id,  spell_id, "ItemActionComponent" )
                      
                      if ( comp != null )  {
                        let action_id = ComponentGetValue2(this.id,  comp, "action_id" )
                        
                        options.push(action_id)
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      
      if ( options.length > 0 )  {
        SetRandomSeed(this.id,  x + GameGetFrameNum(), y + 251 )
        
        let rnd = Random(this.id,  1, options.length )
        let action_id = options[rnd]
        
        for (const [i, data] of ipairs(actions, 'actions')) {
          if ( data.id === action_id )  {
            let rec = check_recursion( data, recursion_level )
            if ( rec > -1 )  {
              setDontDrawActions(true)
              call_action("action", data, c,  rec )
              setDontDrawActions(false)
            }
            break
          }
        }
      }
      
      draw_actions( 1, true )
    },
  },
  {
    id: "DIVIDE_2",
    name: "$action_divide_2",
    description: "$actiondesc_divide_2",
    sprite: "var(--sprite-action-divide-2)",
    sprite_unidentified: "data/ui_gfx/gun_actions/spread_reduce_unidentified.png",
    spawn_requires_flag: "card_unlocked_musicbox",
    type: "other",
    spawn_level: "3,5,6,10",
    spawn_probability: "0.2,0.3,0.2,1",
    price: 200,
    mana: 35,
    action: function(c: GunActionState, recursion_level: number = 0, iteration: number = 1) {
      c.fire_rate_wait = c.fire_rate_wait + 20
      
      let data: Spell | null = null
      
      let iter = iteration || 1
      let iter_max = iteration || 1
      
      if ( deck.length > 0 )  {
        data = deck[iter - 1] || null
      } else {
        data = null
      }
      
      let count = 2
      if ( iter >= 5 )  {
        count = 1
      }
      
      let rec = check_recursion( data, recursion_level )
      
      if (( data != null ) && ( rec > -1 ) && ( ( data.uses_remaining == null ) || ( data.uses_remaining !== 0 ) ))  {
        let firerate = c.fire_rate_wait
        let reload = current_reload_time
        
        for (const i of luaFor(1, count)) {
          if ( i === 1 )  {
            setDontDrawActions(true)
          }
          let imax = call_action("action", data, c,  rec, iter + 1 )
          setDontDrawActions(false)
          if (imax != null)  {
            iter_max = imax
          }
        }
        
        if (( data.uses_remaining != null ) && ( data.uses_remaining > 0 ))  {
          data.uses_remaining = data.uses_remaining - 1
          
          let reduce_uses = ActionUsesRemainingChanged(this.id,  data.inventoryitem_id, data.uses_remaining )
          if (!reduce_uses) {
            data.uses_remaining = data.uses_remaining + 1 
          }
        }
        
        if (iter === 1)  {
          c.fire_rate_wait = firerate
          setCurrentReloadTime(reload)
          
          for (const i of luaFor(1, iter_max)) {
            if (deck.length > 0)  {
              let d = deck[1 - 1]
              discarded.push(d)
              deck.splice(1 - 1, 1)
            }
          }
        }
      }
      
      c.damage_projectile_add = c.damage_projectile_add - 0.2
      c.explosion_radius = c.explosion_radius - 5.0
      if (c.explosion_radius < 0)  {
        c.explosion_radius = 0
      }
      
      c.pattern_degrees = 5
      
      return iter_max
    },
  },
  {
    id: "DIVIDE_3",
    name: "$action_divide_3",
    description: "$actiondesc_divide_3",
    sprite: "var(--sprite-action-divide-3)",
    sprite_unidentified: "data/ui_gfx/gun_actions/spread_reduce_unidentified.png",
    spawn_requires_flag: "card_unlocked_musicbox",
    type: "other",
    spawn_level: "4,5,6,10",
    spawn_probability: "0.1,0.1,0.2,1",
    price: 250,
    mana: 50,
    action: function(c: GunActionState, recursion_level: number = 0, iteration: number = 1) {
      c.fire_rate_wait = c.fire_rate_wait + 35
      
      let data: Spell | null = null
      
      let iter = iteration || 1
      let iter_max = iteration || 1
      
      if ( deck.length > 0 )  {
        data = deck[iter - 1] || null
      } else {
        data = null
      }
      
      let count = 3
      if ( iter >= 4 )  {
        count = 1
      }
      
      let rec = check_recursion( data, recursion_level )
      
      if (( data != null ) && ( rec > -1 ) && ( ( data.uses_remaining == null ) || ( data.uses_remaining !== 0 ) ))  {
        let firerate = c.fire_rate_wait
        let reload = current_reload_time
        
        for (const i of luaFor(1, count)) {
          if ( i === 1 )  {
            setDontDrawActions(true)
          }
          let imax = call_action("action", data, c,  rec, iter + 1 )
          setDontDrawActions(false)
          if (imax != null)  {
            iter_max = imax
          }
        }
        
        if (( data.uses_remaining != null ) && ( data.uses_remaining > 0 ))  {
          data.uses_remaining = data.uses_remaining - 1
          
          let reduce_uses = ActionUsesRemainingChanged(this.id,  data.inventoryitem_id, data.uses_remaining )
          if (!reduce_uses) {
            data.uses_remaining = data.uses_remaining + 1 
          }
        }
        
        if (iter === 1)  {
          c.fire_rate_wait = firerate
          setCurrentReloadTime(reload)
          
          for (const i of luaFor(1, iter_max)) {
            if (deck.length > 0)  {
              let d = deck[1 - 1]
              discarded.push(d)
              deck.splice(1 - 1, 1)
            }
          }
        }
      }
      
      c.damage_projectile_add = c.damage_projectile_add - 0.4
      c.explosion_radius = c.explosion_radius - 10.0
      if (c.explosion_radius < 0)  {
        c.explosion_radius = 0
      }
      
      c.pattern_degrees = 5
      
      return iter_max
    },
  },
  {
    id: "DIVIDE_4",
    name: "$action_divide_4",
    description: "$actiondesc_divide_4",
    sprite: "var(--sprite-action-divide-4)",
    sprite_unidentified: "data/ui_gfx/gun_actions/spread_reduce_unidentified.png",
    spawn_requires_flag: "card_unlocked_musicbox",
    type: "other",
    spawn_level: "5,6,10",
    spawn_probability: "0.1,0.1,1",
    price: 300,
    mana: 70,
    action: function(c: GunActionState, recursion_level: number = 0, iteration: number = 1) {
      c.fire_rate_wait = c.fire_rate_wait + 50
      
      let data: Spell | null = null
      
      let iter = iteration || 1
      let iter_max = iteration || 1
      
      if ( deck.length > 0 )  {
        data = deck[iter - 1] || null
      } else {
        data = null
      }
      
      let count = 4
      if ( iter >= 4 )  {
        count = 1
      }
      
      let rec = check_recursion( data, recursion_level )
      
      if (( data != null ) && ( rec > -1 ) && ( ( data.uses_remaining == null ) || ( data.uses_remaining !== 0 ) ))  {
        let firerate = c.fire_rate_wait
        let reload = current_reload_time
        
        for (const i of luaFor(1, count)) {
          if ( i === 1 )  {
            setDontDrawActions(true)
          }
          let imax = call_action("action", data, c,  rec, iter + 1 )
          setDontDrawActions(false)
          if (imax != null)  {
            iter_max = imax
          }
        }
        
        if (( data.uses_remaining != null ) && ( data.uses_remaining > 0 ))  {
          data.uses_remaining = data.uses_remaining - 1
          
          let reduce_uses = ActionUsesRemainingChanged(this.id,  data.inventoryitem_id, data.uses_remaining )
          if (!reduce_uses) {
            data.uses_remaining = data.uses_remaining + 1 
          }
        }
        
        if (iter === 1)  {
          c.fire_rate_wait = firerate
          setCurrentReloadTime(reload)
          
          for (const i of luaFor(1, iter_max)) {
            if (deck.length > 0)  {
              let d = deck[1 - 1]
              discarded.push(d)
              deck.splice(1 - 1, 1)
            }
          }
        }
      }
      
      c.damage_projectile_add = c.damage_projectile_add - 0.6
      c.explosion_radius = c.explosion_radius - 20.0
      if (c.explosion_radius < 0)  {
        c.explosion_radius = 0
      }
      
      c.pattern_degrees = 5
      
      return iter_max
    },
  },
  {
    id: "DIVIDE_10",
    name: "$action_divide_10",
    description: "$actiondesc_divide_10",
    sprite: "var(--sprite-action-divide-10)",
    sprite_unidentified: "data/ui_gfx/gun_actions/spread_reduce_unidentified.png",
    spawn_requires_flag: "card_unlocked_divide",
    type: "other",
    spawn_level: "10",
    spawn_probability: "1",
    price: 400,
    mana: 200,
    max_uses: 5,
    action: function(c: GunActionState, recursion_level: number = 0, iteration: number = 1) {
      c.fire_rate_wait = c.fire_rate_wait + 80
      setCurrentReloadTime(current_reload_time + 20)
      
      let data: Spell | null = null
      
      let iter = iteration || 1
      let iter_max = iteration || 1
      
      if ( deck.length > 0 )  {
        data = deck[iter - 1] || null
      } else {
        data = null
      }
      
      let count = 10
      if ( iter >= 3 )  {
        count = 1
      }
      
      let rec = check_recursion( data, recursion_level )
      
      if (( data != null ) && ( rec > -1 ) && ( ( data.uses_remaining == null ) || ( data.uses_remaining !== 0 ) ))  {
        let firerate = c.fire_rate_wait
        let reload = current_reload_time
        
        for (const i of luaFor(1, count)) {
          if ( i === 1 )  {
            setDontDrawActions(true)
          }
          let imax = call_action("action", data, c,  rec, iter + 1 )
          setDontDrawActions(false)
          if (imax != null)  {
            iter_max = imax
          }
        }
        
        if (( data.uses_remaining != null ) && ( data.uses_remaining > 0 ))  {
          data.uses_remaining = data.uses_remaining - 1
          
          let reduce_uses = ActionUsesRemainingChanged(this.id,  data.inventoryitem_id, data.uses_remaining )
          if (!reduce_uses) {
            data.uses_remaining = data.uses_remaining + 1 
          }
        }
        
        if (iter === 1)  {
          c.fire_rate_wait = firerate
          setCurrentReloadTime(reload)
          
          for (const i of luaFor(1, iter_max)) {
            if (deck.length > 0)  {
              let d = deck[1 - 1]
              discarded.push(d)
              deck.splice(1 - 1, 1)
            }
          }
        }
      }
      
      c.damage_projectile_add = c.damage_projectile_add - 1.5
      c.explosion_radius = c.explosion_radius - 40.0
      if (c.explosion_radius < 0)  {
        c.explosion_radius = 0
      }
      
      c.pattern_degrees = 5
      
      return iter_max
    },
  },
  {
    id: "METEOR_RAIN",
    name: "$action_meteor_rain",
    description: "$actiondesc_meteor_rain",
    sprite: "var(--sprite-action-meteor-rain)",
    sprite_unidentified: "data/ui_gfx/gun_actions/bomb_unidentified.png",
    related_projectiles: [ "data/entities/projectiles/deck/meteor_rain_meteor.xml" ],
    related_extra_entities: [ "data/entities/misc/effect_meteor_rain.xml" ],
    spawn_requires_flag: "card_unlocked_rain",
    never_unlimited: true,
    type: "static",
    spawn_level: "6,10",
    spawn_probability: "0.1,1",
    price: 300,
    mana: 225,
    max_uses: 2,
    custom_xml_file: "data/entities/misc/custom_cards/meteor_rain.xml",
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/meteor_rain.xml")
      c.extra_entities = c.extra_entities + "data/entities/misc/effect_meteor_rain.xml,"
      c.fire_rate_wait = c.fire_rate_wait + 100
      setCurrentReloadTime(current_reload_time + 60)
    },
  },
  {
    id: "WORM_RAIN",
    name: "$action_worm_rain",
    description: "$actiondesc_worm_rain",
    sprite: "var(--sprite-action-worm-rain)",
    sprite_unidentified: "data/ui_gfx/gun_actions/bomb_unidentified.png",
    related_projectiles: ["data/entities/animals/worm_big.xml"],
    spawn_requires_flag: "card_unlocked_rain",
    never_unlimited: true,
    type: "static",
    spawn_level: "6,10",
    spawn_probability: "0.1,1",
    price: 300,
    mana: 225,
    max_uses: 2,
    custom_xml_file: "data/entities/misc/custom_cards/worm_rain.xml",
    action: function(c: GunActionState) {
      add_projectile("data/entities/projectiles/deck/worm_rain.xml")
      c.fire_rate_wait = c.fire_rate_wait + 100
      setCurrentReloadTime(current_reload_time + 60)
    },
  },
  {
    id: "RESET",
    name: "$action_reset",
    description: "$actiondesc_reset",
    sprite: "var(--sprite-action-reset)",
    sprite_unidentified: "data/ui_gfx/gun_actions/bomb_unidentified.png",
    spawn_requires_flag: "card_unlocked_mestari",
    type: "utility",
    recursive: true,
    spawn_level: "10",
    spawn_probability: "1",
    price: 120,
    mana: 20,
    action: function(c: GunActionState) {
      setCurrentReloadTime(current_reload_time - 25)
      
      for (const [i, v] of ipairs(hand, 'hand')) {
        
        discarded.push(v)
      }
      
      for (const [i, v] of ipairs(deck, 'deck')) {
        
        discarded.push(v)
      }
      
      clearHand()
      clearDeck()
      
      if ( force_stop_draws === false )  {
        setForceStopDraws(true)
        move_discarded_to_deck()
        order_deck()
      }
    },
  },
  {
    id: "IF_ENEMY",
    name: "$action_if_enemy",
    description: "$actiondesc_if_enemy",
    sprite: "var(--sprite-action-if-enemy)",
    sprite_unidentified: "data/ui_gfx/gun_actions/spread_reduce_unidentified.png",
    spawn_requires_flag: "card_unlocked_maths",
    type: "other",
    spawn_level: "10",
    spawn_probability: "1",
    price: 100,
    mana: 0,
    action: function(c: GunActionState, recursion_level: number = 0, iteration: number = 1) {
      let endpoint = -1
      let elsepoint = -1
      let [x, y] = EntityGetTransform(this.id,  GetUpdatedEntityID(this.id, ) )
      let enemies = EntityGetInRadiusWithTag(this.id,  x, y, 240, "homing_target" )
      
      let doskip = false
      if ( enemies.length < 15 )  {
        doskip = true
      }
      
      if ( deck.length > 0 )  {
        for (const [i, v] of ipairs(deck, 'deck')) {
          if ( v != null )  {
            if ((  v.id.substring( 1-1, 3 ) === "IF_" ) && ( v.id !== "IF_END" ) && ( v.id !== "IF_ELSE" ))  {
              endpoint = -1
              break
            }
            
            if ( v.id === "IF_ELSE" )  {
              endpoint = i + 1
              elsepoint = i + 1
            }
            
            if ( v.id === "IF_END" )  {
              endpoint = i + 1
              break
            }
          }
        }
        
        let envelope_min = 1
        let envelope_max = 1
          
        if (doskip ) {
          if ( elsepoint > 0 )  {
            envelope_max = elsepoint
          } else if ( endpoint > 0 )  {
            envelope_max = endpoint
          }
          
          for (const i of luaFor(envelope_min, envelope_max)) {
            let v = deck[envelope_min - 1]
            
            if ( v != null )  {
              discarded.push(v)
              deck.splice(envelope_min - 1, 1)
            }
          }
        } else {
          if ( elsepoint > 0 )  {
            envelope_min = elsepoint
            
            if ( endpoint > 0 )  {
              envelope_max = endpoint
            } else {
              envelope_max = deck.length
            }
            
            for (const i of luaFor(envelope_min, envelope_max)) {
              let v = deck[envelope_min - 1]
              
              if ( v != null )  {
                discarded.push(v)
                deck.splice(envelope_min - 1, 1)
              }
            }
          }
        }
      }
      
      draw_actions( 1, true )
    },
  },
  {
    id: "IF_PROJECTILE",
    name: "$action_if_projectile",
    description: "$actiondesc_if_projectile",
    sprite: "var(--sprite-action-if-projectile)",
    sprite_unidentified: "data/ui_gfx/gun_actions/spread_reduce_unidentified.png",
    spawn_requires_flag: "card_unlocked_maths",
    type: "other",
    spawn_level: "10",
    spawn_probability: "1",
    price: 100,
    mana: 0,
    action: function(c: GunActionState, recursion_level: number = 0, iteration: number = 1) {
      let endpoint = -1
      let elsepoint = -1
      let [x, y] = EntityGetTransform(this.id,  GetUpdatedEntityID(this.id, ) )
      let enemies = EntityGetInRadiusWithTag(this.id,  x, y, 160, "projectile" )
      
      let doskip = false
      if ( enemies.length < 20 )  {
        doskip = true
      }
      
      if ( deck.length > 0 )  {
        for (const [i, v] of ipairs(deck, 'deck')) {
          if ( v != null )  {
            if ((  v.id.substring( 1-1, 3 ) === "IF_" ) && ( v.id !== "IF_END" ) && ( v.id !== "IF_ELSE" ))  {
              endpoint = -1
              break
            }
            
            if ( v.id === "IF_ELSE" )  {
              endpoint = i + 1
              elsepoint = i + 1
            }
            
            if ( v.id === "IF_END" )  {
              endpoint = i + 1
              break
            }
          }
        }
        
        let envelope_min = 1
        let envelope_max = 1
          
        if (doskip ) {
          if ( elsepoint > 0 )  {
            envelope_max = elsepoint
          } else if ( endpoint > 0 )  {
            envelope_max = endpoint
          }
          
          for (const i of luaFor(envelope_min, envelope_max)) {
            let v = deck[envelope_min - 1]
            
            if ( v != null )  {
              discarded.push(v)
              deck.splice(envelope_min - 1, 1)
            }
          }
        } else {
          if ( elsepoint > 0 )  {
            envelope_min = elsepoint
            
            if ( endpoint > 0 )  {
              envelope_max = endpoint
            } else {
              envelope_max = deck.length
            }
            
            for (const i of luaFor(envelope_min, envelope_max)) {
              let v = deck[envelope_min - 1]
              
              if ( v != null )  {
                discarded.push(v)
                deck.splice(envelope_min - 1, 1)
              }
            }
          }
        }
      }
      
      draw_actions( 1, true )
    },
  },
  {
    id: "IF_HP",
    name: "$action_if_hp",
    description: "$actiondesc_if_hp",
    sprite: "var(--sprite-action-if-hp)",
    sprite_unidentified: "data/ui_gfx/gun_actions/spread_reduce_unidentified.png",
    spawn_requires_flag: "card_unlocked_maths",
    type: "other",
    spawn_level: "10",
    spawn_probability: "1",
    price: 100,
    mana: 0,
    action: function(c: GunActionState, recursion_level: number = 0, iteration: number = 1) {
      let endpoint = -1
      let elsepoint = -1
      let entity_id = GetUpdatedEntityID(this.id, )
      let comp = EntityGetFirstComponent(this.id,  entity_id, "DamageModelComponent" )
      let hpdiff = 1.0
      
      if ( comp != null )  {
        let hp = ComponentGetValue2(this.id,  comp, "hp" )
        let max_hp = ComponentGetValue2(this.id,  comp, "max_hp" )
        
        hpdiff = hp / max_hp
      }
      
      let doskip = false
      if ( hpdiff > 0.25 )  {
        doskip = true
      }
      
      if ( deck.length > 0 )  {
        for (const [i, v] of ipairs(deck, 'deck')) {
          if ( v != null )  {
            if ((  v.id.substring( 1-1, 3 ) === "IF_" ) && ( v.id !== "IF_END" ) && ( v.id !== "IF_ELSE" ))  {
              endpoint = -1
              break
            }
            
            if ( v.id === "IF_ELSE" )  {
              endpoint = i + 1
              elsepoint = i + 1
            }
            
            if ( v.id === "IF_END" )  {
              endpoint = i + 1
              break
            }
          }
        }
        
        let envelope_min = 1
        let envelope_max = 1
          
        if (doskip ) {
          if ( elsepoint > 0 )  {
            envelope_max = elsepoint
          } else if ( endpoint > 0 )  {
            envelope_max = endpoint
          }
          
          for (const i of luaFor(envelope_min, envelope_max)) {
            let v = deck[envelope_min - 1]
            
            if ( v != null )  {
              discarded.push(v)
              deck.splice(envelope_min - 1, 1)
            }
          }
        } else {
          if ( elsepoint > 0 )  {
            envelope_min = elsepoint
            
            if ( endpoint > 0 )  {
              envelope_max = endpoint
            } else {
              envelope_max = deck.length
            }
            
            for (const i of luaFor(envelope_min, envelope_max)) {
              let v = deck[envelope_min - 1]
              
              if ( v != null )  {
                discarded.push(v)
                deck.splice(envelope_min - 1, 1)
              }
            }
          }
        }
      }
      
      draw_actions( 1, true )
    },
  },
  {
    id: "IF_HALF",
    name: "$action_if_half",
    description: "$actiondesc_if_half",
    sprite: "var(--sprite-action-if-half)",
    sprite_unidentified: "data/ui_gfx/gun_actions/spread_reduce_unidentified.png",
    spawn_requires_flag: "card_unlocked_maths",
    type: "other",
    spawn_level: "10",
    spawn_probability: "1",
    price: 100,
    mana: 0,
    action: function(c: GunActionState, recursion_level: number = 0, iteration: number = 1) {
      let endpoint = -1
      let elsepoint = -1
      let doskip = false
      
      if ( reflecting === false )  {
        let status = Number.parseInt( GlobalsGetValue(this.id,  "GUN_ACTION_IF_HALF_STATUS", "0" ) ) || 0
        
        if ( status === 1 )  {
          doskip = true
        }
        
        status = 1 - status
        GlobalsSetValue(this.id,  "GUN_ACTION_IF_HALF_STATUS", String( status ) )
      }
      
      if ( deck.length > 0 )  {
        for (const [i, v] of ipairs(deck, 'deck')) {
          if ( v != null )  {
            if ((  v.id.substring( 1-1, 3 ) === "IF_" ) && ( v.id !== "IF_END" ) && ( v.id !== "IF_ELSE" ))  {
              endpoint = -1
              break
            }
            
            if ( v.id === "IF_ELSE" )  {
              endpoint = i + 1
              elsepoint = i + 1
            }
            
            if ( v.id === "IF_END" )  {
              endpoint = i + 1
              break
            }
          }
        }
        
        let envelope_min = 1
        let envelope_max = 1
        
        if (doskip ) {
          if ( elsepoint > 0 )  {
            envelope_max = elsepoint
          } else if ( endpoint > 0 )  {
            envelope_max = endpoint
          }
          
          for (const i of luaFor(envelope_min, envelope_max)) {
            let v = deck[envelope_min - 1]
          
            if ( v != null )  {
              discarded.push(v)
              deck.splice(envelope_min - 1, 1)
            }
          }
        } else {
          if ( elsepoint > 0 )  {
            envelope_min = elsepoint
            
            if ( endpoint > 0 )  {
              envelope_max = endpoint
            } else {
              envelope_max = deck.length
            }
            
            for (const i of luaFor(envelope_min, envelope_max)) {
              let v = deck[envelope_min - 1]
              
              if ( v != null )  {
                discarded.push(v)
                deck.splice(envelope_min - 1, 1)
              }
            }
          }
        }
      }
      
      draw_actions( 1, true )
    },
  },
  {
    id: "IF_END",
    name: "$action_if_end",
    description: "$actiondesc_if_end",
    sprite: "var(--sprite-action-if-end)",
    sprite_unidentified: "data/ui_gfx/gun_actions/spread_reduce_unidentified.png",
    spawn_requires_flag: "card_unlocked_maths",
    type: "other",
    spawn_level: "10",
    spawn_probability: "1",
    price: 10,
    mana: 0,
    action: function(c: GunActionState, recursion_level: number = 0, iteration: number = 1) {      
      draw_actions( 1, true )
    },
  },
  {
    id: "IF_ELSE",
    name: "$action_if_else",
    description: "$actiondesc_if_else",
    sprite: "var(--sprite-action-if-else)",
    sprite_unidentified: "data/ui_gfx/gun_actions/spread_reduce_unidentified.png",
    spawn_requires_flag: "card_unlocked_maths",
    type: "other",
    spawn_level: "10",
    spawn_probability: "1",
    price: 10,
    mana: 0,
    action: function(c: GunActionState, recursion_level: number = 0, iteration: number = 1) {      
      draw_actions( 1, true )
    },
  },
  {
    id: "COLOUR_RED",
    name: "$action_colour_red",
    description: "$actiondesc_colour_red",
    sprite: "var(--sprite-action-colour-red)",
    sprite_unidentified: "data/ui_gfx/gun_actions/homing_unidentified.png",
    related_extra_entities: [ "data/entities/particles/tinyspark_red.xml", "data/entities/misc/colour_red.xml" ],
    type: "modifier",
    spawn_level: "1,2,3,4,5,6",
    spawn_probability: "0.2,0.2,0.4,0.2,0.2,0.2",
    spawn_requires_flag: "card_unlocked_paint",
    price: 40,
    mana: 0,
    
    action: function(c: GunActionState) {
      c.extra_entities = c.extra_entities + "data/entities/particles/tinyspark_red.xml,data/entities/misc/colour_red.xml,"
      c.fire_rate_wait = c.fire_rate_wait - 8
      c.screenshake = c.screenshake - 2.5
      if ( c.screenshake < 0 )  {
        c.screenshake = 0
      }
      draw_actions( 1, true )
    },
  },
  {
    id: "COLOUR_ORANGE",
    name: "$action_colour_orange",
    description: "$actiondesc_colour_orange",
    sprite: "var(--sprite-action-colour-orange)",
    sprite_unidentified: "data/ui_gfx/gun_actions/homing_unidentified.png",
    related_extra_entities: [ "data/entities/particles/tinyspark_red.xml", "data/entities/misc/colour_orange.xml" ],
    type: "modifier",
    spawn_level: "2,3,4",
    spawn_probability: "0.1,0.1,0.4",
    spawn_requires_flag: "card_unlocked_paint",
    price: 40,
    mana: 0,
    
    action: function(c: GunActionState) {
      c.extra_entities = c.extra_entities + "data/entities/particles/tinyspark_red.xml,data/entities/misc/colour_orange.xml,"
      c.fire_rate_wait = c.fire_rate_wait - 8
      c.screenshake = c.screenshake - 2.5
      if ( c.screenshake < 0 )  {
        c.screenshake = 0
      }
      draw_actions( 1, true )
    },
  },
  {
    id: "COLOUR_GREEN",
    name: "$action_colour_green",
    description: "$actiondesc_colour_green",
    sprite: "var(--sprite-action-colour-green)",
    sprite_unidentified: "data/ui_gfx/gun_actions/homing_unidentified.png",
    related_extra_entities: [ "data/entities/particles/tinyspark_red.xml", "data/entities/misc/colour_green.xml" ],
    type: "modifier",
    spawn_level: "2,3,4",
    spawn_probability: "0.4,0.1,0.1",
    spawn_requires_flag: "card_unlocked_paint",
    price: 40,
    mana: 0,
    
    action: function(c: GunActionState) {
      c.extra_entities = c.extra_entities + "data/entities/particles/tinyspark_red.xml,data/entities/misc/colour_green.xml,"
      c.fire_rate_wait = c.fire_rate_wait - 8
      c.screenshake = c.screenshake - 2.5
      if ( c.screenshake < 0 )  {
        c.screenshake = 0
      }
      draw_actions( 1, true )
    },
  },
  {
    id: "COLOUR_YELLOW",
    name: "$action_colour_yellow",
    description: "$actiondesc_colour_yellow",
    sprite: "var(--sprite-action-colour-yellow)",
    sprite_unidentified: "data/ui_gfx/gun_actions/homing_unidentified.png",
    related_extra_entities: [ "data/entities/particles/tinyspark_red.xml", "data/entities/misc/colour_yellow.xml" ],
    type: "modifier",
    spawn_level: "2,3,4",
    spawn_probability: "0.1,0.4,0.1",
    spawn_requires_flag: "card_unlocked_paint",
    price: 40,
    mana: 0,
    
    action: function(c: GunActionState) {
      c.extra_entities = c.extra_entities + "data/entities/particles/tinyspark_red.xml,data/entities/misc/colour_yellow.xml,"
      c.fire_rate_wait = c.fire_rate_wait - 8
      c.screenshake = c.screenshake - 2.5
      if ( c.screenshake < 0 )  {
        c.screenshake = 0
      }
      draw_actions( 1, true )
    },
  },
  {
    id: "COLOUR_PURPLE",
    name: "$action_colour_purple",
    description: "$actiondesc_colour_purple",
    sprite: "var(--sprite-action-colour-purple)",
    sprite_unidentified: "data/ui_gfx/gun_actions/homing_unidentified.png",
    related_extra_entities: [ "data/entities/particles/tinyspark_red.xml", "data/entities/misc/colour_purple.xml" ],
    type: "modifier",
    spawn_level: "2,3,4",
    spawn_probability: "0.1,0.1,0.4",
    spawn_requires_flag: "card_unlocked_paint",
    price: 40,
    mana: 0,
    
    action: function(c: GunActionState) {
      c.extra_entities = c.extra_entities + "data/entities/particles/tinyspark_red.xml,data/entities/misc/colour_purple.xml,"
      c.fire_rate_wait = c.fire_rate_wait - 8
      c.screenshake = c.screenshake - 2.5
      if ( c.screenshake < 0 )  {
        c.screenshake = 0
      }
      draw_actions( 1, true )
    },
  },
  {
    id: "COLOUR_BLUE",
    name: "$action_colour_blue",
    description: "$actiondesc_colour_blue",
    sprite: "var(--sprite-action-colour-blue)",
    sprite_unidentified: "data/ui_gfx/gun_actions/homing_unidentified.png",
    related_extra_entities: [ "data/entities/particles/tinyspark_red.xml", "data/entities/misc/colour_blue.xml" ],
    type: "modifier",
    spawn_level: "2,3,4",
    spawn_probability: "0.4,0.1,0.1",
    spawn_requires_flag: "card_unlocked_paint",
    price: 40,
    mana: 0,
    
    action: function(c: GunActionState) {
      c.extra_entities = c.extra_entities + "data/entities/particles/tinyspark_red.xml,data/entities/misc/colour_blue.xml,"
      c.fire_rate_wait = c.fire_rate_wait - 8
      c.screenshake = c.screenshake - 2.5
      if ( c.screenshake < 0 )  {
        c.screenshake = 0
      }
      draw_actions( 1, true )
    },
  },
  {
    id: "COLOUR_RAINBOW",
    name: "$action_colour_rainbow",
    description: "$actiondesc_colour_rainbow",
    sprite: "var(--sprite-action-colour-rainbow)",
    sprite_unidentified: "data/ui_gfx/gun_actions/homing_unidentified.png",
    related_extra_entities: [ "data/entities/particles/tinyspark_red.xml", "data/entities/misc/colour_rainbow.xml" ],
    type: "modifier",
    spawn_level: "2,3,4,10",
    spawn_probability: "0.1,0.1,0.1,0.2",
    spawn_requires_flag: "card_unlocked_paint",
    price: 40,
    mana: 0,
    
    action: function(c: GunActionState) {
      c.extra_entities = c.extra_entities + "data/entities/particles/tinyspark_red.xml,data/entities/misc/colour_rainbow.xml,"
      c.fire_rate_wait = c.fire_rate_wait - 8
      c.screenshake = c.screenshake - 2.5
      if ( c.screenshake < 0 )  {
        c.screenshake = 0
      }
      draw_actions( 1, true )
    },
  },
  {
    id: "COLOUR_INVIS",
    name: "$action_colour_invis",
    description: "$actiondesc_colour_invis",
    sprite: "var(--sprite-action-colour-invis)",
    sprite_unidentified: "data/ui_gfx/gun_actions/homing_unidentified.png",
    related_extra_entities: [ "data/entities/misc/colour_invis.xml" ],
    type: "modifier",
    spawn_level: "2,3,4,10",
    spawn_probability: "0.1,0.1,0.1,0.1",
    spawn_requires_flag: "card_unlocked_paint",
    price: 40,
    mana: 0,
    
    action: function(c: GunActionState) {
      c.extra_entities = c.extra_entities + "data/entities/misc/colour_invis.xml,"
      c.fire_rate_wait = c.fire_rate_wait - 8
      c.screenshake = c.screenshake - 2.5
      if ( c.screenshake < 0 )  {
        c.screenshake = 0
      }
      draw_actions( 1, true )
    },
  },
  {
    id: "RAINBOW_TRAIL",
    name: "$action_rainbow_trail",
    description: "$actiondesc_rainbow_trail",
    sprite: "var(--sprite-action-rainbow-trail)",
    sprite_unidentified: "data/ui_gfx/gun_actions/oil_trail_unidentified.png",
    type: "modifier",
    spawn_level: "10",
    spawn_probability: "0",
    spawn_requires_flag: "card_unlocked_rainbow_trail",
    price: 100,
    mana: 0,
    
    custom_xml_file: "data/entities/misc/custom_cards/rainbow_trail.xml",
    action: function(c: GunActionState) {
      c.game_effect_entities = c.game_effect_entities + "data/entities/misc/effect_rainbow_farts.xml,"
      c.trail_material = c.trail_material + "material_rainbow,"
      c.trail_material_amount = c.trail_material_amount + 20
      draw_actions( 1, true )
    },

  },
  {
    id: "CESSATION",
    name: "$action_cessation",
    description: "$actiondesc_cessation",
    sprite: "var(--sprite-action-cessation)",
    sprite_unidentified: "data/ui_gfx/gun_actions/cessation_unidentified.png",
    type: "other",
    spawn_level: "5,6,10",
    spawn_probability: "0.1,0.2,1",
    spawn_requires_flag: "card_unlocked_cessation",
    price: 10,
    mana: 0,
    max_uses: 25,
    
    action: function(c: GunActionState) {
      c.fire_rate_wait = c.fire_rate_wait + 600
      setCurrentReloadTime(current_reload_time + 600)

      if (reflecting ) { return }

      
      let frame = GameGetFrameNum()
      let lifetime = 20 + c.lifetime_add

      let caster_entity = GetUpdatedEntityID(this.id, )
      let wand_entity = find_the_wand_held( caster_entity )

      if (wand_entity ) {
        let ability = EntityGetFirstComponentIncludingDisabled(this.id,  wand_entity, "AbilityComponent" )
        if (ability != null ) {
          ComponentSetValue2(this.id,  ability, "mNextFrameUsable", frame + lifetime + c.fire_rate_wait )
          ComponentSetValue2(this.id,  ability, "mCastDelayStartFrame", frame + lifetime )
        }
      }

      let inventory = EntityGetFirstComponentIncludingDisabled(this.id,  caster_entity, "InventoryGuiComponent" )
      if (inventory != null ) {
        ComponentSetValue2(this.id,  inventory, "mDisplayFireRateWaitBar", true )
      }

      let platformshooter = EntityGetFirstComponentIncludingDisabled(this.id,  caster_entity, "PlatformShooterPlayerComponent" )
      if (platformshooter != null ) {
        ComponentSetValue2(this.id,  platformshooter, "mCessationDo", true )
        ComponentSetValue2(this.id,  platformshooter, "mCessationLifetime", lifetime )
      }

      StartReload(this.id,  current_reload_time )
    },
  },
];


export const spells = actions;

/* vim: set readonly nomodifiable: Auto-generated file */
