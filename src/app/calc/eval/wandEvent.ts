import type { AlwaysCastWandIndex } from '../../redux/WandIndex';
import type { ActionId } from '../actionId';
import type { ActionSource } from '../actionSources';
import type { GunActionState } from '../actionState';
import type { SpellDeckInfo } from '../spell';
import type { UnlockCondition } from '../unlocks';
import type { WandId } from './dispatch';

export type ComponentID = string;
export type EntityID = number;
export type InventoryItemID = number | undefined;
export type EntityTransform = [x: number, y: number];

export type WandEventBase = {
  SetProjectileConfigs: Record<string, never>;
  OnNotEnoughManaForAction: {
    mana_required: number;
    mana_available: number;
    spell: SpellDeckInfo;
  };
  OnNoUsesRemaining: {
    spell: SpellDeckInfo;
  };
  RegisterGunShotEffects: {
    recoil_knockback: number;
  };
  BeginProjectile: {
    entity_filename: string;
  };
  EndProjectile: Record<string, never>;
  BeginTriggerHitWorld: {
    entity_filename: string;
    action_draw_count: number;
  };
  BeginTriggerTimer: {
    entity_filename: string;
    action_draw_count: number;
    delay_frames: number;
  };
  BeginTriggerDeath: {
    entity_filename: string;
    action_draw_count: number;
  };
  EndTrigger: Record<string, never>;
  BaabInstruction: {
    name: string;
  };
  ActionUsesRemainingChanged: {
    item_id: InventoryItemID;
    uses_remaining: number;
    _returns: boolean;
  };
  ActionUsed: {
    itemId: InventoryItemID | undefined;
  };
  StartReload: {
    actionId: ActionId | WandId;
    reload_time: number;
  };
  RegisterGunAction: {
    s: GunActionState;
  };
  EntityGetWithTag: {
    tag: string;
    _returns: EntityID[];
  };
  GetUpdatedEntityID: {
    actionId: ActionId | WandId;
    _returns: EntityID;
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
  OnActionPlayed: {
    spell: Readonly<SpellDeckInfo>;
    c: GunActionState;
    playing_permanent_card: boolean;
  };
  OnPlayPermanentCard: {
    actionId: ActionId | WandId;
    c: GunActionState;
    always_cast_index?: AlwaysCastWandIndex;
  };
  OnSetDontDraw: Record<string, never>;
  OnUnsetDontDraw: Record<string, never>;
  OnDraw: {
    state_cards_drawn: number;
  };
  OnWrap: {
    deck: readonly SpellDeckInfo[];
    hand: readonly SpellDeckInfo[];
    discarded: readonly SpellDeckInfo[];
  };
  OnCantWrap: Record<string, never>;
  OnMoveDiscardedToDeck: {
    discarded: readonly SpellDeckInfo[];
  };
  OnActionCalled: {
    source: ActionSource;
    spell: Readonly<SpellDeckInfo>;
    c: GunActionState;
    recursion?: number;
    iteration?: number;
  };
  OnActionFinished: {
    source: string;
    spell: Readonly<SpellDeckInfo>;
    c: GunActionState;
    recursion?: number;
    iteration?: number;
    returnValue?: number;
  };
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
  // ConfigGunActionInfo_Create: {
  //   _returns: GunActionState;
  // };
  // ConfigGunActionInfo_Init: {
  //   source: GunActionState;
  //   _returns: GunActionState;
  // };
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

export type WandEventName = keyof WandEventRecord;
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
