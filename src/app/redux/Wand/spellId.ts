import { isNotNullOrUndefined } from '../../util';
import type { ActionId } from '../../calc/actionId';
import { isValidActionId } from '../../calc/actionId';

type UnknownSpellId = string;
export type SpellId = ActionId | UnknownSpellId | null;

export function isKnownSpell(spellId: SpellId): spellId is ActionId {
  return isNotNullOrUndefined(spellId) && isValidActionId(spellId);
}
