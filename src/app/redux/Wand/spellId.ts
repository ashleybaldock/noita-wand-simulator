import { isNotNullOrUndefined } from '../../util';
import { ActionId, isValidActionId } from '../../calc/actionId';

export type SpellId = ActionId | string | null;

export function isKnownSpell(spellId: SpellId): spellId is ActionId {
  return isNotNullOrUndefined(spellId) && isValidActionId(spellId);
}
