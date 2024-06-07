import { useDrag } from 'react-dnd';

import styled from 'styled-components';
import type { ActionId } from '../../../calc/actionId';
import type { WandIndex } from '../../../redux/WandIndex';
import type { DragItemSpell } from './DragItems';

type ActionDragSourceMonitor = {
  isDragging: boolean;
};

const ActionDragSource = styled.div<{
  $isDragging: boolean;
}>`
  flex: 1 1;
  max-width: max-content;
  max-width: fit-content;
  min-width: min-content;

  ${({ $isDragging }) =>
    $isDragging
      ? `
    pointer-events: none;
    cursor: grabbing;
      `
      : `
    opacity: 1;
    pointer-events: auto;
    cursor: grab;
    &&:hover > div > div {
      z-index: 1000;
    }
     `}
`;

export const WandActionDragSource = ({
  children,
  onClick,
  actionId,
  sourceWandIndex,
}: React.PropsWithChildren<{
  actionId: ActionId;
  sourceWandIndex?: WandIndex;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}>) => {
  const [{ isDragging }, dragRef] = useDrag<
    DragItemSpell,
    DragItemSpell,
    ActionDragSourceMonitor
  >(() => ({
    type: 'spell',
    item: { disc: 'spell', actionId, sourceWandIndex },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <ActionDragSource ref={dragRef} $isDragging={isDragging} onClick={onClick}>
      {children}
    </ActionDragSource>
  );
};
