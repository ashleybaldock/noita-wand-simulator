import styled from 'styled-components/macro';
import { ActionCall } from '../../calc/eval/types';
import { useConfig } from '../../redux';

const IndexDiv = styled.div`
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
} & Partial<ActionCall>;

export function DeckIndexAnnotation(props: Props) {
  const { deckIndex } = props;
  const { config } = useConfig();

  if (deckIndex === undefined || !config.showDeckIndexes) {
    return null;
  }

  if (typeof deckIndex === 'number') {
    return <IndexDiv>{deckIndex + 1}</IndexDiv>;
  } else {
    return <IndexDiv>{deckIndex}</IndexDiv>;
  }
}
