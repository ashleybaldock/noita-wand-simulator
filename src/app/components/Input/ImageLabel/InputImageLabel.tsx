import styled from 'styled-components';
import { Icon } from '../../Icon/Icon';

export const InputImageLabel = styled(Icon).attrs<{
  $size: number;
  $leftMargin?: string;
}>({})`
  position: relative;
  height: ${({ $size }) => $size}px;
  flex: 0 0 ${({ $size }) => $size}px;
  background-size: cover;
  font-family: monospace;
  font-weight: bold;
  user-select: none;
  image-rendering: pixelated;
  margin: 0 8px 0 ${({ $leftMargin }) => $leftMargin ?? '2px'};

  object-fit: contain;
  background-size: contain;
  background-repeat: no-repeat;
  white-space: nowrap;
`;
