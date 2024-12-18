import type { Spell, SpellDeckInfo } from '../spell';
import { getSpellByActionId } from '../spells';
import { observer } from './wandObserver';
import {
  _add_card_to_deck,
  _clear_deck,
  _draw_actions_for_shot,
  _play_permanent_card,
  _set_gun,
  _start_shot,
  dont_draw_actions,
  mana as gunMana,
  state_from_game,
} from '../gun';
import { isValidEntityPath, entityToActions } from '../entityLookup';
import { isIterativeActionId, isValidActionId } from '../actionId';
import { defaultGunActionState } from '../defaultActionState';
import { triggerConditionFor } from '../trigger';
import { isValidActionCallSource } from '../spellTypes';
import type { WandEvent } from './wandEvent';
import { nextActionCallSequenceId } from './ActionCall';
import type { ActionCall } from './ActionCall';
import { getShot, nextWandShotId } from './WandShot';
import type { WandShot, WandShotResult } from './WandShot';
import type { TreeNode } from '../../util/TreeNode';
import { AlwaysCastIndicies } from '../../redux/WandIndex';
import type { SimulationRequestId } from '../../redux/SimulationRequest';
import { serializeClickWandResult } from './serialize';
import type { ChangeFields } from '../../util';
import type { ClickWandResult } from './ClickWandResult';
import type { ClickWandSetup } from './ClickWandSetup';

type StartingState = {
  mana?: number;
  rng_worldSeed?: number;
  rng_frameNumber?: number;
  req_half?: boolean;
  req_hp?: boolean;
  req_projectiles?: boolean;
  req_enemies?: boolean;
};

const defaultStartingState: Required<StartingState> = {
  mana: 1000,
  rng_worldSeed: 0,
  rng_frameNumber: 1,
  req_half: false,
  req_hp: false,
  req_projectiles: false,
  req_enemies: false,
};

type ClickWandState = {
  simulationRequestId: SimulationRequestId;
  mana: number;
  currentShot: WandShot;
  parentShot: WandShot | undefined;
  currentShotStack: WandShot[];
  lastCalledAction: ActionCall | undefined;
  lastDrawnAndCalledAction: ActionCall | undefined;
  lastPlayed: Readonly<SpellDeckInfo> | undefined;
  alwaysCastsPlayed: SpellDeckInfo[];
  calledActions: ActionCall[];
  validSourceCalledActions: ActionCall[];
  currentNode: TreeNode<ActionCall> | undefined;
  rootNodes: TreeNode<ActionCall>[];
  startingState: Readonly<Required<StartingState>>;
} & Required<StartingState>;

const resetState = (
  startingState: StartingState,
  simulationRequestId: SimulationRequestId,
): {
  state: ClickWandState;
  result: ClickWandResult;
} => ({
  state: {
    ...{ ...defaultStartingState, ...startingState },
    startingState: { ...defaultStartingState, ...startingState },
    simulationRequestId: simulationRequestId,
    calledActions: [],
    validSourceCalledActions: [],
    currentShotStack: [],
    rootNodes: [],
    currentNode: undefined,
    currentShot: getShot(),
    lastCalledAction: undefined,
    lastDrawnAndCalledAction: undefined,
    lastPlayed: undefined,
    alwaysCastsPlayed: [],
    parentShot: undefined,
  },
  result: {
    simulationRequestId: simulationRequestId,
    shots: [],
    reloadTime: undefined,
    endConditions: [],
    elapsedTime: 0,
    wraps: 0,
    shotCount: 0,
    reloadCount: 0,
    refreshCount: 0,
    repeatCount: 0,
  },
});

const startTimer =
  (start = performance.now()) =>
  () =>
    performance.now() - start;

const beginObservation = (result: ClickWandResult, state: ClickWandState) =>
  observer.subscribe(({ name, payload }: WandEvent) => {
    switch (name) {
      case 'BeginProjectile': {
        const { entity_filename } = payload;

        let sourceAction =
          state.validSourceCalledActions[
            state.validSourceCalledActions.length - 1
          ]?.spell;
        let proxy: SpellDeckInfo | undefined = undefined;

        if (!sourceAction) {
          // fallback to most likely entity source if no action
          // if (!entityToActions(entity)) {
          if (
            !isValidEntityPath(entity_filename) ||
            entityToActions(entity_filename) === undefined
          ) {
            throw Error(`missing entity: ${entity_filename}`);
          }
          sourceAction = getSpellByActionId(
            entityToActions(entity_filename)?.[0],
          );
        }

        if (
          entity_filename !==
          getSpellByActionId(sourceAction.id).related_projectiles?.[0]
        ) {
          if (!entityToActions(entity_filename)) {
            throw Error(`missing entity: ${entity_filename}`);
          }

          // check for bugged actions (missing the correct related_projectile)
          if (entityToActions(entity_filename)[0] !== sourceAction.id) {
            // this probably means another action caused this projectile (like ADD_TRIGGER)
            proxy = sourceAction;
            sourceAction = getSpellByActionId(
              entityToActions(entity_filename)?.[0],
            );
          }
        }

        state.currentShot.projectiles.push({
          _typeName: 'Projectile',
          entity: entity_filename,
          spell: sourceAction,
          proxy: proxy,
          deckIndex: proxy?.deck_index || sourceAction?.deck_index,
        });
        break;
      }
      case 'BeginTriggerTimer':
      case 'BeginTriggerHitWorld':
      case 'BeginTriggerDeath': {
        // TODO type for entity_filename
        const { entity_filename, action_draw_count } = payload;
        const delay_frames =
          name === 'BeginTriggerTimer' ? payload.delay_frames : undefined;
        state.parentShot = state.currentShot;
        state.currentShotStack.push(state.currentShot);
        state.currentShot = {
          id: nextWandShotId(),
          projectiles: [],
          actionCalls: [],
          actionCallTrees: [],
          castState: { ...defaultGunActionState },
          triggerType: triggerConditionFor(name),
          triggerEntity: entity_filename,
          triggerActionDrawCount: action_draw_count,
          triggerDelayFrames: delay_frames,
          wraps: [],
        };
        state.parentShot.projectiles[
          state.parentShot.projectiles.length - 1
        ].trigger = state.currentShot.id;
        if (state.lastDrawnAndCalledAction) {
          state.lastDrawnAndCalledAction.wasLastToBeDrawnBeforeBeginTrigger =
            state.currentShot.id;
        }
        if (state.lastCalledAction) {
          state.lastCalledAction.wasLastToBeCalledBeforeBeginTrigger =
            state.currentShot.id;
        }
        break;
      }
      case 'EndTrigger': {
        state.currentShot = state.currentShotStack.pop()!;
        break;
      }
      case 'EndProjectile': {
        break;
      }
      case 'RegisterGunAction': {
        const { s: castState } = payload;
        state.currentShot.castState = Object.assign({}, castState);
        break;
      }
      case 'OnDraw': {
        const { state_cards_drawn: totalDrawn } = payload;
        if (state.currentShot.castState) {
          state.currentShot.castState.state_cards_drawn =
            (totalDrawn ??
              state.currentShot.castState?.state_cards_drawn ??
              0) + 1;
        }
        break;
      }
      case 'OnNotEnoughManaForAction': {
        const { /*mana_required, mana_available,*/ spell } = payload;
        break;
      }
      case 'OnNoUsesRemaining': {
        const { spell /*, c: castState, playing_permanent_card*/ } = payload;
        state.lastPlayed = spell;
        break;
      }
      case 'OnActionPlayed': {
        const { spell /*, c: castState, playing_permanent_card*/ } = payload;
        state.lastPlayed = spell;
        break;
      }
      case 'OnPlayPermanentCard': {
        const { actionId, always_cast_index /*, c: castState*/ } = payload;
        if (isValidActionId(actionId)) {
          state.alwaysCastsPlayed.push({ id: actionId, always_cast_index });
        }
        break;
      }
      case 'OnWrap': {
        const { deck, hand, discarded } = payload;
        result.wraps += 1;
        state.currentShot.wraps.push(result.wraps);
        if (state.lastDrawnAndCalledAction) {
          state.lastDrawnAndCalledAction.wasLastToBeDrawnBeforeWrapNr =
            result.wraps;
          state.lastDrawnAndCalledAction.wrappingInto = [...discarded];
        }
        if (state.lastCalledAction) {
          state.lastCalledAction.wasLastToBeCalledBeforeWrapNr = result.wraps;
          state.lastCalledAction.wrappingInto = [...discarded];
        }
        break;
      }
      case 'OnCantWrap': {
        break;
      }
      case 'OnMoveDiscardedToDeck': {
        const { discarded } = payload;

        break;
      }
      case 'OnCallActionPre': {
        const { source, spell /*, c: castState */, recursion, iteration } =
          payload;
        const {
          id,
          deck_index,
          permanently_attached = false,
          always_cast_index,
        } = spell;
        console.debug(`OnCallActionPre, gunMana: ${gunMana}, id: ${id}`);
        state.lastCalledAction = {
          _typeName: 'ActionCall',
          sequenceId: nextActionCallSequenceId(),
          spell: {
            id,
            deck_index,
            permanently_attached,
            always_cast_index,
          },
          source,
          manaPre: gunMana,
          currentMana: gunMana,
          deckIndex: deck_index,
          recursion: getSpellByActionId(id).recursive
            ? recursion ?? 0
            : undefined,
          iteration: isIterativeActionId(id) ? iteration ?? 1 : undefined,
          dont_draw_actions: dont_draw_actions,
        };
        if (source === 'draw') {
          state.lastDrawnAndCalledAction = state.lastCalledAction;
        }

        if (!state.currentNode) {
          state.currentNode = {
            value: state.lastCalledAction,
            children: [],
          };
          state.rootNodes.push(state.currentNode);
        } else {
          const newNode = {
            value: state.lastCalledAction,
            children: [],
            parent: state.currentNode,
          };
          state.currentNode?.children.push(newNode);
          state.currentNode = newNode;
        }
        state.calledActions.push(state.lastCalledAction);
        if (isValidActionCallSource(getSpellByActionId(spell.id).type)) {
          state.validSourceCalledActions.push(state.lastCalledAction);
        }
        break;
      }
      case 'OnActionFinished': {
        const {
          /*source*/ /*spell*/ c: castState /*recursion, iteration, returnValue*/,
        } = payload;
        state.currentShot.castState = Object.assign({}, castState);
        state.currentNode = state.currentNode?.parent;
        break;
      }
      case 'StartReload': {
        console.debug('increment reload count');
        // actionId = payload.actionId;
        result.reloadCount = result.reloadCount + 1;
        result.reloadTime = payload.reload_time;
        break;
      }

      case 'GameGetFrameNum': {
        // TODO - this ought to increment/change with each shot cycle
        return state.rng_frameNumber;
      }
      case 'SetRandomSeed': {
        return state.rng_worldSeed;
      }
      case 'EntityGetWithTag': {
        const { tag } = payload;
        if (tag === 'black_hole_giga') {
          return [0];
        }
        if (tag === 'player_unit') {
          return [];
        }
        break;
      }
      // These are used currently only by requirements
      case 'EntityGetInRadiusWithTag': {
        const { /*x, y, radius,*/ tag } = payload;
        if (tag === 'homing_target') {
          return state.req_enemies ? new Array(15) : [];
        } else if (tag === 'projectile') {
          return state.req_projectiles ? new Array(20) : [];
        }
        break;
      }
      case 'EntityGetFirstComponent': {
        const { /*entity_id,*/ component } = payload;
        if (component === 'DamageModelComponent') {
          return 'IF_HP'; // just has to be non-null
        }
        break;
      }
      case 'ComponentGetValue2': {
        const { component_id, key } = payload;
        if (component_id === 'IF_HP') {
          if (key === 'hp') {
            return state.req_hp ? 25000 / 25 : 100000 / 25;
          } else if (key === 'max_hp') {
            return 100000 / 25;
          }
        }
        break;
      }
      case 'GlobalsGetValue': {
        const { key /*, defaultValue*/ } = payload;
        if (key === 'GUN_ACTION_IF_HALF_STATUS') {
          return `${state.req_half ? 1 : 0}`;
        }
        break;
      }
      case 'HasFlagPersistent': {
        // const { flag } = payload;
        // TODO link this to the unlocks config screen
        return true;
        // break;
      }
      // Used by Zeta
      case 'EntityGetAllChildren': {
        // const { actionId, entityId } = payload;
        break;
      }
      default:
    }
  });

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
  // endSimulationOnRepeatCount = 1,
  limitSimulationIterations = 200,
  limitSimulationDuration = 5000,
}: ClickWandSetup): SerializedClickWandResult => {
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

  const { result, state } = resetState(
    {
      mana: wand_available_mana,
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
        `shot#${result.shotCount}->_start_shot(): mana: ${state.mana}, cast_delay: ${wand_cast_delay}`,
      );

      /* Simulate shot */
      _start_shot(state.mana);

      alwaysCastSpells.forEach((spell, i) => {
        _play_permanent_card(spell.id, AlwaysCastIndicies[i]);
      });

      _draw_actions_for_shot(true);
      /* End Simulate shot */

      state.currentShot.actionCalls = state.calledActions!;
      state.currentShot.actionCallTrees = state.rootNodes;
      state.currentShot.manaDrain = state.mana - gunMana;
      console.debug(
        `shot#${result.shotCount}, .manaDrain: ${state.currentShot.manaDrain} (${state.mana} - ${gunMana})`,
      );
      result.shots.push(state.currentShot);
      state.mana = gunMana;

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

export type SerializedClickWandResult = ChangeFields<
  ClickWandResult,
  {
    shots: WandShotResult[];
  }
>;
