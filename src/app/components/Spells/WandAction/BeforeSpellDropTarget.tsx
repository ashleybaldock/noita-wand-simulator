import styled from 'styled-components';
import { useDrop } from 'react-dnd';
import { useCallback } from 'react';
import { useAppDispatch, useCursors } from '../../../redux/hooks';
import { BetweenSpellsDropTarget } from './BetweenSpellsDropTarget';
import { insertSpellBefore, moveSpell } from '../../../redux/wandSlice';
import type { WandIndex } from '../../../redux/WandIndex';
import { isMainWandIndex } from '../../../redux/WandIndex';
import { moveCursorTo } from '../../../redux/editorSlice';
import { WithDebugHints } from '../../Debug';
import type { Cursor } from './Cursor';
import { defaultCursor } from './Cursor';
import type { DragItemSpell } from './DragItems';

const DropTargetBefore = styled(BetweenSpellsDropTarget)`
  top: 0;
  width: calc(var(--bsize-spell) * 0.625);
  left: calc(var(--bsize-spell) * -0.3125);
  z-index: var(--zindex-insert-before);

  &&::after {
    ${({ $isDraggingOver }) =>
      $isDraggingOver
        ? `
    cursor: e-resize;
          `
        : `
    cursor: text;
      `}
    ${({ $selection }) =>
      $selection === 'start' || $selection === 'single'
        ? `
    cursor: ew-resize;
    background-image: url('/data/inventory/cursor-select-mid.png');
          `
        : ``}
  }

  ${WithDebugHints} && {
    background-color: rgba(255, 255, 0, 0.2);
  }
`;
export const BeforeSpellDropTarget = ({
  wandIndex,
  className = '',
}: {
  wandIndex: WandIndex;
  className?: string;
}) => {
  const dispatch = useAppDispatch();
  const cursors = useCursors();
  const cursor: Cursor = isMainWandIndex(wandIndex)
    ? cursors[wandIndex]
    : defaultCursor;

  const handleDrop = useCallback(
    (item: DragItemSpell) => {
      if (item.sourceWandIndex === undefined) {
        if (isMainWandIndex(wandIndex)) {
          dispatch(
            insertSpellBefore({ spell: item.actionId, index: wandIndex }),
          );
        }
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

  const [{ isOver, isDraggingAction, isDraggingSelect }, dropRef] = useDrop(
    () => ({
      accept: 'spell',
      drop: (item: DragItemSpell, monitor) => {
        !monitor.didDrop() && handleDrop(item);
      },
      canDrop: (item: DragItemSpell) =>
        item.sourceWandIndex !== wandIndex &&
        isMainWandIndex(wandIndex) &&
        isMainWandIndex(item.sourceWandIndex) &&
        item.sourceWandIndex !== wandIndex + 1,
      collect: (monitor) => ({
        isDraggingAction: monitor.getItemType() === 'spell',
        isDraggingSelect: monitor.getItemType() === 'select',
        isOver: monitor.isOver() && monitor.canDrop(),
      }),
    }),
    [handleDrop],
  );

  return (
    <DropTargetBefore
      $enabled={isDraggingAction}
      $dropHint={isDraggingAction ? 'shiftleft' : 'none'}
      $pointerEvents={isDraggingAction || isDraggingSelect}
      $isDraggingAction={isDraggingAction}
      $isDraggingOver={isOver}
      $isDraggingSelect={isDraggingSelect}
      $selection={'none'}
      $cursor={cursor?.position === 'before' ? cursor?.style : 'none'}
      onClick={() => dispatch(moveCursorTo({ to: wandIndex }))}
      className={className}
      ref={dropRef}
    ></DropTargetBefore>
  );
};
