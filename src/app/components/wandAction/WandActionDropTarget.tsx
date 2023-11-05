import { useDrop } from 'react-dnd';
import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { WandActionDragItem } from '../../types';
import styled from 'styled-components/macro';
import {
  insertSpellBefore,
  insertSpellAfter,
  moveSpell,
  setSpellAtIndex,
  moveCursor,
} from '../../redux/wandSlice';
import { selectConfig } from '../../redux/configSlice';

const DropTargetMain = styled.div<{
  selection: WandSelection;
}>`
  --selection-bdcolor: #00dbff;
  --selection-bgcolor: #0000ff78;
  --selection-bdradius: 3px;
  --selection-bdwidth: 1px;
  --selection-bdstyle: dashed;

  position: relative;
  height: 100%;
  padding: 2px 4px 2px 4px;

  border-style: hidden;
  border-width: var(--selection-bdwidth);
  border-color: var(--selection-bdcolor);

  ${({ selection }) =>
    selection !== 'none'
      ? `
  padding: 2px 4px 2px 4px;
  background-color: var(--selection-bgcolor);
  border-top-style: var(--selection-bdstyle);
  border-bottom-style: var(--selection-bdstyle);
    `
      : ''}
  ${({ selection }) =>
    selection === 'start'
      ? `
  padding: 2px 4px 2px 4px;
  border-left-style: var(--selection-bdstyle);
  border-left-style: hidden;
  border-radius: var(--selection-bdradius) 0 0 var(--selection-bdradius);
    `
      : ''}
  ${({ selection }) =>
    selection === 'end'
      ? `
  padding: 2px 4px 2px 4px;
  border-right-style: var(--selection-bdstyle);
  border-right-style: hidden;
  border-radius: 0 var(--selection-bdradius) var(--selection-bdradius) 0;
    `
      : ''}
  ${({ selection }) =>
    selection === 'single'
      ? `
  padding: 2px 4px 2px 4px;
  border-left-style: var(--selection-bdstyle);
  border-left-style: hidden;
  border-right-style: var(--selection-bdstyle);
  border-right-style: hidden;
  border-radius: var(--selection-bdradius);
    `
      : ''}
`;

const DropTarget = styled.div<{
  enabled: boolean;
  hint?: boolean;
  isDraggingAction: boolean;
  isDraggingOver: boolean;
  isDraggingSelect: boolean;
  selection: WandSelection;
  onClick: React.MouseEventHandler<HTMLElement>;
}>`
  pointer-events: ${({ isDraggingOver }) => (isDraggingOver ? 'auto' : 'none')};

  background-color: transparent;
  position: absolute;
  height: 100%;
  box-sizing: border-box;

  &::after {
    pointer-events: ${({ isDraggingAction }) =>
      isDraggingAction ? 'none' : 'auto'};
    opacity: 1;

    content: '';
    display: block;
    position: absolute;
    height: 58px;
    --width: 12px;
    width: var(--width);
    top: -2px;
    left: calc(50% - var(--width) / 2);

    border: none;
    padding: 0;

    image-rendering: pixelated;
    filter: opacity(0.1);

    background-image: url('/data/inventory/cursor-top.png'),
      url('/data/inventory/cursor-mid.png');
    background-repeat: no-repeat;
    background-size: 100%;
    background-position: top center, center center;

    ${({ isDraggingOver }) =>
      isDraggingOver
        ? `
        cursor: drop;
        filter: hue-rotate(240deg) opacity(1);
    `
        : ''}
  }
  &:hover::after {
    cursor: text;
    filter: hue-rotate(190deg) opacity(1);
  }
`;
const DropTargetBefore = styled(DropTarget)`
  background-color: rgba(255, 255, 0, 0);
  top: 0;
  width: var(--sizes-before-droptarget-width);
  left: -15px;

  &::after {
    z-index: var(--zindex-insert-before);
  }
`;
const DropTargetAfter = styled(DropTarget)`
  background-color: rgba(255, 0, 0, 0);
  top: 0;
  width: var(--sizes-after-droptarget-width);
  right: -15px;

  &::after {
    z-index: var(--zindex-insert-after);
  }
`;

const Cursor = styled.div<{ position: CursorPosition }>`
  ${({ position }) =>
    position === 'before' || position === 'after'
      ? 'opacity: 1;'
      : 'opacity: 0;'}

  z-index: var(--zindex-cursor-current);

  position: absolute;
  height: 58px;
  width: 12px;
  top: -2px;
  ${({ position }) =>
    position === 'before'
      ? 'left: -6px;'
      : position === 'after'
      ? 'right: -6px;'
      : 'display: none;'}

  image-rendering: pixelated;
  pointer-events: none;

  background-image: url('/data/inventory/cursor-top.png'),
    url('/data/inventory/cursor-mid.png');
  background-repeat: no-repeat;
  background-size: 100%;
  background-position: top center, center center;
`;

export type CursorPosition = 'none' | 'before' | 'after';
export type WandSelection = 'none' | 'start' | 'thru' | 'end' | 'single';

export const WandActionDropTarget = ({
  onDragChange,
  wandIndex,
  cursor = 'none',
  selection = 'none',
  children,
}: React.PropsWithChildren<{
  wandIndex: number;
  cursor?: CursorPosition;
  selection?: WandSelection;
  onDragChange: (isDrag: boolean) => void;
}>) => {
  const dispatch = useAppDispatch();
  const { config } = useAppSelector(selectConfig);

  const handleDrop = useCallback(
    (item: WandActionDragItem) => {
      if (item.sourceWandIndex === undefined) {
        dispatch(setSpellAtIndex({ spell: item.actionId, index: wandIndex }));
      } else {
        dispatch(
          moveSpell({
            fromIndex: item.sourceWandIndex,
            toIndex: wandIndex,
            mode: config.swapOnMove ? 'swap' : 'overwrite',
          }),
        );
      }
    },
    [config.swapOnMove, dispatch, wandIndex],
  );

  const handleDropBefore = useCallback(
    (item: WandActionDragItem) => {
      if (item.sourceWandIndex === undefined) {
        dispatch(insertSpellBefore({ spell: item.actionId, index: wandIndex }));
      } else {
        dispatch(
          moveSpell({
            fromIndex: item.sourceWandIndex,
            toIndex: wandIndex,
            mode: 'before',
          }),
        );
      }
    },
    [dispatch, wandIndex],
  );

  const handleDropAfter = useCallback(
    (item: WandActionDragItem) => {
      if (item.sourceWandIndex === undefined) {
        dispatch(insertSpellAfter({ spell: item.actionId, index: wandIndex }));
      } else {
        dispatch(
          moveSpell({
            fromIndex: item.sourceWandIndex,
            toIndex: wandIndex,
            mode: 'after',
          }),
        );
      }
    },
    [dispatch, wandIndex],
  );

  const [{ isOver, isDraggingAction, isDraggingSelect }, drop] = useDrop(
    () => ({
      accept: 'action',
      drop: (item: WandActionDragItem, monitor) => {
        if (!monitor.didDrop()) {
          handleDrop(item);
        }
      },
      canDrop: (item: WandActionDragItem) => item.sourceWandIndex !== wandIndex,
      collect: (monitor) => ({
        isOver: monitor.isOver({ shallow: true }) && monitor.canDrop(),
        isDraggingAction: monitor.getItemType() === 'action',
        isDraggingSelect: monitor.getItemType() === 'select',
      }),
    }),
    [handleDrop],
  );

  const [{ isOver: isOverBefore }, dropBefore] = useDrop(
    () => ({
      accept: 'action',
      drop: (item: WandActionDragItem) => handleDropBefore(item),
      canDrop: (item: WandActionDragItem) => item.sourceWandIndex !== wandIndex,
      collect: (monitor) => ({
        isOver: monitor.isOver() && monitor.canDrop(),
      }),
    }),
    [handleDropBefore],
  );

  const [{ isOver: isOverAfter }, dropAfter] = useDrop(
    () => ({
      accept: 'action',
      drop: (item: WandActionDragItem, monitor) => {
        if (!monitor.didDrop()) {
          handleDropAfter(item);
        }
      },
      canDrop: (item: WandActionDragItem) =>
        item.sourceWandIndex !== wandIndex + 1,
      collect: (monitor) => ({
        isOver: monitor.isOver({ shallow: true }) && monitor.canDrop(),
      }),
    }),
    [handleDropAfter],
  );

  useEffect(() => onDragChange(isOver), [isOver, onDragChange]);

  return (
    <DropTargetMain ref={drop} selection={selection}>
      {children}
      <DropTargetBefore
        ref={dropBefore}
        hint={config.debug?.dragHint}
        onClick={() => dispatch(moveCursor({ to: wandIndex }))}
        isDraggingAction={isDraggingAction}
        isDraggingSelect={isDraggingSelect}
        isDraggingOver={isOverBefore}
        enabled={isDraggingAction}
        selection={selection}
      />
      <DropTargetAfter
        ref={dropAfter}
        hint={config.debug?.dragHint}
        onClick={() => dispatch(moveCursor({ to: wandIndex + 1 }))}
        isDraggingAction={isDraggingAction}
        isDraggingOver={isOverAfter}
        isDraggingSelect={isDraggingSelect}
        enabled={isDraggingAction}
        selection={selection}
      />
      <Cursor position={cursor} />
    </DropTargetMain>
  );
};
