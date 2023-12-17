import { useDrag } from 'react-dnd';

import styled from 'styled-components';
import { ActionId } from '../../../calc/actionId';

const ActionDragSource = styled.div<{
  isDragging: boolean;
}>`
  flex: 1 1;
  max-width: max-content;
  max-width: fit-content;
  min-width: min-content;

  ${({ isDragging }) =>
    isDragging
      ? `
    opacity: 0.4;
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
  sourceWandIndex?: number;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}>) => {
  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: 'spell',
    item: { actionId, sourceWandIndex },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <ActionDragSource ref={dragRef} isDragging={isDragging} onClick={onClick}>
      {children}
    </ActionDragSource>
  );
};
