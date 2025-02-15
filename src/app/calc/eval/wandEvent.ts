import type { AlwaysCastWandIndex } from '../../redux/WandIndex';
import type { ActionId } from '../actionId';
import type { ActionSource } from '../actionSources';
import type { GunActionState } from '../actionState';
import type { ExtraModifier } from '../extraModifiers';
import type { ProjectileId } from '../projectile';
import type { SpellDeckInfo } from '../spell';
import type { UnlockCondition } from '../unlocks';
import type { WandId } from './dispatch';

export type ComponentID = string;
export type EntityID = number;
export type InventoryItemID = number | undefined;
export type EntityTransform = [x: number, y: number];

export type WandEventBase = {
  // ConfigGunActionInfo_Create: {
  //   _returns: GunActionState;
  // };
  // ConfigGunActionInfo_Init: {
  //   source: GunActionState;
  //   _returns: GunActionState;
  // };
  BaabInstruction: {
    /* Unused ?? */ name: string;
  };
  ActionUsed: {
    actionId: ActionId | WandId;
    /* Not sure this is useful */ itemId: InventoryItemID | undefined;
  };
  SetProjectileConfigs: /* Unused ?? */ Record<string, never>;
  RegisterGunShotEffects: {
    recoil_knockback: number;
  };
  RegisterGunAction: {
    s: GunActionState;
  };

  /* Begin Sequence: Projectile */
  BeginProjectile: {
    projectileId: ProjectileId;
  };
  BeginTriggerHitWorld: {
    projectileId: ProjectileId;
    action_draw_count: number;
  };
  BeginTriggerTimer: {
    projectileId: ProjectileId;
    action_draw_count: number;
    delay_frames: number;
  };
  BeginTriggerDeath: {
    projectileId: ProjectileId;
    action_draw_count: number;
  };
  OnCreateShot: {
    num_of_cards_to_draw: number;
  };
  EndTrigger: {
    actionId: ActionId | WandId;
  };
  EndProjectile: {
    actionId: ActionId | WandId;
  };
  /* End Sequence: Projectile */

  /* Begin Sequence: Reload */
  ActionUsesRemainingChanged: {
    item_id: InventoryItemID;
    uses_remaining: number;
    _returns: boolean /* return false to cancel use reduction */;
  };
  StartReload: {
    actionId: ActionId | WandId;
    reload_time: number;
  };
  /* End Sequence: Reload */

  /* Begin Sequence: Always Cast */
  OnPlayPermanentCard: {
    /* flag: playing_permanent_card */ actionId: ActionId | WandId;
    c: GunActionState;
    always_cast_index?: AlwaysCastWandIndex;
  };
  /* OnHandleManaAddition - add mana hack for always casts */
  OnHandleManaAddition: {
    actionId: ActionId | WandId;
  };
  /* End Sequence: Always Cast */

  OnSetDontDraw: { actionId: ActionId | WandId };
  OnUnsetDontDraw: { actionId: ActionId | WandId };

  OnSetMana: { actionId: ActionId | WandId; mana: number };
  /* Begin Sequence: Draw */
  OnDraw: {
    state_cards_drawn: number;
  };
  OnWrap: {
    deck: readonly SpellDeckInfo[];
    hand: readonly SpellDeckInfo[];
    discarded: readonly SpellDeckInfo[];
  };
  OnMoveDiscardedToDeck: {
    discarded: readonly SpellDeckInfo[];
  };
  OnCantWrap: { actionId: ActionId | WandId };
  OnNotEnoughManaForAction: {
    mana_required: number;
    mana_available: number;
    spell: SpellDeckInfo;
  };
  OnNoUsesRemaining: {
    spell: SpellDeckInfo;
  };
  /* End Sequence: Draw */

  /* Begin Sequence: Action */
  OnActionPlayed: {
    actionId: ActionId | WandId;
    /* From Sequence: Draw OR Always Cast */ playing_permanent_card: boolean;
    spell: Readonly<SpellDeckInfo>;
    c: GunActionState;
  };
  /* OnSetCurrentAction */
  /**
   * Called just before execution of the next action
   */
  OnCallActionPre: {
    source: ActionSource /* __WAND__ (draw) or a previous action */;
    spell: Readonly<SpellDeckInfo>;
    c: GunActionState;
    recursion?: number;
    iteration?: number;
  };
  OnExtraModifier: {
    /* perk effects */ modifier: ExtraModifier;
    c: GunActionState;
    playing_permanent_card: boolean;
  };
  OnActionFinished: {
    source: ActionSource /* __WAND__ (draw) or a previous action */;
    spell: Readonly<SpellDeckInfo>;
    c: GunActionState;
    recursion?: number;
    iteration?: number;
    returnValue?: number;
  };
  /* End Sequence: Action */

  /* ----- Mocked API calls made by specific spells ----- */
  /* Component */
  ComponentGetValue2: {
    actionId: ActionId | WandId;
    component_id: string;
    key: string;
    _returns: number;
  };
  ComponentSetValue2: {
    component: ComponentID;
    key: string;
    value: number | boolean;
  };
  /* Entity */
  GetUpdatedEntityID: {
    actionId: ActionId | WandId;
    _returns: EntityID;
  };
  EntityGetWithTag: {
    tag: string;
    _returns: EntityID[];
  };
  EntityGetComponent: {
    entity_id: EntityID;
    component: string;
    _returns: ComponentID[];
  };
  EntityGetFirstComponent: {
    actionId: ActionId | WandId;
    entity_id: EntityID;
    component: string;
    _returns: ComponentID;
  };
  EntityGetFirstComponentIncludingDisabled: {
    actionId: ActionId | WandId;
    entity_id: EntityID;
    component: string;
    _returns: ComponentID;
  };
  EntityInflictDamage: {
    entityId: EntityID;
    selfDamage: number;
    damageType: string;
    actionString: string;
    arg1: string;
    arg2: number;
    arg3: number;
    entityId2: EntityID;
  };
  EntityGetTransform: {
    actionId: ActionId | WandId;
    entity: EntityID;
    _returns: EntityTransform;
  };
  EntityLoad: {
    entityXml: string;
    x: number;
    y: number;
    _returns: EntityID;
  };
  EntityGetAllChildren: {
    actionId: ActionId | WandId;
    entityId: EntityID;
    _returns: EntityID[];
  };
  EntityGetName: {
    actionId: ActionId | WandId;
    childId: EntityID;
    _returns: string;
  };
  EntityHasTag: {
    entityId: EntityID;
    tag: string;
    _returns: boolean;
  };
  EntityGetInRadiusWithTag: {
    x: number;
    y: number;
    radius: number;
    tag: string;
    _returns: number[];
  };
  /* Globals */
  GlobalsGetValue: {
    key: string;
    defaultValue: string;
    _returns: string;
  };
  GlobalsSetValue: {
    key: string;
    value: string;
  };
  HasFlagPersistent: {
    actionId: ActionId | WandId;
    flag: UnlockCondition;
    defaultValue: boolean;
    _returns: boolean;
  };
  /* RNG */
  Random: {
    min: number;
    max: number;
    _returns: number;
  };
  SetRandomSeed: {
    a: number;
    b: number;
    _returns: number;
  };
  GameGetFrameNum: {
    _returns: number;
  };
};

type WandEventPayloadRecord = {
  [W in keyof WandEventBase]: {
    [K in keyof WandEventBase[W] as Exclude<
      K,
      '_returns'
    >]: WandEventBase[W][K];
  };
};
type WandEventReturnTypeRecord = {
  [W in keyof WandEventBase]: WandEventBase[W] extends { _returns: unknown }
    ? WandEventBase[W]['_returns']
    : void;
};
export type WandEventRecord = {
  [K in keyof WandEventBase]: {
    name: K;
    payload: WandEventPayloadRecord[K];
    default?: WandEventReturnTypeRecord[K];
  };
};
type OverridableWandEventRecord = {
  [W in keyof WandEventRecord as WandEventReturnTypeRecord[W] extends void
    ? never
    : W]: WandEventRecord[W];
};
export type WandEventOverrideCbRecord = {
  [W in keyof OverridableWandEventRecord]: (
    payload: WandEventPayloadRecord[W],
  ) => WandEventReturnTypeRecord[W] | undefined;
};

type WandEventPayload = {
  [K in keyof WandEventPayloadRecord]: WandEventPayloadRecord[K];
}[keyof WandEventPayloadRecord];
type WandEventReturnType = {
  [K in keyof WandEventReturnTypeRecord]: WandEventReturnTypeRecord[K];
}[keyof WandEventReturnTypeRecord];
export type OverridableWandEvent = {
  [K in keyof OverridableWandEventRecord]: OverridableWandEventRecord[K];
}[keyof OverridableWandEventRecord];
export type WandEventOverrideCb = {
  [K in keyof WandEventOverrideCbRecord]: WandEventOverrideCbRecord[K];
}[keyof WandEventOverrideCbRecord];
export type WandEvent = {
  [K in keyof WandEventRecord]: WandEventRecord[K];
}[keyof WandEventRecord];

export type WandEventName = keyof WandEventBase;
export type OverridableWandEventName = keyof OverridableWandEventRecord;

export type WandEventOverrideRecord = {
  [W in keyof OverridableWandEventRecord]: {
    name: W;
    payload: WandEventPayloadRecord[W];
    default: WandEventReturnTypeRecord[W];
    callback: WandEventOverrideCbRecord[W];
  };
};
export type WandEventOverrides = {
  [K in keyof WandEventOverrideRecord]: WandEventOverrideRecord[K];
};
export type WandEventOverrideGen<W extends OverridableWandEventName> =
  WandEventOverrideRecord[W];
export type WandEventOverride = {
  [K in keyof WandEventOverrideRecord]: WandEventOverrideRecord[K];
}[keyof WandEventOverrideRecord];
export type OverridableWandEventCallback = {
  [K in keyof OverridableWandEventRecord]: {
    name: K;
    callback: (
      name: K,
      payload: WandEventPayloadRecord[K],
    ) => WandEventReturnTypeRecord[K] | undefined;
  };
}[keyof OverridableWandEventRecord];

export type WandObserverCb = <W extends WandEvent>(payload: W) => W['default'];

/* Multi-subscriber implementation */
// type Callback = (payload: WandEvent) => void;
// const listeners = new Set<Callback>();
// export function subscribe(callback: Callback) {
//   listeners.add(callback);
//   return () => listeners.delete(callback);
// }

// const overrides = new Map<OverridableWandEventName, WandEventOverride>();

// type Overrides<
//   O extends { name: K; callback: F },
//   W extends { [L in K]: O },
//   K extends keyof W,
//   F,
// > = {
//   clear: () => Overrides<O, W, K, F>;
//   delete: (key: K) => Overrides<O, W, K, F>;
//   set: (key: K, val: O) => Overrides<O, W, K, F>;
//   get: (key: K) => O | undefined;
//   getCb: (key: K) => F | undefined;
//   has: (testKey: K) => boolean;
// };
