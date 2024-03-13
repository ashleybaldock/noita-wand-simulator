import type { Spell } from '../spell';
import { getSpellById } from '../spells';
import { observer } from './wandObserver';
import type { Gun } from '../gun';
import {
  _add_card_to_deck,
  _clear_deck,
  _draw_actions_for_shot,
  _set_gun,
  _start_shot,
  dont_draw_actions,
  mana as gunMana,
  state_from_game,
} from '../gun';
import { isValidEntityPath, entityToActions } from '../entityLookup';
import { isIterativeActionId } from '../actionId';
import type { ActionCall, WandShot } from './types';
import { defaultGunActionState } from '../defaultActionState';
import { getTriggerConditionForEvent } from '../trigger';
import { isValidActionCallSource } from '../spellTypes';
import type { StopReason } from '../../types';
import type { WandEvent } from './wandEvent';
import type { TreeNode } from '../../util';

export type ClickWandResult = {
  shots: WandShot[];
  recharge: number | undefined;
  endReason: StopReason;
  elapsedTime: number;
  wraps: number;
  shotCount: number;
  reloadCount: number;
  refreshCount: number;
  repeatCount: number;
};

export type ClickWandSetup = {
  req_enemies: boolean;
  req_projectiles: boolean;
  req_hp: boolean;
  req_half: boolean;
  rng_frameNumber: number;
  rng_worldSeed: number;
  wand_available_mana: number;
  wand_cast_delay: number;
  endSimulationOnShotCount: number;
  endSimulationOnReloadCount: number;
  endSimulationOnRefreshCount: number;
  endSimulationOnRepeatCount: number;
  limitSimulationIterations: number;
  limitSimulationDuration: number;
};

const startTimer =
  (start = performance.now()) =>
  () =>
    performance.now() - start;

export const clickWand = (
  wand: Gun,
  spells: Spell[],
  {
    req_enemies,
    req_projectiles,
    req_hp,
    req_half,
    rng_frameNumber,
    rng_worldSeed,
    wand_available_mana,
    wand_cast_delay,
    endSimulationOnShotCount = 10,
    endSimulationOnReloadCount = 2,
    endSimulationOnRefreshCount = 2,
    endSimulationOnRepeatCount = 1,
    limitSimulationIterations = 200,
    limitSimulationDuration = 5000,
  }: ClickWandSetup,
): ClickWandResult => {
  const getElapsedTime = startTimer();

  if (spells.filter((s) => s != null).length === 0) {
    return {
      shots: [],
      recharge: undefined,
      endReason: 'noSpells',
      elapsedTime: 0,
      wraps: 0,
      shotCount: 0,
      reloadCount: 0,
      refreshCount: 0,
      repeatCount: 0,
    };
  }

  let shotCount = 0,
    reloadCount = 0,
    refreshCount = 0,
    repeatCount = 0;
  let currentWrapNumber = 0;
  let mana = wand_available_mana;
  const wandShots: WandShot[] = [];
  let currentShot: WandShot;
  let currentShotStack: WandShot[];
  let lastCalledAction: ActionCall | undefined;
  let lastDrawnAction: ActionCall | undefined;
  let lastPlayed: Readonly<Spell> | undefined;
  let calledActions: ActionCall[];
  let validSourceCalledActions: ActionCall[];
  let parentShot;

  // action call tree
  let rootNodes: TreeNode<ActionCall>[] = [];
  let currentNode: TreeNode<ActionCall> | undefined;

  let reloadTime: number | undefined;

  const if_half_state = req_half ? 1 : 0;

  const unsub = observer.subscribe(({ name, payload }: WandEvent) => {
    switch (name) {
      case 'BeginProjectile':
        const { entityFilename } = payload;

        let sourceAction =
          validSourceCalledActions[validSourceCalledActions.length - 1]?.spell;
        let proxy: Spell | undefined = undefined;

        if (!sourceAction) {
          // fallback to most likely entity source if no action
          // if (!entityToActions(entity)) {
          if (
            !isValidEntityPath(entityFilename) ||
            entityToActions(entityFilename) === undefined
          ) {
            throw Error(`missing entity: ${entityFilename}`);
          }
          sourceAction = getSpellById(entityToActions(entityFilename)?.[0]);
        }

        if (entityFilename !== sourceAction.related_projectiles?.[0]) {
          if (!entityToActions(entityFilename)) {
            throw Error(`missing entity: ${entityFilename}`);
          }

          // check for bugged actions (missing the correct related_projectile)
          if (entityToActions(entityFilename)[0] !== sourceAction.id) {
            // this probably means another action caused this projectile (like ADD_TRIGGER)
            proxy = sourceAction;
            sourceAction = getSpellById(entityToActions(entityFilename)?.[0]);
          }
        }

        currentShot.projectiles.push({
          _typeName: 'Projectile',
          entity: entityFilename,
          spell: sourceAction,
          proxy: proxy,
          deckIndex: proxy?.deck_index || sourceAction?.deck_index,
        });
        break;
      case 'BeginTriggerTimer':
      case 'BeginTriggerHitWorld':
      case 'BeginTriggerDeath':
        const { entity_filename, action_draw_count } = payload;
        const delay_frames =
          name === 'BeginTriggerTimer' ? payload.delay_frames : undefined;
        parentShot = currentShot;
        currentShotStack.push(currentShot);
        currentShot = {
          _typeName: 'WandShot',
          projectiles: [],
          actionCallGroups: [],
          actionCallTree: [],
          castState: { ...defaultGunActionState },
          triggerType: getTriggerConditionForEvent(name),
          triggerEntity: entity_filename,
          triggerActionDrawCount: action_draw_count,
          triggerDelayFrames: delay_frames,
          wraps: [],
        };
        parentShot.projectiles[parentShot.projectiles.length - 1].trigger =
          currentShot;
        if (lastDrawnAction) {
          lastDrawnAction.wasLastToBeDrawnBeforeBeginTrigger = currentShot;
        }
        if (lastCalledAction) {
          lastCalledAction.wasLastToBeCalledBeforeBeginTrigger = currentShot;
        }
        break;
      case 'EndTrigger':
        currentShot = currentShotStack.pop()!;
        break;
      case 'EndProjectile':
        break;
      case 'RegisterGunAction':
        const { s: castState } = payload;
        currentShot.castState = Object.assign({}, castState);
        break;
      case 'OnDraw':
        const { state_cards_drawn: totalDrawn } = payload;
        if (currentShot.castState) {
          currentShot.castState.state_cards_drawn =
            (totalDrawn ?? currentShot.castState?.state_cards_drawn ?? 0) + 1;
        }
        break;
      case 'OnActionPlayed': {
        const { spell, c: castState, playing_permanent_card } = payload;
        lastPlayed = spell;
        break;
      }
      case 'OnMoveDiscardedToDeck': {
        const { discarded } = payload;
        currentWrapNumber += 1;
        currentShot.wraps.push(currentWrapNumber);
        if (lastDrawnAction) {
          lastDrawnAction.wasLastToBeDrawnBeforeWrapNr = currentWrapNumber;
          lastDrawnAction.wrappingInto = discarded;
        }
        if (lastCalledAction) {
          lastCalledAction.wasLastToBeCalledBeforeWrapNr = currentWrapNumber;
          lastCalledAction.wrappingInto = discarded;
        }

        break;
      }
      case 'OnActionCalled': {
        const { source, spell /*, c: castState */, recursion, iteration } =
          payload;
        const { id, deck_index, recursive } = spell;
        lastCalledAction = {
          _typeName: 'ActionCall',
          spell,
          source,
          currentMana: gunMana,
          deckIndex: deck_index,
          recursion: recursive ? recursion ?? 0 : recursion,
          iteration: isIterativeActionId(id) ? iteration ?? 1 : undefined,
          dont_draw_actions: dont_draw_actions,
        };
        if (source === 'draw') {
          lastDrawnAction = lastCalledAction;
        }

        if (!currentNode) {
          currentNode = {
            value: lastCalledAction,
            children: [],
          };
          rootNodes.push(currentNode);
        } else {
          const newNode = {
            value: lastCalledAction,
            children: [],
            parent: currentNode,
          };
          currentNode?.children.push(newNode);
          currentNode = newNode;
        }
        calledActions.push(lastCalledAction);
        if (isValidActionCallSource(spell.type)) {
          validSourceCalledActions.push(lastCalledAction);
        }
        break;
      }
      case 'OnActionFinished': {
        const {
          /*source*/ /*spell*/ c: castState /*recursion, iteration, returnValue*/,
        } = payload;
        currentShot.castState = Object.assign({}, castState);
        currentNode = currentNode?.parent;
        break;
      }
      case 'StartReload': {
        reloadCount++;
        reloadTime = payload.reload_time;
        break;
      }

      case 'GameGetFrameNum': {
        // TODO - this ought to increment/change with each shot cycle
        return rng_frameNumber;
      }
      case 'SetRandomSeed': {
        return rng_worldSeed;
      }
      // These are used currently only by requirements
      case 'EntityGetInRadiusWithTag': {
        const { x, y, radius, tag } = payload;
        if (tag === 'homing_target') {
          return req_enemies ? new Array(15) : [];
        } else if (tag === 'projectile') {
          return req_projectiles ? new Array(20) : [];
        }
        break;
      }
      case 'EntityGetFirstComponent': {
        const { entity_id, component } = payload;
        if (component === 'DamageModelComponent') {
          return 'IF_HP'; // just has to be non-null
        }
        break;
      }
      case 'ComponentGetValue2': {
        const { component_id, key } = payload;
        if (component_id === 'IF_HP') {
          if (key === 'hp') {
            return req_hp ? 25000 / 25 : 100000 / 25;
          } else if (key === 'max_hp') {
            return 100000 / 25;
          }
        }
        break;
      }
      case 'GlobalsGetValue': {
        const { key, defaultValue } = payload;
        if (key === 'GUN_ACTION_IF_HALF_STATUS') {
          return `${if_half_state}`;
        }
        break;
      }
      // Used by Zeta
      case 'EntityGetAllChildren': {
        const { actionId, entityId } = payload;
        break;
      }
      default:
    }
  });

  const resetState = () => {
    currentShot = {
      _typeName: 'WandShot',
      projectiles: [],
      actionCallGroups: [],
      actionCallTree: [],
      castState: { ...defaultGunActionState },
      wraps: [],
    };
    calledActions = [];
    validSourceCalledActions = [];
    currentShotStack = [];
    rootNodes = [];
    currentNode = undefined;
  };

  const endReason = ((): StopReason => {
    try {
      resetState();

      _set_gun(wand);
      _clear_deck(/*false*/);

      spells.forEach(
        (spell, index) =>
          spell &&
          _add_card_to_deck(spell.id, index, spell.uses_remaining, true),
      );

      let simIterations = 0;
      while (
        shotCount < endSimulationOnShotCount &&
        reloadCount < endSimulationOnReloadCount &&
        refreshCount < endSimulationOnRefreshCount &&
        repeatCount < endSimulationOnRepeatCount &&
        simIterations++ < limitSimulationIterations &&
        getElapsedTime() < limitSimulationDuration
      ) {
        shotCount++;
        state_from_game.fire_rate_wait = wand_cast_delay;
        _start_shot(mana);
        _draw_actions_for_shot(true);
        currentShot!.actionCallGroups = calledActions!;
        currentShot!.actionCallTree = rootNodes;
        currentShot!.manaDrain = mana - gunMana;
        wandShots.push(currentShot!);
        mana = gunMana;

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
        // if (fireUntil === 'iterLimit' && shotCount >= shotCountLimit) {
        //   return 'iterLimit';
        // }
      }
    } catch (err) {
      console.error(err);
      return 'exception';
    }
    return 'reload';
  })();

  resetState();
  unsub();

  return {
    shots: wandShots,
    wraps: currentWrapNumber,
    recharge: reloadTime,
    endReason,
    elapsedTime: getElapsedTime(),
    shotCount: 0,
    reloadCount: 0,
    refreshCount: 0,
    repeatCount: 0,
  };
};
