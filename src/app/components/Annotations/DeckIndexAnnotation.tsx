import styled from 'styled-components';
import { useConfig } from '../../redux';
import {
  isAlwaysCastIndex,
  isSpecialWandIndex,
  type WandIndex,
} from '../../redux/WandIndex';
import { isNotNullOrUndefined, isNumber } from '../../util';

const IndexDiv = styled.div`
  pointer-events: none;
  user-select: none;
  position: absolute;
  width: 1.4em;
  height: 1.4em;
  padding: 2px 1px 2px 2px;
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
  bottom: -6px;
  right: -6px;
`;

const SpecialIndexDiv = styled(IndexDiv)`
  display: flex;
  font-size: 0.5em;
  line-height: 2;
  align-content: end;
`;
const AlwaysIndexDiv = styled(IndexDiv)`
  display: flex;

  & > span {
    font-size: 0.5em;
    line-height: 2;
    align-content: end;
  }
  & > span:nth-last-child(1) {
    font-size: 1em;
    line-height: 1;
  }
`;

export const DeckIndexAnnotation = ({
  deckIndex,
  wandIndex,
}: {
  deckIndex?: number | string;
  wandIndex?: WandIndex;
  alwaysCast?: boolean;
}) => {
  const { showDeckIndexes } = useConfig();

  const [a, c, n] = wandIndex?.toString?.()?.split('') ?? [];
  if (showDeckIndexes) {
    if (isSpecialWandIndex(wandIndex)) {
      return (
        <SpecialIndexDiv data-name="SpecialDeckIndex">
          {wandIndex}
        </SpecialIndexDiv>
      );
    }
    if (isAlwaysCastIndex(wandIndex)) {
      return (
        <AlwaysIndexDiv data-name="AlwaysCast">
          <span>{a}</span>
          <span>{c}</span>
          <span>{n}</span>
        </AlwaysIndexDiv>
      );
    }
    if (isNotNullOrUndefined(deckIndex)) {
      return (
        <IndexDiv data-name="DeckIndex">
          {isNumber(deckIndex) ? deckIndex + 1 : deckIndex}
        </IndexDiv>
      );
    }
  }
  return null;
};
