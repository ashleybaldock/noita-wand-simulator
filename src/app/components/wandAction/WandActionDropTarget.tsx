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

const InsertMarker = styled.div<{ isCursor: boolean; active: boolean }>`
  position: absolute;
  height: 120%;
  width: 1px;
  top: -5px;

  border-left-color: transparent;
  ${({ isCursor }) =>
    isCursor ? 'border-left-color: var(--color-wand-edit-cursor);' : ''}
  ${({ active }) =>
    active ? 'border-left-color: var(--color-wand-edit-cursor-active);' : ''}
  border-left-width: 3px;
  border-left-style: dotted;
  z-index: 1;
  pointer-events: none;
`;

const Cursor = styled.div<{ visible: boolean }>`
  ${({ visible }) => (visible ? 'opacity: 1;' : 'opacity: 0;')}

  position: absolute;
  height: 118%;
  width: 50%;
  top: -9%;
  left: -16.4%;

  background-image: url('/data/inventory/cursor.png');
  background-image: url('/data/inventory/cursor-mid.png'),
    url('/data/inventory/cursor-top.png'),
    url('/data/inventory/cursor-bottom.png');
  background-repeat: no-repeat;
  background-size: 56%;
  background-position: center, top center, bottom center;

  image-rendering: pixelated;
  z-index: 1;
  pointer-events: none;

  position: absolute;
  height: 112%;
  width: 20%;
  top: -6%;
  background-image: url('/data/inventory/cursor.png');
  background-image: url('/data/inventory/cursor-bottom.png'),
    url('/data/inventory/cursor-top.png'), url('/data/inventory/cursor-mid.png');
  background-repeat: no-repeat;
  background-size: 100%;
  background-position: bottom center, top center, center center;
  image-rendering: pixelated;
  z-index: 1;
  pointer-events: none;
`;

const InsertBeforeMarker = styled(InsertMarker)`
  left: -5px;
`;

const InsertAfterMarker = styled(InsertMarker)`
  right: -4px;
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

  const [{ isOver, isDragging }, drop] = useDrop(
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
        isDragging: monitor.getItemType() === 'action',
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
        enabled={isDragging}
        hint={config.debug?.dragHint}
      />
      <InsertBeforeMarker
        active={isOverBefore}
        isCursor={cursor === 'before'}
      />
      <DropTargetAfter
        ref={dropAfter}
        enabled={isDragging}
        hint={config.debug?.dragHint}
      />
      <InsertAfterMarker active={isOverAfter} isCursor={cursor === 'after'} />
      <Cursor visible={cursor === 'before'} />
    </DropTargetMain>
  );
}
