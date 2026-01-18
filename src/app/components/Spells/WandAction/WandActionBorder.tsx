import styled from 'styled-components';
import { useDrop } from 'react-dnd';
import { useDropRef } from '../../../hooks/useDropRef';
import { BetweenSpellsDropTarget } from './BetweenSpellsDropTarget';

const StyledDiv = styled.div<{
  $highlight: boolean;
  $disabled: boolean;
}>`
  --size-spell: var(--bsize-spell, 1em);
  --xsize-spell-border: var(--bxsize-spell-border, 0.0625);
  --size-spell-border-width: var(
    --bsize-spell-border-width,
    calc(var(--size-spell) + (2 * var(--xsize-spell-border)))
  );

  width: var(--size-spell);
  height: var(--size-spell);
  padding: var(--size-spell-border-width);

  background-size: cover;
  image-rendering: pixelated;

  background-image: var(--sprite-full-inventory-box);

  &:hover {
    background-image: var(--sprite-full-inventory-box);
  }

  ${({ $highlight, $disabled }) =>
    $disabled
      ? `background-image: var(--sprite-inventory-box-inactive), var(--sprite-full-inventory-box);`
      : $highlight
        ? `background-image: var(--sprite-full-inventory-box-highlight), var(--sprite-full-inventory-box);`
        : `background-image: var(--sprite-full-inventory-box);`}
`;

const WandActionBorder = ({
  className = '',
  children,
  droppable = true,
}: React.PropsWithChildren<{
  className?: string;
  droppable?: boolean;
}>) => {
  const [{ canDrop }, dropConnector] = useDrop(
    () => ({
      accept: 'spell',
      canDrop: () => false,
      collect: (monitor) => ({
        canDrop: monitor.isOver(),
      }),
    }),
    [],
  );
  const dropRef = useDropRef(dropConnector);
  return (
    <StyledDiv
      ref={dropRef}
      data-name="WandActionBorder"
      $highlight={droppable && canDrop}
      $disabled={!droppable}
      className={className}
    >
      {children}
    </StyledDiv>
  );
};

export const StyledWandActionBorder = styled(WandActionBorder)``;
