import styled from 'styled-components';
import { cursorBackgrounds } from './Cursor';
import { mergeRefs, type MergableRef } from '../../../util/mergeRefs';
import { useDrag, useDrop } from 'react-dnd';
import {
  isDragItemSelect,
  isDragItemSpell,
  type DragItem,
  type DragItemSelect,
  type DragItemSpell,
} from './DragItems';
import type { MainWandIndex, WandIndex } from '../../../redux/WandIndex';
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
  useConfig,
  useCursor,
  useEditMode,
  useSelection,
} from '../../../redux';
import { useCallback } from 'react';

// right: calc(var(--width) * -0.5);
// z-index: var(--zindex-insert-after);

const DropTargetBackground = styled(DynamicBackground)<{
  onClick: React.MouseEventHandler<HTMLElement>;
}>`
  position: absolute;
  height: 100%;
  top: 0;
  width: var(--width);
  box-sizing: border-box;
  image-rendering: pixelated;

  --width: calc(var(--bsize-spell) * 0.625);
  --cursor-container-width: var(--width);

  background-color: transparent;

  transition-property: background-image, opacity;
  transition-duration: 100ms;
  transition-timing-function: ease;
  transition-delay: 0;

  left: calc(var(--width) * -0.5);
  z-index: var(--zindex-insert-before);

  ${WithDebugHints} && {
    background-color: rgba(255, 0, 0, 0.1);

    &:before {
      content: 'DROP    TARGET';
      position: absolute;
      font-family: monospace;
      position: absolute;
      word-wrap: anywhere;
      text-wrap: wrap;
      display: block;
      top: 6px;
      position: absolute;
      color: aqua;
      line-height: 0.8;
      letter-spacing: 6px;
      left: 6px;
      text-align: center;
      white-space-collapse: break-spaces;
      font-size: 9px;
      font-variant: super;
      filter: drop-shadow(0.6px 0.6px 0 black)
        drop-shadow(-0.6px 0.6px 0.6px black)
        drop-shadow(-0.6px -0.6px 0.6px black)
        drop-shadow(0.6px -0.6px 0.6px black);
    }
  }
`;

const HoverBackground = styled(DynamicBackground)`
  width: 100%;
  height: 100%;
  opacity: 0.1;
  pointer-events: none;

  transition-property: background-image, opacity;
  transition-duration: 100ms;
  transition-timing-function: ease;
  transition-delay: 0;

  ${DropTargetBackground}:hover & {
    opacity: 1;
  }
  ${WithDebugHints} && {
    // background-color: red;
  }
  ${WithDebugHints} ${DropTargetBackground}:hover & {
    // background-color: #ff06;
  }
`;

export const BetweenSpellsDropTarget = ({
  indexOfSpellBefore,
  indexOfSpellAfter,
  className = '',
  ref,
}: {
  indexOfSpellBefore: WandIndex;
  indexOfSpellAfter: WandIndex;
  className?: string;
  ref?: MergableRef<HTMLDivElement>;
}) => {
  const dispatch = useAppDispatch();

  const { 'editor.enableSelection': enableSelection } = useConfig();
  const selectionForSpellBefore = useSelection(indexOfSpellBefore, 'after');
  const cursorForSpellBefore = useCursor(indexOfSpellBefore);

  const selectionForSpellAfter = useSelection(indexOfSpellBefore, 'before');
  const cursorForSpellAfter = useCursor(indexOfSpellAfter);

  const editMode = useEditMode();
  const insertIndex: MainWandIndex = isMainWandIndex(indexOfSpellBefore)
    ? indexOfSpellBefore
    : 0;

  const handleDropSpell = useCallback(
    (item: DragItemSpell) => {
      dispatch(
        moveSpell({
          fromIndex: item.sourceWandIndex,
          spellId: item.actionId,
          toIndex: insertIndex,
        }),
      );
    },
    [dispatch, insertIndex],
  );

  const handleEndSelect = useCallback(
    (item: DragItemSelect) => {
      const from = item.dragStartIndex;
      if (isMainWandIndex(from) && isMainWandIndex(insertIndex)) {
        const direction = from > insertIndex ? 'left' : 'right';
        return dispatch(
          setSelection({
            from: Math.min(from, insertIndex),
            to: Math.max(from, insertIndex + 1),
            // direction === 'left' || $location === 'after'
            // ? insertIndex
            // : Math.max(0, insertIndex - 1),
            selecting: false,
          }),
        );
      }
    },
    [dispatch, insertIndex],
  );

  const handleDragSelect = useCallback(
    (item: DragItemSelect) => {
      dispatch(
        setSelection({
          from: item.dragStartIndex,
          to: insertIndex,
          selecting: true,
        }),
      );
    },
    [dispatch, insertIndex],
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
          (isDragItemSpell(item) && item.sourceWandIndex !== insertIndex) ||
          (isDragItemSelect(item) && isMainWandIndex(insertIndex)),
        collect: (monitor) => ({
          isDraggingSpell: monitor.getItemType() === 'spell',
          isDraggingSelect: monitor.getItemType() === 'select',
          isOver: monitor.isOver(),
          canDrop: monitor.canDrop(),
        }),
      }),
      [insertIndex, handleDropSpell, handleEndSelect, handleEndSelect],
    );
  const [, dragRef] = useDrag<DragItemSelect, DragItemSelect, unknown>(
    () => ({
      type: 'select',
      item: { disc: 'select', dragStartIndex: insertIndex },
    }),
    [insertIndex],
  );

  // const merged = useMergedBackgroundVars(
  //   getCssVarForProperty,
  // const overHint = `${editMode.insert.mode}${editMode.insert.direction}`;
  const merged = useMergedBackgrounds(
    cursorBackgrounds[cursorForSpellBefore]['before'],
    cursorBackgrounds[cursorForSpellAfter]['after'],
    ((isDraggingSpell &&
      isOver &&
      canDrop &&
      dropHintBackgrounds['shiftright']) ||
      (isDraggingSpell && isOver && dropHintBackgrounds['shiftright']) ||
      (isDraggingSpell && dropHintBackgrounds.dragging) ||
      (isDraggingSelect &&
        isOver &&
        canDrop &&
        selectHintBackgrounds['shiftright']) ||
      (isDraggingSelect && isOver && selectHintBackgrounds['shiftright']) ||
      (isDraggingSelect && selectHintBackgrounds['dragging']) ||
      dropHintBackgrounds.none)['before'],
    selectionBackgrounds[selectionForSpellBefore]['after'],
    selectionBackgrounds[selectionForSpellAfter]['before'],
  );
  // const mergedHover = useMergedBackgroundVars(
  //   getCssHoverVarForProperty,
  const mergedHover = useMergedBackgrounds(
    cursorBackgrounds['caret-hover']['before'],
    cursorBackgrounds['caret-hover']['after'],
    selectionBackgrounds[selectionForSpellBefore]['after'],
    selectionBackgrounds[selectionForSpellAfter]['before'],
  );
  // const style = { ...merged, ...mergedHover };

  return (
    <DropTargetBackground
      className={className}
      style={merged}
      onClick={() =>
        dispatch(
          moveCursorTo({
            to: insertIndex,
          }),
        )
      }
      ref={
        enableSelection
          ? mergeRefs(ref, dropRef, dragRef)
          : mergeRefs(ref, dropRef)
      }
    >
      <HoverBackground style={mergedHover} />
    </DropTargetBackground>
  );
};
