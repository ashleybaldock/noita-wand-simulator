import styled from 'styled-components';
import { useCallback } from 'react';
import { useAppDispatch, useCursor, useSelection } from '../../../redux/hooks';
import { BetweenSpellsDropTarget } from './BetweenSpellsDropTarget';
import { insertSpellBefore, moveSpell } from '../../../redux/wandSlice';
import type { WandIndex } from '../../../redux/WandIndex';
import { isMainWandIndex } from '../../../redux/WandIndex';
import { moveCursorTo, setSelection } from '../../../redux/editorSlice';
import { WithDebugHints } from '../../Debug';
import type { DragItemSelect, DragItemSpell } from './DragItems';

const DropTargetBefore = styled(BetweenSpellsDropTarget)`
  top: 0;
  width: calc(var(--bsize-spell) * 0.625);
  left: calc(var(--bsize-spell) * -0.3125);
  z-index: var(--zindex-insert-before);

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
  const selection = useSelection(wandIndex);
  const cursor = useCursor(wandIndex);

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

  const handleEndSelect = useCallback(
    (item: DragItemSelect) => {
      dispatch(
        setSelection({
          from: item.dragStartIndex,
          to: wandIndex,
          selecting: false,
        }),
      );
    },
    [dispatch, wandIndex],
  );

  const handleDragSelect = useCallback(
    (item: DragItemSelect) => {
      dispatch(
        setSelection({
          from: item.dragStartIndex,
          to: wandIndex,
          selecting: true,
        }),
      );
    },
    [dispatch, wandIndex],
  );

  return (
    <DropTargetBefore
      wandIndex={wandIndex}
      location={'before'}
      overHint={'shiftleft'}
      selection={selection}
      cursorCaret={cursor?.position === 'before' ? cursor?.style : 'none'}
      onClick={() => dispatch(moveCursorTo({ to: wandIndex }))}
      onDropSpell={handleDrop}
      onEndSelect={handleEndSelect}
      onDragSelect={handleDragSelect}
      className={className}
    ></DropTargetBefore>
  );
};
