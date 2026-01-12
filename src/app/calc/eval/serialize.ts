import { isNotNullOrUndefined } from '../../util';
import type { SerializedTree } from '../../util/MapTree';
import type { SpellDeckInfo } from '../spell';
import type { ActionCall } from './ActionCall';
import type { SimulationResult } from './SimulationResult';
import type { SerializedSimulationResult } from './clickWand';

export type EvalTree = SerializedTree<ActionCall>;

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

export const serializeSimulationResult = (
  result: SimulationResult,
): SerializedSimulationResult => ({
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
    actionCallTrees: shot.actionCallTrees.map((tree) => tree.serialize()),
  })),
});
