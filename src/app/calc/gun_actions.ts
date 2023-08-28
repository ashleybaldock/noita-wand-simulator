import { Action } from '../calc';
import { mapIter } from '../../app/util';
// It would be ideal to be able to switch between the beta and release versions of actions at runtime, but that seems like excessive complexity given the current changes mostly add entirely new spells
// import { actions as actionsRelease } from './__generated__/gun_actions';
import {
  actions as actionsBeta,
  ActionId as ActionIdBeta,
} from './__generated__/gun_actions.beta';

export type ActionId = ActionIdBeta;

export const actions = actionsBeta as ReadonlyArray<Action>;

export type ActionIdToActionMap = Record<ActionId, Readonly<Action>>;

export const actionByIdMap = Object.fromEntries(
  actions.reduce(
    (map, action) => map.set(action.id, action),
    new Map<ActionId, Readonly<Action>>(),
  ),
) as ActionIdToActionMap;

export function getActionById(id: ActionId) {
  return actionByIdMap[id];
}

export function isValidActionId(id: string): id is ActionId {
  return Object.prototype.hasOwnProperty.call(actionByIdMap, id);
}

export const iterativeActionIds = [
  'DIVIDE_2',
  'DIVIDE_3',
  'DIVIDE_4',
  'DIVIDE_10',
  'DIVIDE_12',
] as const;

export type IterativeAction = Extract<
  typeof iterativeActionIds[number],
  ActionId
>;

const iterativeActionIdSet: Set<string> = new Set(
  iterativeActionIds.filter(isValidActionId),
);
// console.log(iterativeActionIdSet);

export function isIterativeActionId(
  actionId: ActionId,
): actionId is IterativeAction {
  return iterativeActionIdSet.has(actionId);
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

export type GreekActionId = Extract<typeof greekActionIds[number], ActionId>;

const greekActionIdSet: Set<string> = new Set(
  greekActionIds.filter(isValidActionId),
);

export function isGreekActionId(actionId: ActionId): actionId is GreekActionId {
  return greekActionIdSet.has(actionId);
}

export const unlockFlags = [
  ...new Set<string>(
    mapIter<Action, string>(actions.values(), ({ spawn_requires_flag }) =>
      spawn_requires_flag !== undefined
        ? {
            val: spawn_requires_flag ?? '',
            ok: true,
          }
        : { ok: false },
    ),
  ),
] as const;

export const recursiveActions = [
  ...new Set<string>(
    mapIter<Action, string>(actions.values(), ({ recursive, id }) =>
      recursive === true
        ? {
            val: id,
            ok: true,
          }
        : {
            ok: false,
          },
    ),
  ),
] as const;
