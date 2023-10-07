import styled from 'styled-components/macro';

const WandActionBorder = styled.div`
  width: var(--sizes-spell-base);
  height: var(--sizes-spell-base);
  padding: calc(var(--sizes-spell-base) * 0.0625);
  background-image: url(/data/inventory/full_inventory_box.png);
  background-size: cover;
  image-rendering: pixelated;
`;

export default WandActionBorder;
