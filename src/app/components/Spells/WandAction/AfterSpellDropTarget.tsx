import { useCallback } from 'react';
import { useAppDispatch, useCursors, useSelection } from '../../../redux/hooks';
import { BetweenSpellsDropTarget } from './BetweenSpellsDropTarget';
import type { DragItemSelect, DragItemSpell } from './DragItems';
import { insertSpellAfter, moveSpell } from '../../../redux/wandSlice';
import type { WandIndex } from '../../../redux/WandIndex';
import { isMainWandIndex } from '../../../redux/WandIndex';
import { moveCursorTo, setSelection } from '../../../redux/editorSlice';
import styled from 'styled-components';
import { WithDebugHints } from '../../Debug';
import type { Cursor } from './Cursor';
import { defaultCursor } from './Cursor';
import type { WandSelection } from '../../../redux/Wand/wandSelection';

const DropTargetAfter = styled(BetweenSpellsDropTarget)`
  top: 0;
  width: calc(var(--bsize-spell) * 0.625);
  right: calc(var(--bsize-spell) * -0.3125);
  z-index: var(--zindex-insert-after);

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
  const selections = useSelection();
  const selection: WandSelection = isMainWandIndex(wandIndex)
    ? selections[wandIndex]
    : 'none';
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

  const handleEndSelect = useCallback(
    (item: DragItemSelect) => {
      if (isMainWandIndex(item.dragStartIndex) && isMainWandIndex(wandIndex)) {
        dispatch(setSelection({ from: item.dragStartIndex, to: wandIndex }));
      }
    },
    [dispatch, wandIndex],
  );

  return (
    <DropTargetAfter
      wandIndex={wandIndex}
      overHint={'shiftright'}
      selection={selection}
      cursor={cursor?.position === 'after' ? cursor?.style : 'none'}
      onClick={() => dispatch(moveCursorTo({ to: wandIndex }))}
      onDropSpell={handleDrop}
      onEndSelect={handleEndSelect}
      className={className}
    ></DropTargetAfter>
  );
};
