import styled from 'styled-components';

export const SourceDiv = styled.div<{
  colors: [string, string];
}>`
  pointer-events: none;
  position: absolute;
  top: 10%;
  left: calc(-1 * var(--bsize-spell) / 4 + 12px);
  width: calc(var(--bsize-spell) / 4);
  height: calc(var(--bsize-spell) / 4);
  border: 1px solid #999;
  border: none;
  background-image: url(/data/warnings/icon_warning.png);
  color: ${({ colors }) => colors[0]};
  background-color: ${({ colors }) => colors[1]};
  background-color: transparent;
  font-size: 12px;
  line-height: calc(var(--bsize-spell) / 3 - 2px);
  text-align: center;
  font-family: var(--font-family-noita-default);
  opacity: 0;
`;

export function NoManaAnnotation() {
  // const { config } = useConfig();
  //
  return <SourceDiv colors={['#000', '#fff']}></SourceDiv>;
}
