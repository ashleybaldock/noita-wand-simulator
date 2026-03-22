import styled from 'styled-components';

const DEFAULT_WIDTH = '3px';

export const WandBorder = styled.div<{
  inactive?: boolean;
  width?: string;
}>`
  position: relative;
  border: ${({ width = DEFAULT_WIDTH }) => width} solid transparent;
  margin: 0 auto;
  width: fit-content;
  margin: 0 auto;
  padding: var(--vpad) var(--pad);
  --usedw: calc(var(--pad) * 2 + var(--bdw) * 2);
  --pad: 1ch;
  --bdw: 3px;
  border: var(--bdw) solid transparent;
  margin: 0;

  background-color: transparent;
  border: ${({ width = DEFAULT_WIDTH }) => width} solid transparent;
  ${({ inactive = false }) =>
    inactive
      ? `border-image-source: url(/data/border_inactive.png);`
      : `border-image-source: url(/data/border_active.png);`}
  border-image-outset: 0;
  border-image-repeat: repeat;
  border-image-slice: 2;
  border-image-width: 2;
  image-rendering: pixelated;

  --vpad: round(nearest, 0.4em, 1px);
  display: flex;
  flex-direction: column;
  row-gap: var(--vpad);
`;
