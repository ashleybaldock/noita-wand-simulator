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
  spell: SpellDeckInfo;
  source: ActionSource;
  currentMana: number;
  deckIndex?: string | number;
  recursion?: number;
  iteration?: number;
  dont_draw_actions?: boolean;
  wasLastToBeDrawnBeforeWrapNr?: number;
  wasLastToBeCalledBeforeWrapNr?: number;
  wrappingInto?: SpellDeckInfo[];
  wasLastToBeDrawnBeforeBeginTrigger?: WandShotId;
  wasLastToBeCalledBeforeBeginTrigger?: WandShotId;
};

export const nextActionCallSequenceId = sequentialId<ActionCallSequenceId>();
