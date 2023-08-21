import styled from 'styled-components/macro';
// import { useConfig } from '../../redux';
import { DEFAULT_SIZE } from '../../util';

export const SourceDiv = styled.div<{
  size: number;
  colors: [string, string];
}>`
  pointer-events: none;
  position: absolute;
  top: 10%;
  left: -${({ size }) => size / 4 + 12}px;
  width: ${({ size }) => size / 4}px;
  height: ${({ size }) => size / 4}px;
  border: 1px solid #999;
  border: none;
  background-image: url(/data/warnings/icon_warning.png);
  color: ${({ colors }) => colors[0]};
  background-color: ${({ colors }) => colors[1]};
  background-color: transparent;
  font-size: 12px;
  line-height: ${({ size }) => size / 3 - 2}px;
  text-align: center;
  font-family: var(--font-family-noita-default);
  opacity: 0;
`;

type Props = {
  size: number;
};

export function NoManaAnnotation(props: Props) {
  const { size = DEFAULT_SIZE } = props;
  // const { config } = useConfig();
  //
  return <SourceDiv size={size} colors={['#000', '#fff']}></SourceDiv>;
}
