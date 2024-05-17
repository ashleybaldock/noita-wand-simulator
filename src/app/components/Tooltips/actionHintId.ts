import { isNotNullOrUndefined, objectKeys } from '../../util';

const actionHintDefinition = {
  'actionhint-copywiki': {
    desc: 'Copies the current wand to the clipboard as a Wiki template.',
  },
} as const;

export type ActionHintId = keyof typeof actionHintDefinition;
type ActionHintInfo = {
  desc: string;
};

export type ActionHintInfoRecord = Readonly<
  Record<ActionHintId, Readonly<ActionHintInfo>>
>;

export const actionHintInfoRecord =
  actionHintDefinition as ActionHintInfoRecord;

export const getActionHintDescription = (actionHintId?: ActionHintId) =>
  isNotNullOrUndefined(actionHintId)
    ? actionHintDefinition[actionHintId].desc
    : 'Unknown ActionHint';

const actionHintIdSet: Set<ActionHintId> = new Set(
  objectKeys(actionHintDefinition),
);

export function isValidActionHintId(id: string): id is ActionHintId {
  return (actionHintIdSet as Set<string>).has(id);
}
