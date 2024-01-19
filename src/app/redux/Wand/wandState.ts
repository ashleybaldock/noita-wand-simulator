import type { SpellId } from './spellId';
import type { Wand, WandQueryVersion } from './wand';

export type WandEditorState = {
  cursorIndex: number;
  selectFrom: number | null;
  selectTo: number | null;
};

export type WandState = {
  wand: Wand;
  spellIds: SpellId[];
  alwaysIds: SpellId[];
  messages: string[];
  fromQuery?: WandQueryVersion;
};
