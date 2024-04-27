import type { Spell, SpellDeckInfo } from '../spell';
import { getSpellById } from '../spells';
import { observer } from './wandObserver';
import type { Gun } from '../gun';
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
import type { ActionId } from '../actionId';
import { isIterativeActionId, isValidActionId } from '../actionId';
import { defaultGunActionState } from '../defaultActionState';
import { triggerConditionFor } from '../trigger';
import { isValidActionCallSource } from '../spellTypes';
import type { StopReason } from '../../types';
import type { WandEvent } from './wandEvent';
import { isNotNullOrUndefined, type ChangeFields } from '../../util';
import type { ActionCall } from './ActionCall';
import { nextWandShotId, type WandShot } from './WandShot';
import type { MapTree } from '../../util/MapTree';
import { mapTreeToMapTree } from '../../util/MapTree';
import type { TreeNode } from '../../util/TreeNode';

export type ClickWandResult = {
  shots: WandShot[];
  reloadTime: number | undefined;
  endConditions: StopReason[];
  elapsedTime: number;
  wraps: number;
  shotCount: number;
  reloadCount: number;
  refreshCount: number;
  repeatCount: number;
};

export type EvalTree = MapTree<ActionCall>;

export type WandShotResult = ChangeFields<
  WandShot,
  {
    actionCallTrees: EvalTree[];
  }
>;

export type SerializedClickWandResult = ChangeFields<
  ClickWandResult,
  {
    shots: WandShotResult[];
  }
>;

const serializeSpell = (spell: SpellDeckInfo) => ({
  id: spell?.id,
  deck_index: spell?.deck_index,
  permanently_attached: spell?.permanently_attached,
});
const maybeSerializeSpell = (spell?: SpellDeckInfo) =>
  isNotNullOrUndefined(spell) ? serializeSpell(spell) : undefined;

const serializeClickWandResult = (
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
    actionCallTrees: shot.actionCallTrees.map(mapTreeToMapTree),
  })),
});

export type ClickWandSetup = {
  wand: Gun;
  spells: Spell[];
  alwaysCastSpells: Spell[];
  zetaSpell?: Spell;
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

type ClickWandState = {
  mana: number;
  currentShot: WandShot;
  parentShot: WandShot | undefined;
  currentShotStack: WandShot[];
  lastCalledAction: ActionCall | undefined;
  lastDrawnAction: ActionCall | undefined;
  lastPlayed: Readonly<Spell> | undefined;
  alwaysCastsPlayed: ActionId[];
  calledActions: ActionCall[];
  validSourceCalledActions: ActionCall[];
  currentNode: TreeNode<ActionCall> | undefined;
  rootNodes: TreeNode<ActionCall>[];
};

const startTimer =
  (start = performance.now()) =>
  () =>
    performance.now() - start;

export const clickWand = ({
  wand,
  spells,
  alwaysCastSpells,
  zetaSpell,
  req_enemies,
  req_projectiles,
  req_hp,
  req_half,
  rng_frameNumber,
  rng_worldSeed,
  wand_available_mana,
  wand_cast_delay,
  endSimulationOnShotCount = 10,
  endSimulationOnReloadCount = 1,
  endSimulationOnRefreshCount = 2,
  endSimulationOnRepeatCount = 1,
  limitSimulationIterations = 200,
  limitSimulationDuration = 5000,
}: ClickWandSetup): SerializedClickWandResult => {
  const getElapsedTime = startTimer();

  const result: ClickWandResult = {
    shots: [],
    reloadTime: undefined,
    endConditions: [],
    elapsedTime: 0,
    wraps: 0,
    shotCount: 0,
    reloadCount: 0,
    refreshCount: 0,
    repeatCount: 0,
  };

  if (spells.filter((s) => s != null).length === 0) {
    result.endConditions.push('noSpells');
    return result;
  }

  const getShot = (): WandShot => ({
    id: nextWandShotId(),
    projectiles: [],
    actionCalls: [],
    actionCallTrees: [],
    castState: { ...defaultGunActionState },
    wraps: [],
  });

  const resetState = (): ClickWandState => ({
    calledActions: [],
    validSourceCalledActions: [],
    currentShotStack: [],
    rootNodes: [],
    currentNode: undefined,

    mana: wand_available_mana,
    currentShot: getShot(),
    lastCalledAction: undefined,
    lastDrawnAction: undefined,
    lastPlayed: undefined,
    alwaysCastsPlayed: [],
    parentShot: undefined,
  });

  const state: ClickWandState = resetState();

  // action call tree

  const if_half_state = req_half ? 1 : 0;

  const unsub = observer.subscribe(({ name, payload }: WandEvent) => {
    switch (name) {
      case 'BeginProjectile':
        const { entityFilename } = payload;

        let sourceAction =
          state.validSourceCalledActions[
            state.validSourceCalledActions.length - 1
          ]?.spell;
        let proxy: SpellDeckInfo | undefined = undefined;

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

        if (
          entityFilename !==
          getSpellById(sourceAction.id).related_projectiles?.[0]
        ) {
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

        state.currentShot.projectiles.push({
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
        if (state.lastDrawnAction) {
          state.lastDrawnAction.wasLastToBeDrawnBeforeBeginTrigger =
            state.currentShot.id;
        }
        if (state.lastCalledAction) {
          state.lastCalledAction.wasLastToBeCalledBeforeBeginTrigger =
            state.currentShot.id;
        }
        break;
      case 'EndTrigger':
        state.currentShot = state.currentShotStack.pop()!;
        break;
      case 'EndProjectile':
        break;
      case 'RegisterGunAction':
        const { s: castState } = payload;
        state.currentShot.castState = Object.assign({}, castState);
        break;
      case 'OnDraw':
        const { state_cards_drawn: totalDrawn } = payload;
        if (state.currentShot.castState) {
          state.currentShot.castState.state_cards_drawn =
            (totalDrawn ??
              state.currentShot.castState?.state_cards_drawn ??
              0) + 1;
        }
        break;
      case 'OnActionPlayed': {
        const { spell, c: castState, playing_permanent_card } = payload;
        state.lastPlayed = spell;
        break;
      }
      case 'OnPlayPermanentCard': {
        const { actionId, c: castState } = payload;
        if (isValidActionId(actionId)) {
          state.alwaysCastsPlayed.push(actionId);
        }
        break;
      }
      case 'OnMoveDiscardedToDeck': {
        const { discarded } = payload;
        result.wraps += 1;
        state.currentShot.wraps.push(result.wraps);
        if (state.lastDrawnAction) {
          state.lastDrawnAction.wasLastToBeDrawnBeforeWrapNr = result.wraps;
          state.lastDrawnAction.wrappingInto = [...discarded];
        }
        if (state.lastCalledAction) {
          state.lastCalledAction.wasLastToBeCalledBeforeWrapNr = result.wraps;
          state.lastCalledAction.wrappingInto = [...discarded];
        }

        break;
      }
      case 'OnActionCalled': {
        const { source, spell /*, c: castState */, recursion, iteration } =
          payload;
        const { id, deck_index, recursive } = spell;
        console.log(`OnActionCalled gunMana: ${gunMana}`);
        state.lastCalledAction = {
          _typeName: 'ActionCall',
          spell: {
            id: spell.id,
            deck_index: spell.deck_index,
            permanently_attached: spell.permanently_attached,
          },
          source,
          currentMana: gunMana,
          deckIndex: deck_index,
          recursion: recursive ? recursion ?? 0 : recursion,
          iteration: isIterativeActionId(id) ? iteration ?? 1 : undefined,
          dont_draw_actions: dont_draw_actions,
        };
        if (source === 'draw') {
          state.lastDrawnAction = state.lastCalledAction;
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
        if (isValidActionCallSource(spell.type)) {
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
        console.log('increment reload count');
        result.reloadCount = result.reloadCount + 1;
        result.reloadTime = payload.reload_time;
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

  try {
    resetState();

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

      console.log(
        `shot#${result.shotCount}(_start_shot) mana: ${state.mana}, cast_delay: ${wand_cast_delay}`,
      );
      _start_shot(state.mana);

      alwaysCastSpells.forEach((spell) => {
        _play_permanent_card(spell.id);
      });

      _draw_actions_for_shot(true);
      state.currentShot.actionCalls = state.calledActions!;
      state.currentShot.actionCallTrees = state.rootNodes;
      state.currentShot.manaDrain = state.mana - gunMana;
      console.log(
        `shot#${result.shotCount}(currentShot.manaDrain) mana: ${state.mana}, gunMana: ${gunMana}`,
      );
      result.shots.push(state.currentShot);
      state.mana = gunMana;

      result.elapsedTime = getElapsedTime();

      console.log(result);
      /* Check for end conditions */
      if (result.shotCount >= endSimulationOnShotCount) {
        result.endConditions.push('shotCount');
      }
      if (result.reloadCount >= endSimulationOnReloadCount) {
        result.endConditions.push('reloadCount');
      }
      if (result.refreshCount >= endSimulationOnRefreshCount) {
        result.endConditions.push('refreshCount');
      }
      if (result.repeatCount >= endSimulationOnRepeatCount) {
        result.endConditions.push('repeatCount');
      }
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
  }

  resetState();
  unsub();

  return serializeClickWandResult(result);
};
