import { useDrop } from 'react-dnd';
import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import {
  insertSpellBefore,
  insertSpellAfter,
  moveSpell,
  setSpellAtIndex,
  moveCursor,
} from '../../../redux/wandSlice';
import { selectConfig } from '../../../redux/configSlice';
import { WandActionBorder } from './WandActionBorder';
import {
  DropTargetMain,
  DragDropTargetAfter,
  DragDropTargetBefore,
} from './SpellDropTargets';
import { WandEditCursor } from './Cursor';
import { WandSelection } from '../../../redux/Wand/wandSelection';
import { CursorPosition, DragItemSpell } from './types';

export const WandActionDropTargets = ({
  wandIndex,
  selection = 'none',
  children,
}: React.PropsWithChildren<{
  wandIndex: number;
  cursorIndex?: CursorPosition;
  selection?: WandSelection;
}>) => {
  const dispatch = useAppDispatch();
  const {
    config: {
      swapOnMove,
      debug: { dragHint },
    },
  } = useAppSelector(selectConfig);

  const handleDropMain = useCallback(
    (item: DragItemSpell) => {
      if (item.sourceWandIndex === undefined) {
        dispatch(setSpellAtIndex({ spell: item.actionId, index: wandIndex }));
      } else {
        dispatch(
          moveSpell({
            fromIndex: item.sourceWandIndex,
            toIndex: wandIndex,
            mode: swapOnMove ? 'swap' : 'overwrite',
          }),
        );
      }
    },
    [swapOnMove, dispatch, wandIndex],
  );

  const handleDropBefore = useCallback(
    (item: DragItemSpell) => {
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
    (item: DragItemSpell) => {
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

  const [{ isOverMain, isDraggingAction, isDraggingSelect }, dropRefMain] =
    useDrop(
      () => ({
        accept: 'spell',
        drop: (item: DragItemSpell, monitor) => {
          !monitor.didDrop() && handleDropMain(item);
        },
        canDrop: (item: DragItemSpell) => item.sourceWandIndex !== wandIndex,
        collect: (monitor) => ({
          isOverMain: monitor.isOver({ shallow: true }) && monitor.canDrop(),
          isDraggingAction: monitor.getItemType() === 'spell',
          isDraggingSelect: monitor.getItemType() === 'select',
        }),
      }),
      [handleDropMain],
    );

  const [{ isOverBefore }, dropRefBefore] = useDrop(
    () => ({
      accept: 'spell',
      drop: (item: DragItemSpell, monitor) => {
        !monitor.didDrop() && handleDropBefore(item);
      },
      canDrop: (item: DragItemSpell) =>
        item.sourceWandIndex !== wandIndex &&
        item.sourceWandIndex !== wandIndex + 1,
      collect: (monitor) => ({
        isOverBefore: monitor.isOver() && monitor.canDrop(),
      }),
    }),
    [handleDropBefore],
  );

  const [{ isOverAfter }, dropRefAfter] = useDrop(
    () => ({
      accept: 'spell',
      drop: (item: DragItemSpell, monitor) => {
        !monitor.didDrop() && handleDropAfter(item);
      },
      canDrop: (item: DragItemSpell) =>
        item.sourceWandIndex !== wandIndex &&
        item.sourceWandIndex !== wandIndex + 1,
      collect: (monitor) => ({
        isOverAfter: monitor.isOver({ shallow: true }) && monitor.canDrop(),
      }),
    }),
    [handleDropAfter],
  );
  return (
    <DropTargetMain ref={dropRefMain} selection={selection}>
      <WandActionBorder highlight={isOverMain}>{children}</WandActionBorder>
      <DragDropTargetBefore
        ref={dropRefBefore}
        hint={dragHint}
        onClick={() => dispatch(moveCursor({ to: wandIndex }))}
        isBeingDragged={false}
        isDraggingAction={isDraggingAction}
        isDraggingSelect={isDraggingSelect}
        isDraggingOver={isOverBefore}
        enabled={isDraggingAction}
        selection={selection}
      />
      <DragDropTargetAfter
        ref={dropRefAfter}
        hint={dragHint}
        onClick={() => dispatch(moveCursor({ to: wandIndex + 1 }))}
        isBeingDragged={false}
        isDraggingAction={isDraggingAction}
        isDraggingOver={isOverAfter}
        isDraggingSelect={isDraggingSelect}
        enabled={isDraggingAction}
        selection={selection}
      />
      <WandEditCursor
        wandIndex={wandIndex}
        isDropTarget={isDraggingSelect}
        isDragSource={!isDraggingSelect && !isDraggingAction}
      />
      <WandEditCursor
        wandIndex={wandIndex}
        isDropTarget={isDraggingSelect}
        isDragSource={!isDraggingSelect && !isDraggingAction}
      />
    </DropTargetMain>
  );
};
