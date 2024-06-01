import type { MainWandIndex } from './WandIndex';

export type WandEditorState = {
  cursorIndex: MainWandIndex;
  selecting: boolean;
  selectFrom: MainWandIndex | null;
  selectTo: MainWandIndex | null;
};
