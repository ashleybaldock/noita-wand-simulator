import { useDrop } from 'react-dnd';
import { useCallback } from 'react';
import { useAppDispatch, useConfig, useCursor } from '../../../redux/hooks';
import {
  insertSpellBefore,
  insertSpellAfter,
  moveSpell,
  setSpellAtIndex,
} from '../../../redux/wandSlice';
import { WandActionBorder } from './WandActionBorder';
import {
  DropTargetMain,
  DragDropTargetAfter,
  DragDropTargetBefore,
} from './SpellDropTargets';
import type { WandSelection } from '../../../redux/Wand/wandSelection';
import type { DragItemSpell } from './types';
import { moveCursorTo } from '../../../redux/editorSlice';

export const WandActionDropTargets = ({
  wandIndex,
  alwaysCast = false,
  selection = 'none',
  children,
}: React.PropsWithChildren<{
  wandIndex: number;
  alwaysCast?: boolean;
  selection?: WandSelection;
}>) => {
  const dispatch = useAppDispatch();
  const { swapOnMove, 'debug.dragHint': dragHint } = useConfig();
  const { position: cursorPosition, style: cursorStyle } =
    useCursor()[wandIndex];

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
        onClick={() => dispatch(moveCursorTo({ to: wandIndex }))}
        isBeingDragged={false}
        isDraggingAction={isDraggingAction}
        isDraggingSelect={isDraggingSelect}
        isDraggingOver={isOverBefore}
        enabled={isDraggingAction}
        selection={selection}
        $cursor={cursorPosition === 'before' ? cursorStyle : 'none'}
      />
      <DragDropTargetAfter
        ref={dropRefAfter}
        hint={dragHint}
        onClick={() => dispatch(moveCursorTo({ to: wandIndex + 1 }))}
        isBeingDragged={false}
        isDraggingAction={isDraggingAction}
        isDraggingOver={isOverAfter}
        isDraggingSelect={isDraggingSelect}
        enabled={isDraggingAction}
        selection={selection}
        $cursor={cursorPosition === 'after' ? cursorStyle : 'none'}
      />
      {/* <WandEditCursor */}
      {/*   wandIndex={wandIndex} */}
      {/*   isDropTarget={isDraggingSelect} */}
      {/*   isDragSource={!isDraggingSelect && !isDraggingAction} */}
      {/* /> */}
      {/* <WandEditCursor */}
      {/*   wandIndex={wandIndex} */}
      {/*   isDropTarget={isDraggingSelect} */}
      {/*   isDragSource={!isDraggingSelect && !isDraggingAction} */}
      {/* /> */}
    </DropTargetMain>
  );
};
