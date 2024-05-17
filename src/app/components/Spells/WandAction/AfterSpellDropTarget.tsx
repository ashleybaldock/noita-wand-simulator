import { useDrop } from 'react-dnd';
import { useCallback } from 'react';
import { useAppDispatch, useCursors } from '../../../redux/hooks';
import { BetweenSpellsDropTarget } from './BetweenSpellsDropTarget';
import type { DragItemSpell } from './DragItems';
import { insertSpellAfter, moveSpell } from '../../../redux/wandSlice';
import type { WandIndex } from '../../../redux/WandIndex';
import { isMainWandIndex } from '../../../redux/WandIndex';
import { moveCursorTo } from '../../../redux/editorSlice';
import styled from 'styled-components';
import { WithDebugHints } from '../../Debug';
import type { Cursor } from './Cursor';
import { defaultCursor } from './Cursor';

const DropTargetAfter = styled(BetweenSpellsDropTarget)`
  top: 0;
  width: calc(var(--bsize-spell) * 0.625);
  right: calc(var(--bsize-spell) * -0.3125);
  z-index: var(--zindex-insert-after);

  &&::after {
    ${({ $isDraggingOver, $isDraggingAction, $isDraggingSelect }) => `
    cursor: text;

      ${
        $isDraggingOver &&
        `
    cursor: w-resize;
        `
      }

      ${
        $isDraggingOver &&
        $isDraggingSelect &&
        `
        `
      }

      ${
        $isDraggingOver &&
        $isDraggingAction &&
        `
        `
      }
      `}

    ${({ $selection }) =>
      $selection === 'end' || $selection === 'single'
        ? `
    cursor: ew-resize;
    background-image: url('/data/inventory/cursor-select-mid.png');
          `
        : ``}
  }

  ${WithDebugHints} && {
    background-color: rgba(255, 0, 0, 0.2);
  }
`;

export const AfterSpellDropTarget = ({
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
            insertSpellAfter({ spell: item.actionId, index: wandIndex }),
          );
        }
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

  const [{ isOver, canDrop, isDraggingAction, isDraggingSelect }, dropRef] =
    useDrop(
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
          isOver: monitor.isOver(),
          canDrop: monitor.canDrop(),
        }),
      }),
      [handleDrop],
    );

  return (
    <DropTargetAfter
      $enabled={isDraggingAction}
      $dropHint={isDraggingAction ? 'shiftleft' : 'none'}
      $pointerEvents={isDraggingAction || isDraggingSelect}
      $isDraggingAction={isDraggingAction}
      $isDraggingOver={isOver}
      $isDraggingSelect={isDraggingSelect}
      $selection={'none'}
      $cursor={cursor?.position === 'after' ? cursor?.style ?? 'none' : 'none'}
      onClick={() => dispatch(moveCursorTo({ to: wandIndex }))}
      className={className}
      ref={dropRef}
    ></DropTargetAfter>
  );
};
