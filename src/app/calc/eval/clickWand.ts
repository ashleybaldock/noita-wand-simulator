import { Spell } from '../spell';
import { getSpellById } from '../spells';
import { override, subscribe } from './wandObserver';
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
import { ActionCall, Requirements, TreeNode, WandShot } from './types';
import { defaultGunActionState } from '../actionState';
import { TriggerCondition } from '../trigger';
import { isValidActionCallSource, SpellType } from '../spellTypes';

export type StopCondition = 'oneshot' | 'reload' | 'refresh' | 'iterLimit';

export type StopReason =
  | StopCondition
  | 'noSpells'
  | 'timeout'
  | 'exception'
  | 'unknown';

export type ClickWandResult = {
  shots: WandShot[];
  recharge: number | undefined;
  endReason: StopReason;
};

const triggerEventToConditionMap = new Map<string, TriggerCondition>([
  ['BeginTriggerHitWorld', 'hit'],
  ['BeginTriggerTimer', 'timer'],
  ['BeginTriggerDeath', 'expire'],
]);

export function clickWand(
  wand: Gun,
  spells: Spell[],
  mana: number,
  castDelay: number,
  fireUntil: StopCondition,
  requirements?: Requirements,
): ClickWandResult {
  if (spells.filter((s) => s != null).length === 0) {
    return { shots: [], recharge: undefined, endReason: 'noSpells' };
  }

  let iterations = 0;
  const iterationLimit = 10;
  let reloaded = false;
  let wandShots: WandShot[] = [];
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

  let if_half_state = requirements?.half ? 1 : 0;
  const unsub = subscribe((eventType, ...args) => {
    switch (eventType) {
      case 'BeginProjectile':
        const entity: string = args[0];

        let sourceAction =
          validSourceCalledActions[validSourceCalledActions.length - 1]?.spell;
        let proxy: Spell | undefined = undefined;

        if (!sourceAction) {
          // fallback to most likely entity source if no action
          // if (!entityToActions(entity)) {
          if (
            !isValidEntityPath(entity) ||
            entityToActions(entity) === undefined
          ) {
            throw Error(`missing entity: ${entity}`);
          }
          sourceAction = getSpellById(entityToActions(entity)?.[0]);
        }

        if (entity !== sourceAction.related_projectiles?.[0]) {
          if (!entityToActions(entity)) {
            throw Error(`missing entity: ${entity}`);
          }

          // check for bugged actions (missing the correct related_projectile)
          if (entityToActions(entity)[0] !== sourceAction.id) {
            // this probably means another action caused this projectile (like ADD_TRIGGER)
            proxy = sourceAction;
            sourceAction = getSpellById(entityToActions(entity)?.[0]);
          }
        }

        currentShot.projectiles.push({
          _typeName: 'Projectile',
          entity: args[0],
          spell: sourceAction,
          proxy: proxy,
          deckIndex: proxy?.deck_index || sourceAction?.deck_index,
        });
        break;
      case 'BeginTriggerHitWorld':
      case 'BeginTriggerTimer':
      case 'BeginTriggerDeath':
        const [entity_filename, action_draw_count, delay_frames] = args;
        parentShot = currentShot;
        currentShotStack.push(currentShot);
        currentShot = {
          _typeName: 'WandShot',
          projectiles: [],
          calledActions: [],
          actionTree: [],
          castState: { ...defaultGunActionState },
          triggerType: triggerEventToConditionMap.get(eventType),
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
        const [totalDrawn] = args;
        if (currentShot.castState) {
          currentShot.castState.state_cards_drawn =
            (totalDrawn ?? currentShot.castState?.state_cards_drawn ?? 0) + 1;
        }
        break;
      case 'RegisterGunAction':
        currentShot.castState = Object.assign({}, args[0]);
        break;
      case 'OnActionCalled': {
        const [source, spell /*, c */, , recursion, iteration] = args;
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
        const [
          ,
          ,
          /*source*/ /*spell*/ c /*recursion, iteration, returnValue*/,
        ] = args;
        currentShot.castState = Object.assign({}, c);
        currentNode = currentNode?.parent;
        break;
      }
      case 'StartReload':
        reloaded = true;
        reloadTime = args[0];
        break;
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
    currentShotStack = [];
    rootNodes = [];
    currentNode = undefined;
  };

  let removeOverrides = [];
  if (requirements) {
    removeOverrides.push(
      override('EntityGetInRadiusWithTag', (args) => {
        if (args[3] === 'homing_target') {
          return requirements.enemies ? new Array(15) : [];
        } else if (args[3] === 'projectile') {
          return requirements.projectiles ? new Array(20) : [];
        }
      }),
    );
    removeOverrides.push(
      override('EntityGetFirstComponent', (args) => {
        if (args[1] === 'DamageModelComponent') {
          return 'IF_HP'; // just has to be non-null
        }
      }),
    );
    removeOverrides.push(
      override('ComponentGetValue2', (args) => {
        if (args[0] === 'IF_HP') {
          if (args[1] === 'hp') {
            return requirements.hp ? 25000 / 25 : 100000 / 25;
          } else if (args[1] === 'max_hp') {
            return 100000 / 25;
          }
        }
      }),
    );
    removeOverrides.push(
      override('GlobalsGetValue', (args) => {
        if (args[0] === 'GUN_ACTION_IF_HALF_STATUS') {
          return `${if_half_state}`;
        }
      }),
    );
    removeOverrides.push(
      override('GlobalsSetValue', (args) => {
        if (args[0] === 'GUN_ACTION_IF_HALF_STATUS') {
          if_half_state = Number.parseInt(args[1]);
        }
      }),
    );
  }

  const endReason = ((): StopReason => {
    try {
      resetState();

      _set_gun(wand);
      _clear_deck(/*false*/);

      spells.forEach((spell, index) => {
        if (!spell) {
          return;
        }
        _add_card_to_deck(spell.id, index, spell.uses_remaining, true);
      });

      while (!reloaded && iterations < iterationLimit) {
        state_from_game.fire_rate_wait = castDelay;
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
      return 'exception';
    }
    return 'reload';
  })();

  resetState();
  unsub();
  removeOverrides.forEach((cb) => cb());

  return { shots: wandShots, recharge: reloadTime, endReason };
}
