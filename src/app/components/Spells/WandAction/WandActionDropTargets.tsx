import { useDrag, useDrop } from 'react-dnd';
import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { DragItemSelect, DragItemSpell } from '../../../types';
import {
  insertSpellBefore,
  insertSpellAfter,
  moveSpell,
  setSpellAtIndex,
  moveCursor,
  setSelection,
} from '../../../redux/wandSlice';
import { selectConfig } from '../../../redux/configSlice';
import { WandActionBorder } from './WandActionBorder';
import { Cursor, CursorPosition } from './Cursor';
import {
  DropTargetMain,
  DragDropTargetAfter,
  DragDropTargetBefore,
  WandSelection,
} from './SpellDropTargets';

export const WandActionDropTargets = ({
  wandIndex,
  cursor = 'none',
  selection = 'none',
  children,
}: React.PropsWithChildren<{
  wandIndex: number;
  cursor?: CursorPosition;
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
        drop: (item: DragItemSpell, monitor) =>
          !monitor.didDrop() && handleDropMain(item),
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
      drop: (item: DragItemSpell, monitor) =>
        !monitor.didDrop() && handleDropBefore(item),
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
      drop: (item: DragItemSpell, monitor) =>
        !monitor.didDrop() && handleDropAfter(item),

      canDrop: (item: DragItemSpell) =>
        item.sourceWandIndex !== wandIndex &&
        item.sourceWandIndex !== wandIndex + 1,
      collect: (monitor) => ({
        isOverAfter: monitor.isOver({ shallow: true }) && monitor.canDrop(),
      }),
    }),
    [handleDropAfter],
  );

  const [{ isOverCursor }, dropRefCursor] = useDrop(
    () => ({
      accept: 'select',
      hover: (item: DragItemSelect, monitor) =>
        !monitor.didDrop() &&
        monitor.canDrop() &&
        dispatch(setSelection({ from: item.dragStartIndex, to: wandIndex })),
      drop: (item: DragItemSelect, monitor) =>
        !monitor.didDrop() &&
        dispatch(setSelection({ from: item.dragStartIndex, to: wandIndex })),
      canDrop: (item: DragItemSelect) => item.dragStartIndex !== wandIndex,
      collect: (monitor) => ({
        isOverCursor: monitor.isOver({ shallow: true }) && monitor.canDrop(),
      }),
    }),
    [handleDropAfter],
  );
  const [, dragRefCursor] = useDrag(
    (): { type: string; item: DragItemSelect } => ({
      type: 'select',
      item: { disc: 'select', dragStartIndex: wandIndex },
    }),
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
      <Cursor
        ref={(ref) => dropRefCursor(dragRefCursor(ref))}
        isDraggingAction={isDraggingAction}
        isDraggingSelect={isDraggingSelect}
        isDraggingSelectOver={isDraggingSelect && isOverCursor}
        position={cursor}
      />
    </DropTargetMain>
  );
};
