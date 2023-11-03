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
  width: 55%;
  left: -35%;
`;
const DropTargetAfter = styled(DropTargetArea)`
  background-color: rgba(255, 0, 0, 0.3);
  top: 0;
  width: 55%;
  right: -30%;
`;

const InsertMarker = styled.div<{
  enabled: boolean;
  isCursor: boolean;
  active: boolean;
}>`
  pointer-events: ${({ enabled }) => (enabled ? 'auto' : 'none')};

  position: absolute;
  height: 120%;
  width: 3px;
  top: -5px;
  left: -10px;

  border: none;
  padding: 0 5px;

  &::before {
    position: absolute;
    content: '';
    height: 100%;
    display: block;
    border-left-color: transparent;
    border-left-width: 3px;
    border-left-style: dotted;

    ${({ isCursor }) =>
      isCursor ? 'border-left-color: var(--color-wand-edit-cursor);' : ''}
    ${({ active }) =>
      active ? 'border-left-color: var(--color-wand-edit-cursor-active);' : ''}
  }

  &:hover {
    cursor: text;
  }
  &:hover::before {
    border-left-color: red;
  }
`;

const InsertBeforeMarker = styled(InsertMarker)`
  z-index: var(--zindex-insert-before);

  &:hover::before {
    border-left-color: red;
  }
`;

const InsertAfterMarker = styled(InsertMarker)`
  z-index: var(--zindex-insert-after);
  left: unset;
  right: -7.5px;

  &:hover::before {
    border-left-color: blue;
  }
`;

const Cursor = styled.div<{ visible: boolean }>`
  ${({ visible }) => (visible ? 'opacity: 1;' : 'opacity: 0;')}

  z-index: var(--zindex-cursor-current);

  position: absolute;
  height: 112%;
  width: 20%;
  top: -6%;
  left: -16.4%;

  image-rendering: pixelated;
  pointer-events: none;

  background-image: url('/data/inventory/cursor-top.png'),
    url('/data/inventory/cursor-mid.png');
  background-repeat: no-repeat;
  background-size: 100%;
  background-position: top center, center center;
`;

type WandEditCursorPosition = 'none' | 'before' | 'after';

type Props = {
  wandIndex: number;
  cursor?: WandEditCursorPosition;
  onDragChange: (isDrag: boolean) => void;
};

export function WandActionDropTarget(props: React.PropsWithChildren<Props>) {
  const { onDragChange, wandIndex, cursor = 'none' } = props;
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
      <Cursor visible={cursor === 'before'} />
    </DropTargetMain>
  );
}
