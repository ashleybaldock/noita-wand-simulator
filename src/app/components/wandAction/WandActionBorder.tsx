import styled from 'styled-components/macro';

export const WandActionBorder = styled.div<{
  highlight?: boolean;
}>`
  width: var(--sizes-spell-base);
  height: var(--sizes-spell-base);
  padding: calc(var(--sizes-spell-base) * 0.0625);
  ${({ highlight }) =>
    highlight
      ? `background-image: url('/data/inventory/full_inventory_box_highlight.png');`
      : `background-image: url('/data/inventory/full_inventory_box.png');`}
  background-size: cover;
  image-rendering: pixelated;
`;
