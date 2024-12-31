import type { ActionId } from './actionId';
import type { ActionSource } from './actionSources';
import type { Spell } from './spell';
import { getSpellByActionId } from './spells';
import type { GunActionState } from './actionState';
import {
  ConfigGunActionInfo_Create,
  ConfigGunActionInfo_Init,
  ConfigGunActionInfo_Copy,
  defaultGunActionState,
} from './defaultActionState';
import {
  ConfigGunShotEffects_Init,
  ConfigGunShotEffects_PassToGame,
} from './gunshoteffects_generated';
import type { ExtraModifier } from './extraModifiers';
import { extraModifiers } from './extraModifiers';
import type { WandId } from './eval/dispatch';
import {
  ActionUsed,
  ActionUsesRemainingChanged,
  BeginProjectile,
  BeginTriggerDeath,
  BeginTriggerHitWorld,
  BeginTriggerTimer,
  EndProjectile,
  EndTrigger,
  /* LogAction,*/
  OnCallActionPre,
  OnActionFinished,
  OnActionPlayed,
  OnDraw,
  OnNotEnoughManaForAction,
  SetProjectileConfigs,
  StartReload,
  Random,
  OnMoveDiscardedToDeck,
  SetRandomSeed,
  GameGetFrameNum,
  OnSetDontDraw,
  OnUnsetDontDraw,
  OnPlayPermanentCard,
  OnWrap,
  OnCantWrap,
  OnNoUsesRemaining,
  OnExtraModifier,
  OnCreateShot,
} from './eval/dispatch';
import type { AlwaysCastWandIndex } from '../redux/WandIndex';
import type { EntityId } from '@reduxjs/toolkit';
import type { ProjectileId } from './projectile';

// constants
export const ACTION_DRAW_RELOAD_TIME_INCREASE = 0;
const ACTION_MANA_DRAIN_DEFAULT = 10;
const ACTION_UNIDENTIFIED_SPRITE_DEFAULT =
  // 'data/ui_gfx/gun_actions/unidentified.png';
  'var(--sprite-action-unidentified)';

/* Does (almost) nothing in the sim - leave as false */
export const reflecting = false;
// let current_action: Action | null = null;

export type Gun = {
  actions_per_round: number;
  shuffle_deck_when_empty: boolean;
  reload_time: number;
  deck_capacity: number;
};

export function ConfigGun_Init(): Gun {
  return {
    actions_per_round: 1,
    shuffle_deck_when_empty: false,
    reload_time: 40,
    deck_capacity: 2,
  };
}

export type Shot = {
  num_of_cards_to_draw: number;
  state: GunActionState;
};

export type ShotEffects = {
  recoil_knockback: number;
};

const initialGunState: Gun = {
  actions_per_round: 1,
  shuffle_deck_when_empty: false,
  reload_time: 40,
  deck_capacity: 2,
} as const;

// gun current state
let first_shot = true;
let reloading = false;
let start_reload = false;
let got_projectiles = false;

export const state_from_game: GunActionState = {
  ...defaultGunActionState,
  ...initialGunState,
};

/* Beware - Many small quirks of individual spell behaviour rely on
 * exactly how arrays are traversed and cleared. Refer closely to the
 * source lua files when making changes */
export let discarded: Spell[] = [];
export let deck: Spell[] = [];
export let hand: Spell[] = [];

export function clearDiscarded() {
  /* This MUST be a new array assignment! */
  discarded = [];
}

export function clearDeck() {
  /* This MUST be a new array assignment! */
  deck = [];
}

export function clearHand() {
  /* This MUST be a new array assignment! */
  hand = [];
}

export let c: GunActionState;
// let current_projectile = null;
export let current_reload_time = 0;

export function setCurrentReloadTime(crt: number) {
  current_reload_time = crt;
}

export const shot_effects: ShotEffects = {
  recoil_knockback: 0,
};

const active_extra_modifiers: ExtraModifier[] = [];

export let mana = 0.0;

export function setMana(m: number) {
  mana = m;
}

let state_cards_drawn = 0;
// let state_discarded_action = false;
// let state_destroyed_action = false;

let playing_permanent_card = false;

// let use_game_log = false;

// initialize global/constant gun state
export let gun = ConfigGun_Init();
// ConfigGun_Init(gun)
current_reload_time = gun.reload_time;

// setup additional card-related variables
export let dont_draw_actions = false;

export function setDontDrawActions(dda: boolean) {
  dda ? OnSetDontDraw() : OnUnsetDontDraw();
  dont_draw_actions = dda;
}

export let force_stop_draws = false;

export function setForceStopDraws(fsd: boolean) {
  force_stop_draws = fsd;
}

// eslint-disable-next-line
let shot_structure = {};
const recursion_limit = 2;

function reset_modifiers(state: GunActionState) {
  ConfigGunActionInfo_Init(state);
}

function register_action(state: GunActionState) {
  state.reload_time = current_reload_time;
  // ConfigGunActionInfo_PassToGame(state);
}

function register_gunshoteffects(effects: ShotEffects) {
  ConfigGunShotEffects_PassToGame(effects);
}

// call this when current action changes

function set_current_action(action: Readonly<Spell>) {
  // c.action_id = action.id;
  c.action_name = action.name;
  c.action_description = action.description;
  c.action_sprite_filename = action.sprite;
  c.action_type = action.type;
  c.action_recursive = action.recursive;
  c.action_spawn_level = action.spawn_level;
  c.action_spawn_probability = action.spawn_probability;
  c.action_spawn_requires_flag = action.spawn_requires_flag;
  c.action_spawn_manual_unlock = action.spawn_manual_unlock || false;
  c.action_max_uses = action.max_uses;
  c.custom_xml_file = action.custom_xml_file;
  c.action_ai_never_uses = action.ai_never_uses || false;
  c.action_never_unlimited = action.never_unlimited || false;

  c.action_is_dangerous_blast = action.is_dangerous_blast;

  c.sound_loop_tag = action.sound_loop_tag;

  c.action_mana_drain = action.mana;
  if (action.mana == null) {
    c.action_mana_drain = ACTION_MANA_DRAIN_DEFAULT;
  }

  c.action_unidentified_sprite_filename = action.sprite_unidentified;
  if (action.sprite_unidentified == null) {
    c.action_unidentified_sprite_filename = ACTION_UNIDENTIFIED_SPRITE_DEFAULT;
  }

  // current_action = action;
}

function clone_action(source: Readonly<Spell>, target: Spell) {
  target.id = source.id;
  target.name = source.name;
  target.type = source.type;
  target.recursive = source.recursive;
  target.related_projectiles = source.related_projectiles;
  target.related_extra_entities = source.related_extra_entities;
  target.action = source.action;
  target.deck_index = source.deck_index;
  target.custom_uses_logic = source.custom_uses_logic;
  target.mana = source.mana;
  target.sound_loop_tag = source.sound_loop_tag;

  //added
  target.sprite = source.sprite;
}

// various utilities

function create_shot(
  actionId: ActionId | WandId,
  num_of_cards_to_draw: number,
): Shot {
  OnCreateShot(actionId, num_of_cards_to_draw);
  const shot: Shot = {
    num_of_cards_to_draw,
    state: ConfigGunActionInfo_Create(),
  };
  // shot.state = {};
  reset_modifiers(shot.state);
  // shot.num_of_cards_to_draw = num_of_cards_to_draw;
  return shot;
}

function draw_shot(
  actionId: ActionId | WandId,
  shot: Shot,
  instant_reload_if_empty: boolean,
) {
  const c_old = c;

  c = shot.state;

  shot_structure = {};
  draw_actions(shot.num_of_cards_to_draw, instant_reload_if_empty);
  register_action(shot.state);
  SetProjectileConfigs();

  c = c_old;
}

// helper functions. actions may call these

export function order_deck() {
  if (gun.shuffle_deck_when_empty) {
    SetRandomSeed('__WAND__', GameGetFrameNum(), GameGetFrameNum());
    // shuffle the deck
    // state_shuffled = true;

    const rand = Random;
    const iterations = deck.length;
    const new_deck: Spell[] = [];

    for (let i = iterations - 1; i >= 0; i--) {
      // looping from iterations to 1 (inclusive)
      const index = rand('__WAND__', 0, i);
      const action = deck[index];
      deck.splice(index, 1);
      new_deck.push(action);
    }

    deck = new_deck;
  } else {
    // sort the deck
    if (!force_stop_draws) {
      deck.sort((a, b) => {
        const a_index = a.deck_index || 0;
        const b_index = b.deck_index || 0;
        return a_index - b_index;
      });
    } else {
      deck.sort((a, b) => {
        const a_ = a.deck_index || 0;
        const b_ = b.deck_index || 0;
        return a_ - b_;
      });
    }
  }
}

function play_action(spell: Readonly<Spell>) {
  OnActionPlayed(spell, c, playing_permanent_card);

  hand.push(spell);

  set_current_action(spell);
  call_action('draw', spell, c);

  let is_projectile = false;

  if (spell.type === 'projectile') {
    is_projectile = true;
    got_projectiles = true;
  }

  if (spell.type === 'static') {
    is_projectile = true;
    got_projectiles = true;
  }

  if (spell.type === 'material') {
    is_projectile = true;
    got_projectiles = true;
  }

  if (is_projectile) {
    active_extra_modifiers.forEach((modifier) => {
      OnExtraModifier(modifier, c, playing_permanent_card);
      extraModifiers[modifier](c);
    });
  }

  current_reload_time = current_reload_time + ACTION_DRAW_RELOAD_TIME_INCREASE;
}

export function draw_action(instant_reload_if_empty: boolean) {
  let action = null;

  state_cards_drawn = state_cards_drawn + 1;
  OnDraw(state_cards_drawn);

  // if (reflecting) {
  //   return;
  // }

  if (deck.length <= 0) {
    if (instant_reload_if_empty && !force_stop_draws) {
      OnWrap(deck, hand, discarded);
      move_discarded_to_deck();
      order_deck();
      start_reload = true;
    } else {
      OnCantWrap();
      reloading = true;
      return true;
    }
  }

  if (deck.length > 0) {
    // draw from the start of the deck
    action = deck[0];
    deck.shift();

    // update mana
    // if (action.mana == null) {
    //   action_mana_required = ACTION_MANA_DRAIN_DEFAULT;
    // }
    const action_mana_required = action.mana ?? ACTION_MANA_DRAIN_DEFAULT;

    if (action_mana_required > mana) {
      OnNotEnoughManaForAction(action_mana_required, mana, action);
      discarded.push(action);
      return false;
    }

    if (action.uses_remaining === 0) {
      OnNoUsesRemaining(action);
      discarded.push(action);
      return false;
    }

    mana = mana - action_mana_required!;
  }

  //- add the action to hand and execute it //-
  if (action !== null) {
    play_action(action);
  }

  return true;
}

function handle_mana_addition(action: Spell) {
  if (action !== null) {
    const action_mana_required = action.mana || 0;

    if (action_mana_required < 0) {
      mana = mana - action_mana_required;
    }
  }
}

export function draw_actions(
  how_many: number,
  instant_reload_if_empty: boolean,
) {
  if (!dont_draw_actions) {
    c.action_draw_many_count = how_many;

    if (playing_permanent_card && how_many === 1) {
      // SPECIAL RULE: modifiers that use draw_actions(1) to draw one
      // more action don't result in two actions being drawn after them
      // if the modifier is permanently attached and wand 'casts 1'

      return;
    }

    for (let i = 0; i < how_many; i++) {
      const ok = draw_action(instant_reload_if_empty);
      if (!ok) {
        // attempt to draw other actions
        while (deck.length > 0) {
          if (draw_action(instant_reload_if_empty)) {
            break;
          }
        }
      }

      if (reloading) {
        return;
      }
    }
  }
}

export function add_projectile(
  actionId: ActionId | WandId,
  entity_filename: ProjectileId,
) {
  BeginProjectile(actionId, entity_filename);
  EndProjectile(actionId);
}

export function add_projectile_trigger_timer(
  actionId: ActionId | WandId,
  entity_filename: ProjectileId,
  delay_frames: number,
  action_draw_count: number,
) {
  BeginProjectile(actionId, entity_filename);
  BeginTriggerTimer(actionId, entity_filename, action_draw_count, delay_frames);
  draw_shot(actionId, create_shot(actionId, action_draw_count), true);
  EndTrigger(actionId);
  EndProjectile(actionId);
}

export function add_projectile_trigger_hit_world(
  actionId: ActionId | WandId,
  entity_filename: ProjectileId,
  action_draw_count: number,
) {
  BeginProjectile(actionId, entity_filename);
  BeginTriggerHitWorld(actionId, entity_filename, action_draw_count);
  draw_shot(actionId, create_shot(actionId, action_draw_count), true);
  EndTrigger(actionId);
  EndProjectile(actionId);
}

export function add_projectile_trigger_death(
  actionId: ActionId | WandId,
  entity_filename: ProjectileId,
  action_draw_count: number,
) {
  BeginProjectile(actionId, entity_filename);
  BeginTriggerDeath(actionId, entity_filename, action_draw_count);
  draw_shot(actionId, create_shot(actionId, action_draw_count), true);
  EndTrigger(actionId);
  EndProjectile(actionId);
}

export function move_discarded_to_deck() {
  OnMoveDiscardedToDeck(discarded);
  discarded.forEach((action) => {
    deck.push(action);
  });
  discarded.length = 0;
}

function move_hand_to_discarded() {
  hand.forEach((action) => {
    let identify = false;

    // 'material', 'projectile'  are handled via got_projectiles
    if (
      got_projectiles ||
      action.type === 'other' ||
      action.type === 'utility'
    ) {
      if (action.uses_remaining && action.uses_remaining > 0) {
        if (action.custom_uses_logic) {
          // do nothing
        } else if (action.is_identified) {
          // consume consumable actions
          action.uses_remaining = action.uses_remaining - 1;
          const reduce_uses = ActionUsesRemainingChanged(
            '__WAND__',
            action.inventoryitem_id,
            action.uses_remaining,
          );
          if (!reduce_uses) {
            action.uses_remaining = action.uses_remaining + 1; // cancel the reduction
          }
        }
      }

      identify = true;
    }

    if (identify) {
      ActionUsed(action.inventoryitem_id);
      action.is_identified = true;
    }

    // if (use_game_log) {
    //   if (action.is_identified) {
    //     LogAction(action.name);
    //   } else {
    //     LogAction('?');
    //   }
    // }

    if (action.uses_remaining !== 0 || action.custom_uses_logic) {
      if (action.permanently_attached == null) {
        discarded.push(action);
      }
    }
  });
  clearHand();
}

export function check_recursion(data: Readonly<Spell> | null, rec_: number) {
  const rec = rec_ || 0;

  if (data != null) {
    if (data.recursive !== null && data.recursive) {
      if (rec >= recursion_limit) {
        return -1;
      } else {
        return rec + 1;
      }
    }
  }

  return rec;
}

// -- exported functions. called by the C++ code --

// call this to do one shot (or round, or turn)
let root_shot: Shot | null = null;

export function _start_shot(current_mana: number) {
  // debug checks
  // if (state_from_game === null) {
  //   console.log("'gun.lua' - state_from_game is nil - did we ever initialize this gun?")
  //   return
  // }

  dont_draw_actions = false;
  force_stop_draws = false;

  // create the initial shot
  root_shot = create_shot('__WAND__', 1);
  c = root_shot.state;

  // set up the initial state for the selected gun
  ConfigGunActionInfo_Copy(state_from_game, c);

  ConfigGunShotEffects_Init(shot_effects);

  root_shot.num_of_cards_to_draw = gun.actions_per_round;

  mana = current_mana;

  // set the deck order if required
  if (first_shot) {
    order_deck();
    current_reload_time = gun.reload_time;
    first_shot = false;
  }

  got_projectiles = false;
}

export function _draw_actions_for_shot(can_reload_at_end: boolean) {
  // draw  actions
  draw_shot('__WAND__', root_shot!, false);

  register_gunshoteffects(shot_effects);

  // finish the turn
  if (can_reload_at_end) {
    _handle_reload();
  }

  active_extra_modifiers.length = 0;

  reloading = false;
}

function _handle_reload() {
  move_hand_to_discarded();

  // start a reload?
  if (!reloading && (deck.length <= 0 || start_reload)) {
    move_discarded_to_deck();
    order_deck();

    StartReload('__WAND__', current_reload_time);
    current_reload_time = gun.reload_time;
    start_reload = false;
  }

  return mana;
}

export function _set_gun(g: Gun) {
  gun = g;
}

// this can be used to build a new deck
export function _clear_deck(/*use_game_log_: boolean*/) {
  hand = [];
  discarded = [];
  deck = [];
  first_shot = true;
  current_reload_time = 0;
  reloading = false;

  // use_game_log = use_game_log_;
}

// this can be used to build a new deck
export function _add_card_to_deck(
  action_id: ActionId,
  inventoryitem_id: number,
  uses_remaining: number | undefined | null,
  is_identified: boolean,
) {
  // for (let i = 0; i < actions.length; i++) {
  // let action = actions[i];
  const spell = getSpellByActionId(action_id);
  // if (action.id === action_id) {
  const spell_clone = {} as Spell;
  clone_action(spell, spell_clone);
  spell_clone.inventoryitem_id = inventoryitem_id;
  spell_clone.uses_remaining =
    uses_remaining != null ? uses_remaining : undefined;
  spell_clone.deck_index = deck.length;
  spell_clone.is_identified = is_identified;
  deck.push(spell_clone);
  // break;
  // }
  // }
}

// eslint-disable-next-line
export function _play_permanent_card(
  action_id: ActionId,
  always_cast_index: AlwaysCastWandIndex,
) {
  OnPlayPermanentCard(action_id, c, always_cast_index);
  // for (let i = 0; i < actions.length; i++) {
  // let action = actions[i];
  const action = getSpellByActionId(action_id);
  // if (action.id === action_id) {
  const action_clone = {} as Spell;
  action_clone.always_cast_index = always_cast_index;
  playing_permanent_card = true;
  clone_action(action, action_clone);
  action_clone.permanently_attached = true;
  action_clone.uses_remaining = -1;
  handle_mana_addition(action_clone);
  play_action(action_clone);

  playing_permanent_card = false;
  // break;
  // }
  // }
}

// function _change_action_uses_remaining(
//   inventoryitem_id: number,
//   uses_remaining: number,
// ) {
//   let applied = false;

//   const apply = (arr: Action[]) => {
//     if (applied) {
//       return;
//     }

//     for (let i = 0; i < actions.length; i++) {
//       let action = arr[i];
//       if (action.inventoryitem_id === inventoryitem_id) {
//         action.uses_remaining = uses_remaining;
//         applied = true;
//         break;
//       }
//     }
//   };
//
//   apply(deck);
//   apply(discarded);
//   apply(hand);
// }

export function _add_extra_modifier_to_shot(name: ExtraModifier) {
  if (!extraModifiers[name]) {
    console.log(
      "_add_extra_modifier_to_shot() - function '" +
        name +
        "' not found in gun_extra_modifiers.lua",
    );
    return;
  }

  active_extra_modifiers.push(name);
}

// custom
export function call_action(
  source: ActionSource,
  spell: Spell,
  c: GunActionState,
  recursion?: number,
  iteration?: number,
) {
  OnCallActionPre(source, spell, c, recursion, iteration);
  const returnValue = spell.action(c, recursion, iteration);
  OnActionFinished(
    source,
    spell,
    c,
    recursion,
    iteration,
    returnValue as number | undefined,
  );
  return returnValue;
}

// custom mock for find_the_wand_held() in gun_action_utils
export function find_the_wand_held(caster_entity: EntityId) {
  return 1;
}
