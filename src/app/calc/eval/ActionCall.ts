import { sequentialId } from '../../util';
import type { SpellPileSnapshot } from '../SpellPileSnapshot';
import type { ActionSource } from '../actionSources';
import type { SpellDeckInfo } from '../spell';
import type { WandShotId } from './WandShot';

/**
 * Session-Unique ID to identify an action call
 */
export type ActionCallSequenceId = number;

/**
 * Represents:
 * - a node in the action call tree (via TreeNode<ActionCall>)
 * - an event in the list of called actions
 */
export type ActionCall = {
  _typeName: 'ActionCall';
  sequenceId: ActionCallSequenceId;
  /**
   * Spell associated with this action, this is the spell that this action call belongs to.
   * spell.deck_index: The index of this action in the original wand ordering
   */
  spell: SpellDeckInfo /* serialisable */;
  /**
   * Origin of this action
   */
  source: ActionSource;
  /**
   * Mana before action executed
   */
  manaPre?: number;
  /**
   * Mana after action executed
   * (Includes aggregate of changes made by children)
   */
  manaPost?: number;
  /**
   * recursion level action was executed with
   * (undefined for non-recursive actions)
   */
  recursion?: number;
  /**
   * iteration level action was executed with
   * (undefined for non-iterative actions)
   */
  iteration?: number;
  /**
   * Was draw disabled when this action was called
   */
  dont_draw_actions?: boolean;
  /**
   * State of the three lists that spells move between
   * [Pre, Post]
   * (undefined if nothing changed)
   */
  piles?: [pre: SpellPileSnapshot, post: SpellPileSnapshot];
  /**
   * Next spell to be executed after this one when a wrap happens
   */
  wrappingInto?: SpellDeckInfo[];
  wasLastToBeDrawnBeforeWrapNr?: number;
  /**
   * If true then this was likely the action call that caused the wrap
   */
  wasLastToBeCalledBeforeWrapNr?: number;
  wasLastToBeDrawnBeforeBeginTrigger?: WandShotId;
  wasLastToBeCalledBeforeBeginTrigger?: WandShotId;
  /**
   * @deprecated Use manaPre instead
   */
  currentMana: number;
  /**
   * @deprecated Use spell.deck_index instead
   */
  deckIndex?: string | number;
};

/**
 * All action calls get sequential IDs, unique within the program lifetime.
 * Actions with lower IDs were called before, but not necessarily completed before, actions with higher ones.
 */
export const nextActionCallSequenceId = sequentialId<ActionCallSequenceId>();
