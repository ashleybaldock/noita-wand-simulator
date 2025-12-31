import type { ActionId } from '../../../calc/actionId';
import type { WandIndex } from '../../../redux/WandIndex';
import { isNotNullOrUndefined, isObject } from '../../../util';

export const dragNames = ['spell', 'select'] as const;

export type DragName = (typeof dragNames)[number];

export interface Dragged {
  disc: DragName;
}

export interface DraggedSpell extends Dragged {
  disc: 'spell';
  actionId: ActionId;
  sourceWandIndex?: WandIndex;
}
export const isDraggedSpell = (x: unknown): x is DraggedSpell =>
  isNotNullOrUndefined(x) && isObject(x) && (x as Dragged)?.disc === 'spell';

export interface DraggedSelection extends Dragged {
  disc: 'select';
  dragStartIndex: WandIndex;
}
export const isDraggedSelection = (x: unknown): x is DraggedSelection =>
  isNotNullOrUndefined(x) && isObject(x) && (x as Dragged)?.disc === 'select';
