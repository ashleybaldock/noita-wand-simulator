import { flatMapIter } from '../../app/util';
// It would be ideal to be able to switch between the beta and release versions of actions at runtime, but that seems like excessive complexity given the current changes mostly add entirely new spells
// import * as main from './__generated__/main/spells';
import * as beta from './__generated__/beta/spells';

import { ActionId, isValidActionId } from './actionId';
import { Spell } from './spell';

export const spells = beta.spells as ReadonlyArray<Spell>;

export type ActionIdToSpellMap = Record<ActionId, Readonly<Spell>>;
export const spellByIdMap = Object.fromEntries(
  spells.reduce(
    (map, spell) => map.set(spell.id, spell),
    new Map<ActionId, Readonly<Spell>>(),
  ),
) as ActionIdToSpellMap;

export function getSpellById(id: Readonly<ActionId>) {
  return spellByIdMap[id];
}

export const unlockFlagMap = spells.reduce(
  (map, { id, spawn_requires_flag = 'none' }) =>
    map.set(spawn_requires_flag, [
      ...(map.get(spawn_requires_flag)?.values() ?? []),
    ]),
  new Map<string, ActionId[]>(),
);
export const unlockFlags = [...unlockFlagMap.keys()] as const;
export type UnlockFlag = typeof unlockFlags[number];

export const recursiveActionIdSet: Set<ActionId> = new Set<ActionId>(
  flatMapIter<Spell, ActionId>(spells.values(), (spell: Spell) =>
    isValidActionId(spell.id) && spell?.recursive ? [spell.id] : [],
  ),
);

export const recursiveActionIds = [...recursiveActionIdSet] as const;

export type RecursiveActionId = Extract<
  typeof recursiveActionIds[number],
  ActionId
>;
