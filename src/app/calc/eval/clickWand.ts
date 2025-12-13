import { getSpellByActionId } from '../spells';
import {
  _add_card_to_deck,
  _clear_deck,
  _draw_actions_for_shot,
  _play_permanent_card,
  _set_gun,
  _start_shot,
  mana as gunMana,
  state_from_game,
} from '../gun';
import { isValidActionId } from '../actionId';
import type { WandShotResult } from './WandShot';
import { AlwaysCastIndicies } from '../../redux/WandIndex';
import { serializeClickWandResult } from './serialize';
import { startTimer, type ChangeFields } from '../../util';
import type { SimulationResult } from './SimulationResult';
import { beginObservation } from './beginObservation';
import type { SimulationConfig } from './ClickWandSetup';
import { resetSimulationState } from './SimulationState';

export type SerializedClickWandResult = ChangeFields<
  SimulationResult,
  {
    shots: WandShotResult[];
  }
>;

export const clickWand = ({
  simulationRequestId,
  wand,
  spellIds,
  alwaysCastSpellIds,
  zetaSpellId,
  req_enemies,
  req_projectiles,
  req_hp,
  req_half,
  rng_frameNumber,
  rng_worldSeed,
  wand_available_mana,
  wand_cast_delay,
  endSimulationOnShotCount = 30,
  endSimulationOnReloadCount = 1,
  endSimulationOnRefreshCount = 2,
  limitSimulationIterations = 200,
  limitSimulationDuration = 5000,
}: SimulationConfig): SerializedClickWandResult => {
  const getElapsedTime = startTimer();

  const spells = spellIds.map((id) =>
    isValidActionId(id) ? getSpellByActionId(id) : null,
  );
  const alwaysCastSpells = alwaysCastSpellIds.flatMap((id) =>
    isValidActionId(id) ? getSpellByActionId(id) : [],
  );
  const zetaSpell = isValidActionId(zetaSpellId)
    ? getSpellByActionId(zetaSpellId)
    : undefined;

  const { result, state } = resetSimulationState(
    {
      wand_available_mana,
      req_enemies,
      req_projectiles,
      req_hp,
      req_half,
      rng_frameNumber,
      rng_worldSeed,
    },
    simulationRequestId,
  );

  /* No spells makes for an easy simulation */
  if (
    spells.filter((s) => s != null).length === 0 &&
    alwaysCastSpells.length === 0
  ) {
    result.endConditions.push('noSpells');
  }

  const endObservation = beginObservation(result, state);

  try {
    _set_gun(wand);
    _clear_deck(/*false*/);

    spells.forEach(
      (spell, index) =>
        spell && _add_card_to_deck(spell.id, index, spell.uses_remaining, true),
    );

    let simIterations = 0;

    while (result.endConditions.length === 0) {
      result.shotCount++;
      state_from_game.fire_rate_wait = wand_cast_delay;

      console.debug(
        `shot#${result.shotCount}->_start_shot(): mana: ${state.wand_available_mana}, cast_delay: ${wand_cast_delay}`,
      );

      /* Simulate shot */
      _start_shot(state.wand_available_mana);

      alwaysCastSpells.forEach((spell, i) => {
        _play_permanent_card(spell.id, AlwaysCastIndicies[i]);
      });

      _draw_actions_for_shot(true);
      /* End Simulate shot */

      state.currentShot.actionCalls = state.calledActions!;
      state.currentShot.actionCallTrees = state.rootNodes;
      state.currentShot.manaDrain = state.wand_available_mana - gunMana;
      console.debug(
        `shot#${result.shotCount}, .manaDrain: ${state.currentShot.manaDrain} (${state.wand_available_mana} - ${gunMana})`,
      );
      result.shots.push(state.currentShot);
      state.wand_available_mana = gunMana;

      result.elapsedTime = getElapsedTime();

      console.debug(result);
      /* Check for end conditions */
      if (result.shotCount >= endSimulationOnShotCount) {
        // result.endConditions.push('shotCount');
      }
      if (result.reloadCount >= endSimulationOnReloadCount) {
        result.endConditions.push('reloadCount');
      }
      if (result.refreshCount >= endSimulationOnRefreshCount) {
        result.endConditions.push('refreshCount');
      }
      // if (result.repeatCount >= endSimulationOnRepeatCount) {
      //   result.endConditions.push('repeatCount');
      // }
      if (simIterations++ >= limitSimulationIterations) {
        result.endConditions.push('iterationCount');
      }
      if (result.elapsedTime >= limitSimulationDuration) {
        result.endConditions.push('timeout');
      }

      // if (
      //   fireUntil === 'refresh' &&
      //   (calledActions!.length === 0 ||
      //     calledActions!.reduce(
      //       (found, a) => (a.spell.id === 'RESET' ? found + 1 : found),
      //       0,
      //     ))
      // ) {
      //   return 'refresh';
      // }
      // if (fireUntil === 'iterLimit' && result.shotCount >= shotCountLimit) {
      //   return 'iterLimit';
      // }
    }
  } catch (err) {
    console.error(err);
    result.endConditions.push('exception');
  } finally {
    endObservation();
  }

  return serializeClickWandResult(result);
};
