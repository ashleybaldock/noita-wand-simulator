import styled from 'styled-components';
import type { WandSelection } from '../../../redux/Wand/wandSelection';
import { useCallback } from 'react';
import type { DragItemSpell } from './DragItems';
import {
  moveSpell,
  setSpellAtIndex,
  useAppDispatch,
  useConfig,
} from '../../../redux';
import { useDrop } from 'react-dnd';
import { moveCursorTo } from '../../../redux/editorSlice';
import type { WandIndex } from '../../../redux/WandIndex';

const DropTargetOver = styled.div<{
  $selection: WandSelection;
}>`
  --selection-bdcolor: #00dbff;
  --selection-bgcolor: #0000ff78;
  --selection-bdradius: 3px;
  --selection-bdwidth: 1px;
  --selection-bdstyle: dashed;

  position: relative;
  height: 100%;
  padding: calc(var(--bsize-spell) * 0.04) calc(var(--bsize-spell) * 0.08);

  border-style: dashed hidden;
  border-width: var(--selection-bdwidth);
  border-color: transparent;

  ${({ $selection }) =>
    $selection !== 'none'
      ? `
  background-color: var(--selection-bgcolor);
  border-top-color: var(--selection-bdcolor);
  border-bottom-color: var(--selection-bdcolor);
    `
      : ''}
  ${({ $selection }) =>
    $selection === 'start'
      ? `
  border-radius: var(--selection-bdradius) 0 0 var(--selection-bdradius);
    `
      : ''}
  ${({ $selection }) =>
    $selection === 'end'
      ? `
  border-radius: 0 var(--selection-bdradius) var(--selection-bdradius) 0;
    `
      : ''}
  ${({ $selection }) =>
    $selection === 'single'
      ? `
  border-radius: var(--selection-bdradius);
    `
      : ''}
`;

export const OverSpellDropTarget = ({
  wandIndex,
  className = '',
  children,
}: React.PropsWithChildren<{
  wandIndex: WandIndex;
  className?: string;
}>) => {
  const dispatch = useAppDispatch();
  const { swapOnMove } = useConfig();

  const handleDrop = useCallback(
    (item: DragItemSpell) => {
      if (item.sourceWandIndex === undefined) {
        dispatch(setSpellAtIndex({ spellId: item.actionId, wandIndex }));
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

  const [, dropRef] = useDrop(
    () => ({
      accept: 'spell',
      drop: (item: DragItemSpell, monitor) => {
        !monitor.didDrop() && handleDrop(item);
      },
      canDrop: (item: DragItemSpell) => item.sourceWandIndex !== wandIndex,
    }),
    [handleDrop],
  );
  return (
    <DropTargetOver
      $selection={'none'}
      onClick={() => dispatch(moveCursorTo({ to: wandIndex }))}
      className={className}
      ref={dropRef}
    >
      {children}
    </DropTargetOver>
  );
};
