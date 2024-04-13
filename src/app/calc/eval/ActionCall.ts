import type { ActionSource } from '../actionSources';
import type { SpellDeckInfo } from '../spell';
import type { WandShotId } from './WandShot';

export type ActionCall = {
  _typeName: 'ActionCall';
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
