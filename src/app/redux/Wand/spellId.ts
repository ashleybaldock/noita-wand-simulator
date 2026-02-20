import { isNotNullOrUndefined } from '../../util';
import type { ActionId } from '../../calc/actionId';
import { isValidActionId } from '../../calc/actionId';

type UnknownSpellId = string;
export type SpellId = ActionId | UnknownSpellId | null;

export const matchNonSpellIdChars = /[^A-Z0-9_]/gi;

export const isKnownSpell = (spellId: SpellId): spellId is ActionId => {
  return isNotNullOrUndefined(spellId) && isValidActionId(spellId);
};
