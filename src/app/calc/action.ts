import { mapIter } from '../../app/util';
// It would be ideal to be able to switch between the beta and release versions of actions at runtime, but that seems like excessive complexity given the current changes mostly add entirely new spells
// import * as main from './__generated__/main/action';
import * as beta from './__generated__/beta/action';

import { ActionId, isValidActionId } from './actionId';

export const spells = spellsBeta as ReadonlyArray<Spell>;

export type ActionIdToSpellMap = Record<ActionId, Readonly<Spell>>;
export const spellByIdMap = Object.fromEntries(
  spells.reduce(
    (map, spell) => map.set(spell.id, spell),
    new Map<ActionId, Readonly<Spell>>(),
  ),
) as ActionIdToSpellMap;

export function getSpellById(id: ActionId) {
  return spellByIdMap[id];
}

export const unlockFlags = [
  ...new Set<string>(
    mapIter<Spell, string>(spells.values(), ({ spawn_requires_flag }) =>
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
