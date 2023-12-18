import { ActionId } from '../../../calc/actionId';

export type CursorPosition = 'none' | 'before' | 'after';
export type CursorStyle = 'none' | 'caret';
export type Cursor = {
  position: CursorPosition;
  style: CursorStyle;
};

export interface DragItemSpell {
  disc: 'spell';
  actionId: ActionId;
  sourceWandIndex?: number;
}
export const isDragItemSpell = (x: DragItem): x is DragItemSpell =>
  x.disc === 'spell';

export type DragItem = DragItemSpell | DragItemSelect;

export interface DragItemSelect {
  disc: 'select';
  dragStartIndex: number;
}
export const isDragItemSelect = (x: DragItem): x is DragItemSelect =>
  x.disc === 'select';
