import styled from 'styled-components/macro';
import { ActionCall, GroupedProjectile } from '../../calc';
import { useConfig } from '../../redux';
import { DEFAULT_SIZE } from '../../util';

const IndexDiv = styled.div<{
  size: number;
}>`
  pointer-events: none;
  position: absolute;
  bottom: -6px;
  right: -6px;
  color: rgb(255, 255, 255);
  font-size: 14px;
  font-family: var(--font-family-noita-default);
  font-weight: normal;
  --shadow-bg: rgb(0, 0, 0);
  --shadow-w: 0px;
  text-shadow: var(--shadow-bg) 1px 1px var(--shadow-w),
    var(--shadow-bg) 1px -1px var(--shadow-w),
    var(--shadow-bg) -1px 1px var(--shadow-w),
    var(--shadow-bg) -1px -1px var(--shadow-w), var(--shadow-bg) 1px 1px 1px,
    var(--shadow-bg) 1px -1px 1px, var(--shadow-bg) -1px 1px 1px,
    var(--shadow-bg) -1px -1px 1px;
`;

type Props = {
  size?: number;
  deckIndex?: number | string;
} & Partial<ActionCall> &
  Partial<GroupedProjectile>;

export function DeckIndexAnnotation(props: Props) {
  const { size = DEFAULT_SIZE, deckIndex } = props;
  const { config } = useConfig();

  if (deckIndex === undefined || !config.showDeckIndexes) {
    return null;
  }

  if (typeof deckIndex === 'number') {
    return <IndexDiv size={size}>{deckIndex + 1}</IndexDiv>;
  } else {
    return <IndexDiv size={size}>{deckIndex}</IndexDiv>;
  }
}
