import {
  Random as RandomExt,
  SetRandomSeed as SetRandomSeedExt,
} from '../lua/random';
import { GunActionState } from '../actionState';
import { Spell, SpellDeckInfo } from '../spell';
import { ActionId } from '../actionId';
import { ActionSource } from '../actionSources';
import { noop } from '../../util';

export type ComponentID = string;
export type EntityID = number;
export type Entity = object;
export type InventoryItemID = number;
export type Component = object;

type WandEventBase = {
  SetProjectileConfigs: {};
  OnNotEnoughManaForAction: {};
  RegisterGunShotEffects: {
    recoil_knockback: number;
  };
  BeginProjectile: {
    entityFilename: string;
  };
  EndProjectile: {};
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
  EndTrigger: {};
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
    actionId: ActionId;
    _returns: EntityID;
  };
  EntityGetComponent: {
    entity_id: EntityID;
    component: string;
    _returns: ComponentID[];
  };
  EntityGetFirstComponent: {
    actionId: ActionId;
    entity_id: EntityID;
    component: string;
    _returns: ComponentID;
  };
  EntityGetFirstComponentIncludingDisabled: {
    actionId: ActionId;
    entity_id: EntityID;
    component: string;
    _returns: ComponentID;
  };
  ComponentGetValue2: {
    actionId: ActionId;
    component_id: string;
    key: string;
    _returns: number;
  };
  ComponentSetValue2: {
    component: ComponentID;
    key: string;
    value: number;
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
    actionId: ActionId;
    entity: EntityID;
    _returns: [number, number];
  };
  EntityLoad: {
    entityXml: string;
    x: number;
    y: number;
    _returns: EntityID;
  };
  EntityGetAllChildren: {
    actionId: ActionId;
    entityId: EntityID;
    _returns: EntityID[];
  };
  EntityGetName: {
    actionId: ActionId;
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
  OnActionPlayed: {
    actionId: ActionId;
  };
  OnDraw: {
    state_cards_drawn: number;
  };
  OnMoveDiscardedToDeck: {
    discarded: readonly SpellDeckInfo[];
  };
  OnActionCalled: {
    source: ActionSource;
    spell: Readonly<Spell>;
    c: GunActionState;
    recursion?: number;
    iteration?: number;
  };
  OnActionFinished: {
    source: string;
    spell: Readonly<Spell>;
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

// const overrides: Overrides<
//   WandEventOverride,
//   WandEventOverrideRecord,
//   OverridableWandEventName,
//   WandEventOverrideCb
// > = (() => {
//   const contents: Partial<Record<OverridableWandEventName, WandEventOverride>> =
//     {};
//   return {
//     clear: function () {
//       objectKeys(contents).forEach((key) => delete contents[key]);
//       return this;
//     },
//     delete: function (key) {
//       delete contents[key];
//       return this;
//     },
//     set: function (key, val) {
//       contents[key] = val;
//       return this;
//     },
//     get: function (key) {
//       return contents[key] as WandEventOverrideRecord[OverridableWandEventName];
//     },
//     getCb: function (key) {
//       return contents[key]?.callback as WandEventOverrideCb;
//     },
//     has: function (testKey) {
//       return (
//         contents.hasOwnProperty(testKey) &&
//         isNotNullOrUndefined(contents[testKey])
//       );
//     },
//   };
// })();

// export function override(override: WandEventOverride) {
//   overrides.set(override.name, override);
//   return () => {
//     overrides.delete(override.name);
//   };
// }

// const isOverridableWandEvent = (
//   wandEvent: WandEvent,
// ): wandEvent is OverridableWandEvent => isNotNullOrUndefined(wandEvent.default);

// function onEvent<W extends WandEvent>(wandEvent: W) {
//   listeners.forEach((c) => c(wandEvent));

//   if (isOverridableWandEvent(wandEvent)) {
//     const override = overrides.getCb(wandEvent.name);
//     if (isNotNullOrUndefined(override)) {
//       return override(wandEvent.payload);
//     }
//     return wandEvent.default;
//   }
// }
// function onOverrideableEvent(wandEvent: WandEvent) {
//   onEvent(wandEvent);
// const cb = overrides.get(wandEvent.name);
// if (isNotNullOrUndefined(cb)) {
// cb.callback(wandEvent['name'], wandEvent);
// }
// }
// ext functions

export type WandObserverCb = <W extends WandEvent>(payload: W) => W['default'];
export const observer = (() => {
  let listener: WandObserverCb = noop;
  const remove = () => (listener = noop);
  return {
    subscribe: (callback: WandObserverCb) => {
      listener = callback;
      return () => listener === callback && remove();
    },
    onEvent: <W extends WandEvent>(wandEvent: W) => listener(wandEvent),
  };
})();

export function SetProjectileConfigs(): void {
  observer.onEvent({ name: 'SetProjectileConfigs', payload: {} });
}

export function OnNotEnoughManaForAction(): void {
  observer.onEvent({ name: 'OnNotEnoughManaForAction', payload: {} });
}

export function RegisterGunShotEffects(recoil_knockback: number): void {
  observer.onEvent({
    name: 'RegisterGunShotEffects',
    payload: { recoil_knockback },
  });
}

export function BeginProjectile(entity_filename: string): void {
  observer.onEvent({
    name: 'BeginProjectile',
    payload: { entityFilename: entity_filename },
  });
}

export function EndProjectile(): void {
  observer.onEvent({ name: 'EndProjectile', payload: {} });
}

export function BeginTriggerTimer(
  entity_filename: string,
  action_draw_count: number,
  delay_frames: number,
): void {
  observer.onEvent({
    name: 'BeginTriggerTimer',
    payload: {
      entity_filename,
      action_draw_count,
      delay_frames,
    },
  });
}

export function BeginTriggerHitWorld(
  entity_filename: string,
  action_draw_count: number,
) {
  observer.onEvent({
    name: 'BeginTriggerHitWorld',
    payload: { entity_filename, action_draw_count },
  });
}

export function BeginTriggerDeath(
  entity_filename: string,
  action_draw_count: number,
) {
  observer.onEvent({
    name: 'BeginTriggerDeath',
    payload: { entity_filename, action_draw_count },
  });
}

export function EndTrigger() {
  observer.onEvent({ name: 'EndTrigger', payload: {} });
}

export function BaabInstruction(name: string) {
  observer.onEvent({ name: 'BaabInstruction', payload: { name } });
}

export function ActionUsesRemainingChanged(
  item_id: any,
  uses_remaining: number,
): boolean {
  return observer.onEvent({
    name: 'ActionUsesRemainingChanged',
    default: false,
    payload: {
      item_id,
      uses_remaining,
    },
  });
}

export function ActionUsed(item_id: InventoryItemID | undefined) {
  observer.onEvent({ name: 'ActionUsed', payload: { itemId: item_id } });
}

export function StartReload(reload_time: number): void {
  observer.onEvent({ name: 'StartReload', payload: { reload_time } });
}

export function RegisterGunAction(s: GunActionState): void {
  observer.onEvent({ name: 'RegisterGunAction', payload: { s } });
}

export function EntityGetWithTag(tag: string): EntityID[] {
  return observer.onEvent({
    name: 'EntityGetWithTag',
    default: [],
    payload: { tag },
  });
}

export function GetUpdatedEntityID(actionId: ActionId): EntityID {
  return observer.onEvent({
    name: 'GetUpdatedEntityID',
    default: 0,
    payload: { actionId },
  });
}

export function EntityGetComponent(
  entity_id: EntityID,
  component: string,
): ComponentID[] {
  return observer.onEvent({
    name: 'EntityGetComponent',
    default: [component],
    payload: {
      entity_id,
      component,
    },
  });
}

export function EntityGetFirstComponent(
  actionId: ActionId,
  entity_id: EntityID,
  component: string,
): ComponentID {
  return observer.onEvent({
    name: 'EntityGetFirstComponent',
    default: '',
    payload: {
      actionId,
      entity_id,
      component,
    },
  });
}

export function EntityGetFirstComponentIncludingDisabled(
  actionId: ActionId,
  entity_id: EntityID,
  component: string,
): ComponentID {
  return observer.onEvent({
    name: 'EntityGetFirstComponentIncludingDisabled',
    default: '',
    payload: {
      actionId,
      entity_id,
      component,
    },
  });
}

const componentValues: { [component_id: string]: { [key: string]: number } } = {
  'dummy entity': {
    money: 1e18,
    hp: 1e18,
    money_spent: 0,
  },
};

export function ComponentGetValue2(
  actionId: ActionId,
  component_id: string,
  key: string,
): number {
  return observer.onEvent({
    name: 'ComponentGetValue2',
    default: componentValues['dummy entity'][key],
    payload: { actionId, component_id, key },
  });
}

export function ComponentSetValue2(
  component: ComponentID,
  key: string,
  value: number,
): void {
  observer.onEvent({
    name: 'ComponentSetValue2',
    payload: { component, key, value },
  });
}

export function EntityInflictDamage(
  entityId: EntityID,
  selfDamage: number,
  damageType: string,
  actionString: string,
  arg1: string,
  arg2: number,
  arg3: number,
  entityId2: EntityID,
): void {
  observer.onEvent({
    name: 'EntityInflictDamage',
    payload: {
      entityId,
      selfDamage,
      damageType,
      actionString,
      arg1,
      arg2,
      arg3,
      entityId2,
    },
  });
}

export function EntityGetTransform(
  actionId: ActionId,
  entity: EntityID,
): [number, number] {
  return observer.onEvent({
    name: 'EntityGetTransform',
    default: [0, 0],
    payload: { actionId, entity },
  });
}

// Currently only used by end of everything
export function EntityLoad(entityXml: string, x: number, y: number): EntityID {
  return observer.onEvent({
    name: 'EntityLoad',
    default: 0,
    payload: { entityXml, x, y },
  });
}

export function EntityGetAllChildren(
  actionId: ActionId,
  entityId: EntityID,
): EntityID[] {
  return observer.onEvent({
    name: 'EntityGetAllChildren',
    default: [],
    payload: { actionId, entityId },
  });
}

export function EntityGetName(actionId: ActionId, childId: EntityID): string {
  return observer.onEvent({
    name: 'EntityGetName',
    default: '',
    payload: { actionId, childId },
  });
}

export function EntityHasTag(entityId: EntityID, tag: string): boolean {
  return observer.onEvent({
    name: 'EntityHasTag',
    default: false,
    payload: { entityId, tag },
  });
}

export function EntityGetInRadiusWithTag(
  x: number,
  y: number,
  radius: number,
  tag: string,
): number[] {
  return observer.onEvent({
    name: 'EntityGetInRadiusWithTag',
    default: [0],
    payload: {
      x,
      y,
      radius,
      tag,
    },
  });
}

/* At time of writing, this is only used by Requirement: Every Other */
let globals: { [key: string]: string } = {};

export function GlobalsGetValue(key: string, defaultValue: string): string {
  return observer.onEvent({
    name: 'GlobalsGetValue',
    default: globals.hasOwnProperty(key) ? globals[key] : defaultValue,
    payload: { key, defaultValue },
  });
}

/* At time of writing, this is only used by Requirement: Every Other */
export function GlobalsSetValue(key: string, value: string): void {
  observer.onEvent({ name: 'GlobalsSetValue', payload: { key, value } });
}

export function OnActionPlayed(actionId: ActionId): void {
  observer.onEvent({ name: 'OnActionPlayed', payload: { actionId } });
}

// custom

export const OnDraw = (state_cards_drawn: number): void => {
  observer.onEvent({ name: 'OnDraw', payload: { state_cards_drawn } });
};

/* Each time the wand 'wraps' naturally */
export const OnMoveDiscardedToDeck = (discarded: readonly Spell[]): void => {
  observer.onEvent({
    name: 'OnMoveDiscardedToDeck',
    payload: {
      discarded: discarded.map<SpellDeckInfo>(
        ({ id, deck_index, permanently_attached }) => ({
          id,
          deck_index,
          permanently_attached,
        }),
      ),
    },
  });
};

export function OnActionCalled(
  source: ActionSource,
  spell: Readonly<Spell>,
  c: GunActionState,
  recursion?: number,
  iteration?: number,
): void {
  observer.onEvent({
    name: 'OnActionCalled',
    payload: { source, spell, c, recursion, iteration },
  });
}

export function OnActionFinished(
  source: ActionSource,
  spell: Readonly<Spell>,
  c: GunActionState,
  recursion?: number,
  iteration?: number,
  returnValue?: number,
): void {
  observer.onEvent({
    name: 'OnActionFinished',
    payload: {
      source,
      spell,
      c,
      recursion,
      iteration,
      returnValue,
    },
  });
}

export function Random(min: number, max: number): number {
  return observer.onEvent({
    name: 'Random',
    default: RandomExt(min, max),
    payload: { min, max },
  });
}

export function SetRandomSeed(a: number, b: number): void {
  SetRandomSeedExt(
    observer.onEvent({
      name: 'SetRandomSeed',
      default: 1,
      payload: { a, b },
    }),
    a,
    b,
  );
}

export function GameGetFrameNum(): number {
  return observer.onEvent({
    name: 'GameGetFrameNum',
    default: 1,
    payload: {},
  });
}
