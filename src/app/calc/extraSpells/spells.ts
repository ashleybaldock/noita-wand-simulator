import type { GunActionState } from '../actionState';
import type { Spell } from '../spell';
/*
import { ipairs, luaFor } from '../lua/loops';
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
  } from '../eval/dispatch';
*/
/*
  deck,
  shot_effects,
  current_reload_time,
  setCurrentReloadTime,
  mana,
  setMana,
  setDontDrawActions,
  force_stop_draws,
  setForceStopDraws,
  clearDiscarded,
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
 */
import { hand, discarded } from '../gun';

const actions: Spell[] = [
  {
    id: 'DRAW_EAT',
    name: '$DRAW_EAT',
    description: '$DRAW_EAT',
    sprite: 'data/ui_gfx/gun_actions/draw_eat.png',
    sprite_unidentified:
      'data/ui_gfx/gun_actions/spread_reduce_unidentified.png',
    type: 'other',
    spawn_level: '',
    spawn_probability: '',
    price: 2,
    mana: 10,
    action: function (c: GunActionState) {
      if (hand.length === 0) {
        return;
      }
      if (hand[hand.length - 1]?.id === 'DRAW_EAT') {
        discarded.push(hand[hand.length - 1]);
      }
    },
  },
];

export const extraSpells = actions;
