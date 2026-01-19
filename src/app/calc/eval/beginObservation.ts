import { isValidActionId, isIterativeActionId } from '../actionId';
import { defaultGunActionState } from '../defaultActionState';
import { isValidEntityPath, entityToActions } from '../entityLookup';
import { mana as gunMana, dont_draw_actions } from '../gun';
import type { SpellDeckInfo } from '../spell';
import { getSpellByActionId } from '../spells';
import { isValidActionCallSource } from '../spellTypes';
import { triggerConditionFor } from '../trigger';
import { nextActionCallSequenceId, type ActionCall } from './ActionCall';
import type { SimulationState } from './SimulationState';
import type { SimulationResult } from './SimulationResult';
import type { WandEvent } from './wandEvent';
import { observer } from './wandObserver';
import { nextWandCastId } from './WandCast';
import { isNotUndefined, isUndefined } from '../../util';
import { MapTree } from '../../util/MapTree';

export const beginObservation = (
  result: SimulationResult,
  state: SimulationState,
) =>
  observer.subscribe(({ name, payload }: WandEvent) => {
    switch (name) {
      /**
       * Projectiles can be added by excuting a spell's action (which
       * calls add_projectilezx..)
       */
      case 'BeginProjectile': {
        const { projectileId } = payload;

        let sourceAction =
          state.validSourceCalledActions[
            state.validSourceCalledActions.length - 1
          ]?.spell;
        let proxy: SpellDeckInfo | undefined = undefined;

        if (!sourceAction) {
          // fallback to most likely entity source if no action
          // if (!entityToActions(entity)) {
          if (
            !isValidEntityPath(projectileId) ||
            entityToActions(projectileId) === undefined
          ) {
            throw Error(`missing entity: ${projectileId}`);
          }
          sourceAction = getSpellByActionId(entityToActions(projectileId)?.[0]);
        }

        if (
          projectileId !==
          getSpellByActionId(sourceAction.id).related_projectiles?.[0]
        ) {
          if (!entityToActions(projectileId)) {
            throw Error(`missing entity: ${projectileId}`);
          }

          // check for bugged actions (missing the correct related_projectile)
          if (entityToActions(projectileId)[0] !== sourceAction.id) {
            // this probably means another action caused this projectile (like ADD_TRIGGER)
            proxy = sourceAction;
            sourceAction = getSpellByActionId(
              entityToActions(projectileId)?.[0],
            );
          }
        }

        state.currentCastScope.projectiles.push({
          _typeName: 'Projectile',
          entity: projectileId,
          spell: sourceAction,
          proxy: proxy,
        });
        break;
      }
      case 'BeginTriggerTimer':
      case 'BeginTriggerHitWorld':
      case 'BeginTriggerDeath': {
        const { projectileId, action_draw_count } = payload;
        const delay_frames =
          name === 'BeginTriggerTimer' ? payload.delay_frames : undefined;
        state.parentCastScope = state.currentCastScope;
        state.currentCastStack.push(state.currentCastScope);
        state.currentCastScope = {
          id: nextWandCastId(),
          stats: {
            projectiles: {},
          },
          projectiles: [],
          actionCalls: [],
          actionCallTrees: [],
          castState: { ...defaultGunActionState },
          triggerType: triggerConditionFor(name),
          triggerEntity: projectileId,
          triggerActionDrawCount: action_draw_count,
          triggerDelayFrames: delay_frames,
          wraps: [],
        };
        // state.parentShot.projectles[
        //   state.parentShot.projectiles.length - 1
        // ].trigger = state.currentShot.id;
        if (state.lastDrawnAndCalledAction) {
          state.lastDrawnAndCalledAction.wasLastToBeDrawnBeforeBeginTrigger =
            state.currentCastScope.id;
        }
        if (state.lastCalledAction) {
          state.lastCalledAction.wasLastToBeCalledBeforeBeginTrigger =
            state.currentCastScope.id;
        }
        break;
      }
      case 'EndTrigger': {
        state.currentCastScope = state.currentCastStack.pop()!;
        break;
      }
      case 'EndProjectile': {
        break;
      }
      case 'RegisterGunAction': {
        const { s: castState } = payload;
        state.currentCastScope.castState = Object.assign({}, castState);
        break;
      }
      case 'OnDraw': {
        const { state_cards_drawn: totalDrawn } = payload;
        if (state.currentCastScope.castState) {
          state.currentCastScope.castState.state_cards_drawn =
            (totalDrawn ??
              state.currentCastScope.castState?.state_cards_drawn ??
              0) + 1;
        }
        break;
      }
      case 'OnNotEnoughManaForAction': {
        const { /*mana_required, mana_available,*/ spell } = payload;
        state.lastPlayed = spell;
        if (isNotUndefined(state.lastCalledAction)) {
          state.lastCalledAction.direct_discard = true;
          state.lastCalledAction.direct_discard_reason = 'mana';
        }
        break;
      }
      case 'OnNoUsesRemaining': {
        const { spell /*, c: castState, playing_permanent_card*/ } = payload;
        state.lastPlayed = spell;
        if (isNotUndefined(state.lastCalledAction)) {
          state.lastCalledAction.direct_discard = true;
          state.lastCalledAction.direct_discard_reason = 'charges';
        }
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
        const { /* deck, hand,*/ discarded } = payload;
        result.wraps += 1;
        state.currentCastScope.wraps.push(result.wraps);
        if (isNotUndefined(state.lastDrawnAndCalledAction)) {
          state.lastDrawnAndCalledAction.wasLastToBeDrawnBeforeWrapNr =
            result.wraps;
          state.lastDrawnAndCalledAction.wrappingInto = [...discarded];
        }
        if (isNotUndefined(state.lastCalledAction)) {
          state.lastCalledAction.wasLastToBeCalledBeforeWrapNr = result.wraps;
          state.lastCalledAction.wrappingInto = [...discarded];
        }
        break;
      }
      case 'OnCantWrap': {
        break;
      }
      case 'OnMoveDiscardedToDeck': {
        // const { discarded } = payload;
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

        const actionCall: ActionCall = {
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
          recursion: getSpellByActionId(id).recursive
            ? (recursion ?? 0)
            : undefined,
          iteration: isIterativeActionId(id) ? (iteration ?? 1) : undefined,
          dont_draw_actions,
        };

        state.lastCalledAction = actionCall;

        if (source === 'draw') {
          state.lastDrawnAndCalledAction = actionCall;
        }

        if (isUndefined(state.currentNode)) {
          const newTree = new MapTree<ActionCall>();
          state.rootNodes.push(newTree);
          state.currentNode = newTree.appendChild(actionCall);
        } else {
          state.currentNode = state.currentNode.appendChild(actionCall);
        }

        state.calledActions.push(actionCall);

        if (isValidActionCallSource(getSpellByActionId(spell.id).type)) {
          state.validSourceCalledActions.push(actionCall);
        }
        break;
      }
      case 'OnActionFinished': {
        const {
          /*source*/ /*spell*/ c: castState /*recursion, iteration, returnValue*/,
        } = payload;
        state.currentCastScope.castState = Object.assign({}, castState);
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
