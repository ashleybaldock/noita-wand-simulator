import styled from 'styled-components';
import type { WandSelection } from '../../../redux/Wand/wandSelection';
import { useCallback } from 'react';
import type { DragItem, DragItemSelect } from './DragItems';
import {
  isDragItemSelect,
  isDragItemSpell,
  type DragItemSpell,
} from './DragItems';
import { moveSpell, useAppDispatch, useConfig } from '../../../redux';
import { useDrop } from 'react-dnd';
import { moveCursorTo, setSelection } from '../../../redux/editorSlice';
import { isMainWandIndex, type WandIndex } from '../../../redux/WandIndex';
import { cursorBackgrounds, type CursorStyle } from './Cursor';
import { noop } from '../../../util';
import type { DropHint } from './DropHint';
import { dropHintBackgrounds, selectHintBackgrounds } from './DropHint';
import { selectionBackgrounds } from './WandSelection';
import { useMergedBackgrounds } from './useMergeBackgrounds';

const DropTargetOver = styled.div`
  --selection-bdcolor: #00dbff;
  --selection-bgcolor: #0000ff78;
  --selection-bdradius: 3px;
  --selection-bdwidth: 1px;
  --selection-bdstyle: dashed;

  position: relative;
  height: 100%;
  padding: calc(var(--bsize-spell) * 0.04) calc(var(--bsize-spell) * 0.08);

  border-style: dashed hidden;
  border-width: var(--selection-bdwidth);
  border-color: transparent;
`;

export const OverSpellDropTarget = ({
  wandIndex,
  className = '',
  onClick = noop,
  children,
  cursor = 'none',
  overHint = 'none',
  selection = 'none',
}: React.PropsWithChildren<{
  wandIndex: WandIndex;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLElement>;

  cursor?: CursorStyle;
  overHint?: DropHint;
  selection?: WandSelection;
}>) => {
  const dispatch = useAppDispatch();
  const { swapOnMove } = useConfig();

  const onDropSpell = useCallback(
    (item: DragItemSpell) => {
      dispatch(
        moveSpell({
          fromIndex: item.sourceWandIndex,
          spellId: item.actionId,
          toIndex: wandIndex,
          mode: swapOnMove ? 'swap' : 'overwrite',
        }),
      );
    },
    [swapOnMove, dispatch, wandIndex],
  );

  const onEndSelect = useCallback(
    (item: DragItemSelect) => {
      dispatch(
        setSelection({
          from: item.dragStartIndex,
          to: wandIndex,
          selecting: false,
        }),
      );
    },
    [dispatch, wandIndex],
  );

  const onDragSelect = useCallback(
    (item: DragItemSelect) => {
      // dispatch(
      //   setSelection({
      //     from: item.dragStartIndex,
      //     to: wandIndex,
      //     selecting: true,
      //   }),
      // );
    },
    [dispatch, wandIndex],
  );

  const [{ isOver, isDraggingSpell, isDraggingSelect, canDrop }, dropRef] =
    useDrop(
      () => ({
        accept: ['spell', 'select'],
        drop: (item: DragItem, monitor) => {
          !monitor.didDrop() &&
            ((isDragItemSpell(item) && onDropSpell(item)) ||
              (isDragItemSelect(item) && onEndSelect(item)));
        },
        hover: (item: DragItem) => {
          isDragItemSelect(item) && onDragSelect(item);
        },
        canDrop: (item: DragItem) =>
          (isDragItemSpell(item) && item.sourceWandIndex !== wandIndex) ||
          (isDragItemSelect(item) && isMainWandIndex(wandIndex)),
        collect: (monitor) => ({
          isDraggingSpell: monitor.getItemType() === 'spell',
          isDraggingSelect: monitor.getItemType() === 'select',
          isOver: monitor.isOver(),
          canDrop: monitor.canDrop(),
        }),
      }),
      [wandIndex, onDropSpell, onEndSelect, onDragSelect],
    );

  const merged = useMergedBackgrounds(
    cursorBackgrounds[cursor]['on'],
    ((isDraggingSpell && isOver && canDrop && dropHintBackgrounds[overHint]) ||
      (isDraggingSpell && isOver && dropHintBackgrounds[overHint]) ||
      (isDraggingSpell && dropHintBackgrounds.dragging) ||
      (isDraggingSelect &&
        isOver &&
        canDrop &&
        selectHintBackgrounds[overHint]) ||
      (isDraggingSelect && isOver && selectHintBackgrounds[overHint]) ||
      (isDraggingSelect && selectHintBackgrounds.dragging) ||
      dropHintBackgrounds.none)['on'],
    selectionBackgrounds[selection]['on'],
  );

  return (
    <DropTargetOver
      style={merged}
      onClick={() => dispatch(moveCursorTo({ to: wandIndex }))}
      className={className}
      ref={dropRef}
    >
      {children}
    </DropTargetOver>
  );
};
