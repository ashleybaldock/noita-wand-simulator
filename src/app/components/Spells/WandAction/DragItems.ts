import type { ActionId } from '../../../calc/actionId';

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
