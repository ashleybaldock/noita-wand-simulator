import styled from 'styled-components/macro';

const SourceDiv = styled.div<{
  colors: [string, string];
}>`
  pointer-events: none;
  position: absolute;
  top: 10%;
  transform: translateY(-50%);
  left: calc(-1 * var(--sizes-spell-base) / 4 + 12px);
  width: calc(var(--sizes-spell-base) / 4);
  height: calc(var(--sizes-spell-base) / 4);
  border: 1px solid #999;
  border: none;
  color: ${({ colors }) => colors[0]};
  background-color: ${({ colors }) => colors[1]};
  background-color: transparent;
  background-image: url(/data/warnings/icon_danger.png);
  font-size: 12px;
  line-height: calc(var(--sizes-spell-base) / 3 - 2px);
  text-align: center;
  font-family: var(--font-family-noita-default);
  opacity: 0;
`;

type Props = {};

export function FriendlyFireAnnotation(props: Props) {
  // const { config } = useConfig();

  return <SourceDiv colors={['#000', '#fff']}></SourceDiv>;
}
