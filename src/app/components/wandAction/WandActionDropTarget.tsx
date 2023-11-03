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

const DropTargetMain = styled.div`
  position: relative;
  height: 100%;
`;
const DropTargetArea = styled.div<{ enabled: boolean; hint?: boolean }>`
  pointer-events: ${({ enabled }) => (enabled ? 'auto' : 'none')};
  opacity: ${({ hint, enabled }) => (hint ? (enabled ? '0.8' : '0.5') : '0')};

  background-color: transparent;
  position: absolute;
  height: 100%;
  box-sizing: border-box;
`;
const DropTargetBefore = styled(DropTargetArea)`
  background-color: rgba(255, 255, 0, 0.3);
  top: 0;
  width: var(--sizes-before-droptarget-width);
  left: calc(
    (
        var(--sizes-spelledit-grid-layout-gap) / 2 +
          var(--sizes-after-droptarget-width) / 2
      ) * -1
  );
`;
const DropTargetAfter = styled(DropTargetArea)`
  background-color: rgba(255, 0, 0, 0.3);
  top: 0;
  width: var(--sizes-after-droptarget-width);
  right: calc(
    (
        var(--sizes-spelledit-grid-layout-gap) / 2 +
          var(--sizes-after-droptarget-width) / 2
      ) * -1
  );
`;

const InsertMarker = styled.div<{
  enabled: boolean;
  isCursor: boolean;
  active: boolean;
}>`
  pointer-events: ${({ enabled }) => (enabled ? 'auto' : 'none')};

  position: absolute;
  height: 58px;
  width: 12px;
  top: -3px;
  left: -10px;

  border: none;
  padding: 0;

  image-rendering: pixelated;

  background-image: url('/data/inventory/cursor-top.png'),
    url('/data/inventory/cursor-mid.png');
  background-repeat: no-repeat;
  background-size: 100%;
  background-position: top center, center center;

  filter: hue-rotate(190deg) opacity(0.1);

  ${({ active }) =>
    active
      ? `
      top: -4px;
      cursor: drop;
      filter: hue-rotate(240deg) opacity(1);
  `
      : ''}
  }

  &:hover {
    top: -4px;
    cursor: text;
    filter: hue-rotate(190deg) opacity(1);
  }
`;

const InsertBeforeMarker = styled(InsertMarker)`
  z-index: var(--zindex-insert-before);
  background-color: rgba(255, 0, 0, 0.1);
`;

const InsertAfterMarker = styled(InsertMarker)`
  z-index: var(--zindex-insert-after);

  image-rendering: pixelated;
`;

const Cursor = styled.div<{ position: WandEditCursorPosition }>`
  ${({ position }) =>
    position === 'before' || position === 'after'
      ? 'opacity: 1;'
      : 'opacity: 0;'}

  z-index: var(--zindex-cursor-current);

  position: absolute;
  height: 58px;
  width: 12px;
  top: -4px;
  ${({ position }) =>
    position === 'before'
      ? 'left: -10px;'
      : position === 'after'
      ? 'right: -10px;'
      : 'display: none;'}

  image-rendering: pixelated;
  pointer-events: none;

  background-image: url('/data/inventory/cursor-top.png'),
    url('/data/inventory/cursor-mid.png');
  background-repeat: no-repeat;
  background-size: 100%;
  background-position: top center, center center;
`;

type WandEditCursorPosition = 'none' | 'before' | 'after';
type WandEditSelection = 'none' | 'start' | 'thru' | 'end' | 'single';

type Props = {
  wandIndex: number;
  cursor?: WandEditCursorPosition;
  selection?: WandEditSelection;
  onDragChange: (isDrag: boolean) => void;
};

export function WandActionDropTarget(props: React.PropsWithChildren<Props>) {
  const {
    onDragChange,
    wandIndex,
    cursor = 'none',
    selection = 'none',
  } = props;
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

  const [{ isOver, isDraggingAction }, drop] = useDrop(
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
    <DropTargetMain ref={drop}>
      {props.children}
      <DropTargetBefore
        ref={dropBefore}
        enabled={isDraggingAction}
        hint={config.debug?.dragHint}
      />
      <InsertBeforeMarker
        active={isOverBefore}
        enabled={!isDraggingAction}
        isCursor={cursor === 'before'}
        onClick={() => dispatch(moveCursor({ to: wandIndex }))}
      />
      <DropTargetAfter
        ref={dropAfter}
        enabled={isDraggingAction}
        hint={config.debug?.dragHint}
      />
      <InsertAfterMarker
        active={isOverAfter}
        enabled={!isDraggingAction}
        isCursor={cursor === 'after'}
        onClick={() => dispatch(moveCursor({ to: wandIndex + 1 }))}
      />
      <Cursor position={cursor} />
    </DropTargetMain>
  );
}
