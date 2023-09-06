// It would be ideal to be able to switch between the beta and release versions of actions at runtime, but that seems like excessive complexity given the current changes mostly add entirely new spells

// import * as main from './__generated__/main/actionIds';
import * as beta from './__generated__/beta/actionIds';

export type ActionId = beta.ActionId;

export const actionIdSet: Set<ActionId> = new Set(beta.actionIds);

export function isValidActionId(id: string): id is ActionId {
  return (actionIdSet as Set<string>).has(id);
}

const iterativeActionIds = [
  'DIVIDE_2',
  'DIVIDE_3',
  'DIVIDE_4',
  'DIVIDE_10',
  'DIVIDE_12',
] as const;

export type IterativeActionId = Extract<
  typeof iterativeActionIds[number],
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

export const spellIterationLimits: Record<IterativeActionId, number> = {
  DIVIDE_2: 4,
  DIVIDE_3: 3,
  DIVIDE_4: 3,
  DIVIDE_10: 2,
} as const;

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
