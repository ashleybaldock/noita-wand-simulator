import type { GunActionState } from '../actionState';
import type { Spell, SpellDeckInfo } from '../spell';
import type { ActionId } from '../actionId';
import type { ActionSource } from '../actionSources';
import type {
  ComponentID,
  EntityID,
  EntityTransform,
  InventoryItemID,
} from './wandEvent';
import {
  Random as RandomExt,
  SetRandomSeed as SetRandomSeedExt,
} from '../lua/random';
import { observer } from './wandObserver';

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
  item_id: InventoryItemID,
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

export const EntityGetComponent = (
  entity_id: EntityID,
  component: string,
): ComponentID[] => {
  return observer.onEvent({
    name: 'EntityGetComponent',
    default: [component],
    payload: {
      entity_id,
      component,
    },
  });
};

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

export const EntityGetTransform = (
  actionId: ActionId,
  entity: EntityID,
): EntityTransform => {
  return observer.onEvent({
    name: 'EntityGetTransform',
    default: [0, 0],
    payload: { actionId, entity },
  });
};

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
export function GlobalsGetValue(key: string, defaultValue: string): string {
  return observer.onEvent({
    name: 'GlobalsGetValue',
    default: defaultValue,
    payload: { key, defaultValue },
  });
}

/* At time of writing, this is only used by Requirement: Every Other */
export function GlobalsSetValue(key: string, value: string): void {
  observer.onEvent({ name: 'GlobalsSetValue', payload: { key, value } });
}

export function OnActionPlayed(
  spell: Readonly<Spell>,
  c: GunActionState,
  playing_permanent_card: boolean,
): void {
  observer.onEvent({
    name: 'OnActionPlayed',
    payload: { spell, c, playing_permanent_card },
  });
}

// custom

export const OnDraw = (state_cards_drawn: number): void => {
  observer.onEvent({ name: 'OnDraw', payload: { state_cards_drawn } });
};

export const OnUnsetDontDraw = (): void => {
  observer.onEvent({ name: 'OnUnsetDontDraw', payload: {} });
};
export const OnSetDontDraw = (): void => {
  observer.onEvent({ name: 'OnSetDontDraw', payload: {} });
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

export function ConfigGunActionInfo_PassToGame(value: GunActionState) {
  RegisterGunAction(value);
}

// export function ConfigGunActionInfo_Create() {
//   return observer.onEvent({
//     name: 'ConfigGunActionInfo_Create',
//     default: { ...defaultGunActionState },
//     payload: {},
//   });
// }

// export function ConfigGunActionInfo_Init(source: GunActionState) {
//   observer.onEvent({
//     name: 'ConfigGunActionInfo_Init',
//     payload: { source },
//   });
// const fromSource = isNotNullOrUndefined(source)
//   ? source
//   : defaultGunActionState;
// return ConfigGunActionInfo_Copy(fromSource, { ...defaultGunActionState });
// }
