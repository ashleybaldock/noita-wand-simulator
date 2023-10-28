import { useDrag } from 'react-dnd';

import styled from 'styled-components/macro';
import { ActionId } from '../../calc/actionId';

const StyledDiv = styled.div<{
  isDragging: boolean;
}>`
  opacity: ${({ isDragging }) => (isDragging ? 0.3 : 1)};
  flex: 1 1;
  max-width: max-content;
  max-width: fit-content;
  min-width: min-content;

  ${({ isDragging }) =>
    isDragging
      ? ``
      : `
    &&:hover > div > div {
      z-index: 1000;
    }
   `}
`;

type Props = {
  actionId: ActionId;
  sourceWandIndex?: number;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
};

export function WandActionDragSource({
  children,
  onClick,
  actionId,
  sourceWandIndex,
}: React.PropsWithChildren<Props>) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'action',
    item: { actionId: actionId, sourceWandIndex: sourceWandIndex },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <StyledDiv ref={drag} isDragging={isDragging} onClick={onClick}>
      {children}
    </StyledDiv>
  );
}
