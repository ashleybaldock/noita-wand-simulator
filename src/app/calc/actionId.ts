// It would be ideal to be able to switch between the beta and release versions of actions at runtime, but that seems like excessive complexity given the current changes mostly add entirely new spells

import * as main from './__generated__/main/actionIds';
import { isNotNullOrUndefined, isString } from '../util';
import type { CustomActionId } from './customActionIds';
import { customActionIds } from './customActionIds';
// import * as beta from './__generated__/beta/actionIds';

export type ActionId = main.ActionId | CustomActionId;

export const actionIdSet: Set<ActionId> = new Set([
  ...main.actionIds,
  ...customActionIds,
]);

export const isValidActionId = (id: unknown): id is ActionId =>
  isString(id) && (actionIdSet as Set<string>).has(id);

// TODO - derive this info automatically based on gun_actions
const withTriggerActionIds = [
  'ADD_TRIGGER',
  'BUBBLESHOT_TRIGGER',
  'BULLET_TRIGGER',
  'GRENADE_TRIGGER',
  'HEAVY_BULLET_TRIGGER',
  'LIGHT_BULLET_TRIGGER',
  'LIGHT_BULLET_TRIGGER_2',
  'SLOW_BULLET_TRIGGER',
] as const;
export type WithTriggerActionId = Extract<
  (typeof withTriggerActionIds)[number],
  ActionId
>;
const withTriggerActionIdSet: Set<WithTriggerActionId> = new Set(
  withTriggerActionIds.flatMap((id) => (isValidActionId(id) ? id : [])),
);
export function isWithTriggerActionId(
  actionId?: ActionId,
): actionId is WithTriggerActionId {
  return (
    isNotNullOrUndefined(actionId) &&
    (withTriggerActionIdSet as Set<ActionId>).has(actionId)
  );
}

const withTimerActionIds = [
  'LASER_LUMINOUS_DRILL',
  'LIGHT_BULLET_TIMER',
  'HEAVY_BULLET_TIMER',
  'ADD_TIMER',
  'TENTACLE_TIMER',
  'BULLET_TIMER',
  'SPITTER_TIMER',
  'SPITTER_TIER_2_TIMER',
  'SPITTER_TIER_3_TIMER',
  'SLOW_BULLET_TIMER',
  'BOUNCY_ORB_TIMER',
  'FAKE_TIMER',
] as const;
export type WithTimerActionId = Extract<
  (typeof withTimerActionIds)[number],
  ActionId
>;
const withTimerActionIdSet: Set<WithTimerActionId> = new Set(
  withTimerActionIds.flatMap((id) => (isValidActionId(id) ? id : [])),
);
export function isWithTimerActionId(
  actionId?: ActionId,
): actionId is WithTimerActionId {
  return (
    isNotNullOrUndefined(actionId) &&
    (withTimerActionIdSet as Set<ActionId>).has(actionId)
  );
}

const withExpirationActionIds = [
  'ADD_DEATH_TRIGGER',
  'BLACK_HOLE_DEATH_TRIGGER',
  'MINE_DEATH_TRIGGER',
  'PIPE_BOMB_DEATH_TRIGGER',
  'SUMMON_HOLLOW_EGG',
  'DELAYED_SPELL',
  'LONG_DISTANCE_CAST',
  'SUPER_TELEPORT_CAST',
  'TELEPORT_CAST',
  'FAKE_DEATH_TRIGGER',
] as const;
export type WithExpirationActionId = Extract<
  (typeof withExpirationActionIds)[number],
  ActionId
>;
const withExpirationActionIdSet: Set<WithExpirationActionId> = new Set(
  withExpirationActionIds.flatMap((id) => (isValidActionId(id) ? id : [])),
);
export function isWithExpirationActionId(
  actionId?: ActionId,
): actionId is WithExpirationActionId {
  return (
    isNotNullOrUndefined(actionId) &&
    (withExpirationActionIdSet as Set<ActionId>).has(actionId)
  );
}

const iterativeActionIds = [
  'DIVIDE_2',
  'DIVIDE_3',
  'DIVIDE_4',
  'DIVIDE_10',
  'DIVIDE_12',
] as const;

export type IterativeActionId = Extract<
  (typeof iterativeActionIds)[number],
  ActionId
>;
const iterativeActionIdSet: Set<IterativeActionId> = new Set(
  iterativeActionIds.flatMap((id) => (isValidActionId(id) ? id : [])),
);

export function isIterativeActionId(
  actionId: ActionId,
): actionId is IterativeActionId {
  return (iterativeActionIdSet as Set<ActionId>).has(actionId);
}

export const greekActionIds = [
  'ALPHA',
  'GAMMA',
  'TAU',
  'OMEGA',
  'MU',
  'PHI',
  'SIGMA',
  'ZETA',
  'KAPPA',
] as const;

export type GreekActionId = Extract<(typeof greekActionIds)[number], ActionId>;

const greekActionIdSet: Set<string> = new Set(
  greekActionIds.filter(isValidActionId),
);

export function isGreekActionId(actionId: ActionId): actionId is GreekActionId {
  return greekActionIdSet.has(actionId);
}
