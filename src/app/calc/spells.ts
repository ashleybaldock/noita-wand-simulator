import { flatMapIter } from '../../app/util/iterTools';
// It would be ideal to be able to switch between the beta and release versions of actions at runtime, but that seems like excessive complexity given the current changes mostly add entirely new spells
import * as main from './__generated__/main/spells';
// import * as beta from './__generated__/beta/spells';

import type { ActionId } from './actionId';
import type { Spell } from './spell';
import { isNotNullOrUndefined } from '../util';

export const spells = main.spells as ReadonlyArray<Spell>;

export type ActionIdToSpellMap = Record<ActionId, Readonly<Spell>>;
export const spellByIdMap = Object.fromEntries(
  spells.reduce(
    (map, spell) => map.set(spell.id, spell),
    new Map<ActionId, Readonly<Spell>>(),
  ),
) as ActionIdToSpellMap;

export function getSpellByActionId(id: Readonly<ActionId>) {
  return spellByIdMap[id];
}

export const unlockFlags = [
  ...new Set<string>(
    flatMapIter<Spell, string>(spells.values(), ({ spawn_requires_flag }) =>
      isNotNullOrUndefined(spawn_requires_flag) ? [spawn_requires_flag] : [],
    ),
  ),
] as const;

export const recursiveActionIds = [
  ...new Set<string>(
    flatMapIter<Spell, string>(spells.values(), ({ recursive, id }) =>
      recursive === true ? [id] : [],
    ),
  ),
] as const;
