import type { ActionId } from '../../../calc/actionId';

export const dragItemNames = ['spell', 'select'] as const;

export type DragItemName = (typeof dragItemNames)[number];

export interface DragItem {
  disc: DragItemName;
}

export interface DragItemSpell extends DragItem {
  disc: 'spell';
  actionId: ActionId;
  sourceWandIndex?: number;
}
export const isDragItemSpell = (x: DragItem): x is DragItemSpell =>
  x.disc === 'spell';

export interface DragItemSelect extends DragItem {
  disc: 'select';
  dragStartIndex: number;
}
export const isDragItemSelect = (x: DragItem): x is DragItemSelect =>
  x.disc === 'select';
