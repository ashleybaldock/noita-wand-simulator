import styled from 'styled-components';
import { mergeRefs } from '../../../util/mergeRefs';
import type { MergableRef } from '../../../util/mergeRefs';
import { useDrag, useDrop } from 'react-dnd';
import { isDraggedSelection, isDraggedSpell } from './DragItems';
import type { Dragged, DraggedSelection, DraggedSpell } from './DragItems';
import type { MainWandIndex, WandIndex } from '../../../redux/WandIndex';
import { isMainWandIndex } from '../../../redux/WandIndex';
import { WithDebugHints } from '../../Debug';
import { DynamicBackground } from './Backgrounds/DynamicBackground';
import { moveCursorTo, setSelection } from '../../../redux/editorSlice';
import {
  moveSpell,
  useAppDispatch,
  useConfig,
  useCaret,
  useSelection,
  useEditMode,
} from '../../../redux';
import { useCallback, useMemo } from 'react';
import { useMergedBackgrounds } from './Backgrounds/useMergeBackgrounds';
import { caretBackgrounds } from './Backgrounds/Caret';
import { selectionBackgrounds } from './Backgrounds/WandSelection';
import {
  dropHintBackgrounds,
  selectHintBackgrounds,
} from './Backgrounds/DropHint';
import { useDragRef } from '../../../hooks/useDragRef';
import { useDropRef } from '../../../hooks/useDropRef';
import { emptyBackgroundPart } from './Backgrounds/BackgroundPart';
import { DropTargetOver } from './OverSpellDropTarget';

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
  transition-delay: 0ms;

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

  transition-property: background-image, opacity;
  transition-duration: 100ms;
  transition-timing-function: ease;
  transition-delay: 0ms;

  ${DropTargetBackground}:hover & {
    opacity: 1;
  }

  ${DropTargetOver}:hover & {
    opacity: 1;
  }

  ${WithDebugHints} && {
    background-color: red;
  }
  ${WithDebugHints} ${DropTargetBackground}:hover & {
    background-color: #ff06;
  }
`;

export const BetweenSpellsDropTarget = ({
  indexOfSpellBefore,
  indexOfSpellAfter,
  className = '',
  ref,
  $dataName = 'BetweenSpellsDropTarget',
}: {
  indexOfSpellBefore: WandIndex;
  indexOfSpellAfter: WandIndex;
  className?: string;
  ref?: MergableRef<HTMLDivElement>;
  $dataName?: string;
}) => {
  const dispatch = useAppDispatch();

  const { 'editor.enableSelection': enableSelection } = useConfig();
  const selectionForSpellBefore = useSelection(indexOfSpellBefore, 'after');
  const cursorForSpellBefore = useCaret(indexOfSpellBefore);

  const selectionForSpellAfter = useSelection(indexOfSpellBefore, 'before');
  const cursorForSpellAfter = useCaret(indexOfSpellAfter);

  const editMode = useEditMode();
  const insertIndex: MainWandIndex = isMainWandIndex(indexOfSpellBefore)
    ? indexOfSpellBefore
    : 0;

  const handleDropSpell = useCallback(
    (item: DraggedSpell) => {
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
    (item: DraggedSelection) => {
      const from = item.dragStartIndex;
      if (isMainWandIndex(from) && isMainWandIndex(insertIndex)) {
        // const direction = from > insertIndex ? 'left' : 'right';
        return dispatch(
          setSelection({
            from: Math.min(from, insertIndex),
            to: Math.max(from, insertIndex),
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
    (item: DraggedSelection) => {
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

  const [
    { isOver, canDrop, isDraggingSpell, isDraggingSelect },
    dropConnector,
  ] = useDrop(
    () => ({
      accept: ['spell', 'select'],
      drop: (item: Dragged, monitor) => {
        if (monitor.didDrop()) {
          return;
        }
        if (isDraggedSpell(item)) {
          handleDropSpell(item);
        }
        if (isDraggedSelection(item)) {
          handleEndSelect(item);
        }
      },
      hover: (item: Dragged) => {
        if (isDraggedSelection(item)) {
          handleDragSelect(item);
        }
      },
      canDrop: (item: Dragged) =>
        (isDraggedSpell(item) && item.sourceWandIndex !== insertIndex) ||
        (isDraggedSelection(item) && isMainWandIndex(insertIndex)),
      collect: (monitor) => ({
        isDraggingSpell: monitor.getItemType() === 'spell',
        isDraggingSelect: monitor.getItemType() === 'select',
        isOverOver: monitor.isOver({ shallow: true }),
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }),
    [insertIndex, handleDropSpell, handleEndSelect, handleEndSelect],
  );
  const [, dragConnector] = useDrag<
    DraggedSelection,
    DraggedSelection,
    unknown
  >(
    () => ({
      type: 'select',
      item: { disc: 'select', dragStartIndex: insertIndex },
    }),
    [insertIndex],
  );

  const dragRef = useDragRef(dragConnector);
  const dropRef = useDropRef(dropConnector);

  // const merged = useMergedBackgroundVars(
  //   getCssVarForProperty,
  // const overHint = `${editMode.insert.mode}${editMode.insert.direction}`;
  const dropHintBackground = useMemo(() => {
    if (isDraggingSpell) {
      if (isOver) {
        if (canDrop) {
          return dropHintBackgrounds['shiftright'];
        }
        return dropHintBackgrounds['shiftright'];
      }
      return dropHintBackgrounds['dragging'];
    }
    if (isDraggingSelect) {
      if (isOver) {
        if (canDrop) {
          return selectHintBackgrounds['shiftright'];
        }
        return selectHintBackgrounds['shiftright'];
      }
      return selectHintBackgrounds['dragging'];
    }
    return dropHintBackgrounds['none'];
  }, [isDraggingSpell, isDraggingSelect, isOver, canDrop]);

  const merged = useMergedBackgrounds(
    selectionBackgrounds[selectionForSpellBefore]['after'],
    selectionBackgrounds[selectionForSpellAfter]['before'],
    dropHintBackground.before,
    caretBackgrounds[cursorForSpellBefore].before,
    caretBackgrounds[cursorForSpellAfter].after,
  );

  // const mergedHover = useMergedBackgroundVars(
  //   getCssHoverVarForProperty,
  const mergedHover = useMergedBackgrounds(
    selectionBackgrounds[selectionForSpellBefore]['after'],
    selectionBackgrounds[selectionForSpellAfter]['before'],
    isDraggingSelect
      ? emptyBackgroundPart()
      : caretBackgrounds['caret-hover']['before'],
    isDraggingSelect
      ? emptyBackgroundPart()
      : caretBackgrounds['caret-hover']['after'],
  );
  const style = { ...merged, ...mergedHover };

  return (
    <DropTargetBackground
      className={className}
      style={merged}
      data-name={$dataName}
      onClick={() =>
        dispatch(
          moveCursorTo({
            to: insertIndex,
          }),
        )
      }
      ref={mergeRefs(ref, dropRef, dragRef)}
    >
      <HoverBackground style={style} />
    </DropTargetBackground>
  );
};
