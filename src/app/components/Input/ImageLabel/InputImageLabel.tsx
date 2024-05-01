import styled from 'styled-components';

export const InputImageLabel = styled.div<{
  size: number;
  imgUrl: string;
  leftMargin?: string;
  className?: string;
}>`
  position: relative;
  background-color: #111;
  min-width: ${({ size }) => size}px;
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  background-image: url(/${({ imgUrl }) => imgUrl});
  background-size: cover;
  font-family: monospace;
  font-weight: bold;
  user-select: none;
  image-rendering: pixelated;
  margin: 0 4px 0 ${({ leftMargin }) => (leftMargin ? leftMargin : '2px')};

  flex: 1 1;
  object-fit: contain;
  background-size: contain;
  background-repeat: no-repeat;
  white-space: nowrap;
`;
