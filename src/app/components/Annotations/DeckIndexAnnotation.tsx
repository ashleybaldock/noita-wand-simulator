import styled from 'styled-components';
import { useConfig } from '../../redux';

const IndexDiv = styled.div`
  pointer-events: none;
  position: absolute;
  bottom: -2px;
  right: 2px;
  z-index: var(--zindex-note-deckidx);
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

export const DeckIndexAnnotation = ({
  deckIndex,
}: {
  deckIndex?: number | string;
}) => {
  const { showDeckIndexes } = useConfig();

  if (deckIndex === undefined || !showDeckIndexes) {
    return null;
  }

  if (typeof deckIndex === 'number') {
    return <IndexDiv>{deckIndex + 1}</IndexDiv>;
  } else {
    return <IndexDiv>{deckIndex}</IndexDiv>;
  }
};
