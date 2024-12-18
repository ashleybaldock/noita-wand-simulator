import { sequentialId } from '../../util';
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
   */
  spell: SpellDeckInfo;
  /**
   * Origin of this action
   */
  source: ActionSource;
  /**
   * @deprecated Use manaPre instead
   */
  currentMana: number;
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
   * The index of this action
   */
  /**
   * @deprecated Use spell.deck_index instead
   */
  deckIndex?: string | number;
  /**
   * recursion level under which this action will execute, undefined for non-recursive actions
   */
  recursion?: number;
  /**
   * iteration level under which this action will execute, undefined for non-iterative actions
   */
  iteration?: number;
  /**
   * Whether draw is disabled when this action was called
   */
  dont_draw_actions?: boolean;
  wrappingInto?: SpellDeckInfo[];
  wasLastToBeDrawnBeforeWrapNr?: number;
  wasLastToBeCalledBeforeWrapNr?: number;
  wasLastToBeDrawnBeforeBeginTrigger?: WandShotId;
  wasLastToBeCalledBeforeBeginTrigger?: WandShotId;
};

/**
 * All action calls get sequential IDs, unique within the program lifetime.
 * Actions with lower IDs were called before, but not necessarily completed before, actions with higher ones.
 */
export const nextActionCallSequenceId = sequentialId<ActionCallSequenceId>();
