import { Spell } from '../spell';
import { getSpellById } from '../spells';
import { observer } from './wandObserver';
import {
  Gun,
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
import { ActionCall, TreeNode, WandShot } from './types';
import { defaultGunActionState } from '../defaultActionState';
import { getTriggerConditionForEvent } from '../trigger';
import { isValidActionCallSource } from '../spellTypes';
import { StopCondition, StopReason } from '../../types';
import { WandEvent } from './wandEvent';

export type ClickWandResult = {
  shots: WandShot[];
  recharge: number | undefined;
  endReason: StopReason;
  elapsedTime: number;
};

export type ClickWandSetup = {
  fireUntil: StopCondition;
  req_enemies: boolean;
  req_projectiles: boolean;
  req_hp: boolean;
  req_half: boolean;
  rng_frameNumber: number;
  rng_worldSeed: number;
  wand_available_mana: number;
  wand_cast_delay: number;
};

export const clickWand = (
  wand: Gun,
  spells: Spell[],
  {
    fireUntil,
    req_enemies,
    req_projectiles,
    req_hp,
    req_half,
    rng_frameNumber,
    rng_worldSeed,
    wand_available_mana,
    wand_cast_delay,
  }: ClickWandSetup,
): ClickWandResult => {
  const start = performance.now();

  if (spells.filter((s) => s != null).length === 0) {
    return {
      shots: [],
      recharge: undefined,
      endReason: 'noSpells',
      elapsedTime: 0,
    };
  }

  let iterations = 0;
  const iterationLimit = 10;
  let reloaded = false;
  let mana = wand_available_mana;
  const wandShots: WandShot[] = [];
  let currentShot: WandShot;
  let currentShotStack: WandShot[];
  let lastCalledAction: ActionCall | undefined;
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
          calledActions: [],
          actionTree: [],
          castState: { ...defaultGunActionState },
          triggerType: getTriggerConditionForEvent(name),
          triggerEntity: entity_filename,
          triggerActionDrawCount: action_draw_count,
          triggerDelayFrames: delay_frames,
        };
        parentShot.projectiles[parentShot.projectiles.length - 1].trigger =
          currentShot;
        break;
      case 'EndTrigger':
        currentShot = currentShotStack.pop()!;
        break;
      case 'EndProjectile':
        break;
      case 'OnDraw':
        const { state_cards_drawn: totalDrawn } = payload;
        if (currentShot.castState) {
          currentShot.castState.state_cards_drawn =
            (totalDrawn ?? currentShot.castState?.state_cards_drawn ?? 0) + 1;
        }
        break;
      case 'RegisterGunAction':
        const { s: castState } = payload;
        currentShot.castState = Object.assign({}, castState);
        break;
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
        reloaded = true;
        reloadTime = payload.reload_time;
        break;
      }
      case 'OnMoveDiscardedToDeck': {
        const { discarded } = payload;
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
      calledActions: [],
      actionTree: [],
      castState: { ...defaultGunActionState },
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

      while (!reloaded && iterations < iterationLimit) {
        state_from_game.fire_rate_wait = wand_cast_delay;
        _start_shot(mana);
        _draw_actions_for_shot(true);
        iterations++;
        currentShot!.calledActions = calledActions!;
        currentShot!.actionTree = rootNodes;
        currentShot!.manaDrain = mana - gunMana;
        wandShots.push(currentShot!);
        mana = gunMana;

        if (fireUntil === 'oneshot') {
          return 'oneshot';
        }
        if (
          fireUntil === 'refresh' &&
          (calledActions!.length === 0 ||
            calledActions!.reduce(
              (found, a) => (a.spell.id === 'RESET' ? found + 1 : found),
              0,
            ))
        ) {
          return 'refresh';
        }
        if (fireUntil === 'iterLimit' && iterations === iterationLimit) {
          return 'iterLimit';
        }
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
    recharge: reloadTime,
    endReason,
    elapsedTime: performance.now() - start,
  };
};
