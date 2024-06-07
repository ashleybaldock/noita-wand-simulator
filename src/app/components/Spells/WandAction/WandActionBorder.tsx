import styled from 'styled-components';
import { useDrop } from 'react-dnd';

const StyledDiv = styled.div<{
  $highlight: boolean;
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

  ${({ $highlight }) =>
    $highlight
      ? `background-image: url('/data/inventory/full_inventory_box_highlight.png'), url('/data/inventory/full_inventory_box.png');`
      : `background-image: url('/data/inventory/full_inventory_box.png');`}
`;

const WandActionBorder = ({
  className = '',
  children,
}: React.PropsWithChildren<{
  className?: string;
}>) => {
  const [{ canDrop }, dropRef] = useDrop(
    () => ({
      accept: 'spell',
      canDrop: () => false,
      collect: (monitor) => ({
        canDrop: monitor.isOver(),
      }),
    }),
    [],
  );
  return (
    <StyledDiv
      data-name="WandActionBorder"
      $highlight={canDrop}
      ref={dropRef}
      className={className}
    >
      {children}
    </StyledDiv>
  );
};

export const StyledWandActionBorder = styled(WandActionBorder)``;
