import styled from 'styled-components';
import type { WandSelection } from '../../../redux/Wand/wandSelection';
import { useCallback } from 'react';
import type { Dragged, DraggedSelection } from './DragItems';
import {
  isDraggedSelection,
  isDraggedSpell,
  type DraggedSpell,
} from './DragItems';
import { moveSpell, useAppDispatch, useConfig } from '../../../redux';
import { useDrop } from 'react-dnd';
import { moveCursorTo, setSelection } from '../../../redux/editorSlice';
import { isMainWandIndex, type WandIndex } from '../../../redux/WandIndex';
import { caretBackgrounds, type CaretStyle } from './Backgrounds/Caret';
import type { DropHint } from './Backgrounds/DropHint';
import {
  dropHintBackgrounds,
  selectHintBackgrounds,
} from './Backgrounds/DropHint';
import { selectionBackgrounds } from './Backgrounds/WandSelection';
import { useMergedBackgrounds } from './Backgrounds/useMergeBackgrounds';
import { useDropRef } from '../../../hooks/useDropRef';

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
  children,
  cursor = 'none',
  overHint = 'none',
  selection = 'none',
}: React.PropsWithChildren<{
  wandIndex: WandIndex;
  className?: string;
  cursor?: CaretStyle;
  overHint?: DropHint;
  selection?: WandSelection;
}>) => {
  const dispatch = useAppDispatch();
  const { swapOnMove } = useConfig();

  const onDropSpell = useCallback(
    (item: DraggedSpell) => {
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
    (item: DraggedSelection) => {
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
    (item: DraggedSelection) => {
      dispatch(
        setSelection({
          from: item.dragStartIndex,
          to: wandIndex,
          selecting: true,
        }),
      );
    },
    [dispatch, wandIndex],
  );

  const [
    { isOver, isDraggingSpell, isDraggingSelect, canDrop },
    dropConnector,
  ] = useDrop(
    () => ({
      accept: ['spell', 'select'],
      drop: (item: Dragged, monitor) => {
        if (monitor.didDrop()) {
          return;
        }
        if (isDraggedSpell(item)) {
          onDropSpell(item);
        }
        if (isDraggedSelection(item)) {
          onEndSelect(item);
        }
      },
      hover: (item: Dragged) => {
        if (isDraggedSelection(item)) {
          onDragSelect(item);
        }
      },
      canDrop: (item: Dragged) =>
        (isDraggedSpell(item) && item.sourceWandIndex !== wandIndex) ||
        (isDraggedSelection(item) && isMainWandIndex(wandIndex)),
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
    caretBackgrounds[cursor]['on'],
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

  const dropRef = useDropRef(dropConnector);

  return (
    <DropTargetOver
      ref={dropRef}
      style={merged}
      onClick={() => dispatch(moveCursorTo({ to: wandIndex }))}
      className={className}
    >
      {children}
    </DropTargetOver>
  );
};
