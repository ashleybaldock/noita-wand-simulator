import type { ActionId } from '../../../calc/actionId';
import type { WandIndex } from '../../../redux/WandIndex';
import { isNotNullOrUndefined, isObject } from '../../../util';

export const dragItemNames = ['spell', 'select'] as const;

export type DragItemName = (typeof dragItemNames)[number];

export interface DragItem {
  disc: DragItemName;
}

export interface DragItemSpell extends DragItem {
  disc: 'spell';
  actionId: ActionId;
  sourceWandIndex?: WandIndex;
}
export const isDragItemSpell = (x: unknown): x is DragItemSpell =>
  isNotNullOrUndefined(x) && isObject(x) && (x as DragItem)?.disc === 'spell';

export interface DragItemSelect extends DragItem {
  disc: 'select';
  dragStartIndex: WandIndex;
}
export const isDragItemSelect = (x: unknown): x is DragItemSelect =>
  isNotNullOrUndefined(x) && isObject(x) && (x as DragItem)?.disc === 'select';
