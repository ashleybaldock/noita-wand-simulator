import { SpellId } from './spellId';
import { Wand, WandQueryVersion } from './wand';

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
  editor: WandEditorState;
  fromQuery?: WandQueryVersion;
};
