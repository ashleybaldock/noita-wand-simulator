import styled from 'styled-components';
import { cursorBackgrounds } from './Cursor';
import { mergeRefs, type MergableRef } from '../../../util/mergeRefs';
import type { BackgoundPartLocation } from './BackgroundPart';
import { useDrag, useDrop } from 'react-dnd';
import {
  isDragItemSelect,
  isDragItemSpell,
  type DragItem,
  type DragItemSelect,
  type DragItemSpell,
} from './DragItems';
import type { WandIndex } from '../../../redux/WandIndex';
import { isMainWandIndex } from '../../../redux/WandIndex';
import { dropHintBackgrounds, selectHintBackgrounds } from './DropHint';
import { useMergedBackgrounds } from './useMergeBackgrounds';
import { selectionBackgrounds } from './WandSelection';
import { WithDebugHints } from '../../Debug';
import { DynamicBackground } from './DynamicBackground';
import { moveCursorTo, setSelection } from '../../../redux/editorSlice';
import {
  moveSpell,
  useAppDispatch,
  useCursor,
  useSelection,
} from '../../../redux';
import { noop } from '../../../util';
import { useCallback } from 'react';

const StyledBetweenSpellsDropTarget = styled(DynamicBackground)<{
  onClick: React.MouseEventHandler<HTMLElement>;
  $location: BackgoundPartLocation;
}>`
  position: absolute;
  height: 100%;
  top: 0;
  width: calc(var(--bsize-spell) * 0.625);
  ${({ $location }) =>
    $location === 'before'
      ? `
  left: calc(var(--bsize-spell) * -0.3125);
  z-index: var(--zindex-insert-before);
    `
      : $location === 'after'
      ? `
    right: calc(var(--bsize-spell) * -0.3125);
    z-index: var(--zindex-insert-before);
    `
      : ''}

  box-sizing: border-box;
  image-rendering: pixelated;

  --cursor-container-width: calc(var(--bsize-spell) * 0.625);

  background-color: transparent;

  ${WithDebugHints} && {
    background-color: rgba(255, 0, 0, 0.2);
  }
`;

// --bg-image-hover: var();
// --bg-repeat-hover: ;
// --bg-size-hover: ;
// --bg-position-hover: ;

export const BetweenSpellsDropTarget = ({
  wandIndex,
  className = '',
  onClick = noop,
  ref,
  location = 'before',
}: {
  wandIndex: WandIndex;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLElement>;
  ref?: MergableRef<HTMLDivElement>;

  location: 'before' | 'after';
}) => {
  const dispatch = useAppDispatch();
  const selection = useSelection(wandIndex, location);
  const cursor = useCursor(wandIndex, location);
  const insertIndex =
    location === 'after' && isMainWandIndex(wandIndex)
      ? wandIndex - 1
      : wandIndex;
  const overHint =
    location === 'before'
      ? 'shiftright'
      : location === 'after'
      ? 'shiftleft'
      : 'none';

  const handleDropSpell = useCallback(
    (item: DragItemSpell) => {
      dispatch(
        moveSpell({
          fromIndex: item.sourceWandIndex,
          spellId: item.actionId,
          toIndex: wandIndex,
          mode: location,
        }),
      );
    },
    [dispatch, wandIndex, location],
  );

  const handleEndSelect = useCallback(
    (item: DragItemSelect) => {
      const from = item.dragStartIndex;
      if (isMainWandIndex(from) && isMainWandIndex(wandIndex)) {
        if (from < wandIndex) {
          // selecting to right
          if (location === 'after') {
            return dispatch(
              setSelection({
                from: item.dragStartIndex,
                to: wandIndex,
                selecting: false,
              }),
            );
          }
        }
        if (from > wandIndex) {
          // selecting to left
        }
      }
    },
    [dispatch, wandIndex],
  );

  const handleDragSelect = useCallback(
    (item: DragItemSelect) => {
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

  const [{ isOver, canDrop, isDraggingSpell, isDraggingSelect }, dropRef] =
    useDrop(
      () => ({
        accept: ['spell', 'select'],
        drop: (item: DragItem, monitor) => {
          !monitor.didDrop() &&
            ((isDragItemSpell(item) && handleDropSpell(item)) ||
              (isDragItemSelect(item) && handleEndSelect(item)));
        },
        hover: (item: DragItem) => {
          isDragItemSelect(item) && handleDragSelect(item);
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
      [wandIndex, handleDropSpell, handleEndSelect, handleEndSelect],
    );
  const [, dragRef, dragPreviewRef] = useDrag<
    DragItemSelect,
    DragItemSelect,
    unknown
  >(
    () => ({
      type: 'select',
      item: { disc: 'select', dragStartIndex: wandIndex },
    }),
    [wandIndex],
  );

  const merged = useMergedBackgrounds(
    cursorBackgrounds[cursor][location],
    ((isDraggingSpell && isOver && canDrop && dropHintBackgrounds[overHint]) ||
      (isDraggingSpell && isOver && dropHintBackgrounds[overHint]) ||
      (isDraggingSpell && dropHintBackgrounds.dragging) ||
      (isDraggingSelect &&
        isOver &&
        canDrop &&
        selectHintBackgrounds[overHint]) ||
      (isDraggingSelect && isOver && selectHintBackgrounds[overHint]) ||
      (isDraggingSelect && selectHintBackgrounds.dragging) ||
      dropHintBackgrounds.none)[location],
    selectionBackgrounds[selection][location],
  );
  const mergedHover = useMergedBackgrounds(
    selectionBackgrounds[selection][location],
    cursorBackgrounds['caret-hover'][location],
  );
  const style = { ...merged, ...mergedHover };

  return (
    <StyledBetweenSpellsDropTarget
      className={className}
      style={merged}
      // style={style}
      onClick={() =>
        dispatch(
          moveCursorTo({
            to: insertIndex,
          }),
        )
      }
      $location={location}
      ref={mergeRefs(ref, dropRef, dragRef)}
    ></StyledBetweenSpellsDropTarget>
  );
};
