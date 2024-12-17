import { isNotNullOrUndefined } from '../../util';
import type { SerialisedMapTree } from '../../util/MapTree';
import { mapTreeToMap } from '../../util/MapTree';
import type { SpellDeckInfo } from '../spell';
import type { ActionCall } from './ActionCall';
import type { ClickWandResult } from './ClickWandResult';
import type { SerializedClickWandResult } from './clickWand';

export type EvalTree = SerialisedMapTree<ActionCall>;

export const serializeSpell = (spell: SpellDeckInfo) => ({
  id: spell?.id,
  deck_index: spell?.deck_index,
  permanently_attached: spell?.permanently_attached ?? false,
  always_cast_index: spell?.always_cast_index,
});

const maybeSerializeSpell = (spell?: SpellDeckInfo) =>
  isNotNullOrUndefined(spell) ? serializeSpell(spell) : undefined;

/**
 *  Spell -> SpellDeckInfo
 *
 */

export const serializeClickWandResult = (
  result: ClickWandResult,
): SerializedClickWandResult => ({
  ...result,
  shots: result.shots.map((shot) => ({
    ...shot,
    projectiles: shot.projectiles.map((projectile) => ({
      ...projectile,
      spell: maybeSerializeSpell(projectile.spell),
      proxy: maybeSerializeSpell(projectile.proxy),
    })),
    actionCallGroups: shot.actionCalls.map((actionCallGroup) => ({
      ...actionCallGroup,
      spell: serializeSpell(actionCallGroup.spell),
      wrappingInto: (actionCallGroup.wrappingInto ?? []).map((wrapInto) =>
        serializeSpell(wrapInto),
      ),
    })),
    actionCallTrees: shot.actionCallTrees.map(mapTreeToMap),
  })),
});
