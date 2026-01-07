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
  inset: auto calc(var(--bsize-spell-border-width) * -2)
    calc(var(--bsize-spell-border-width) * -2) auto;
  width: 2ch;
  height: 2ch;
  z-index: var(--zindex-note-deckidx);
  color: rgb(255, 255, 255);
  font-size: 14px;
  font-family: var(--font-family-noita-default);
  font-weight: normal;
  text-shadow: var(--ts-outline-1px-black);
  letter-spacing: 0;
  border-radius: 50%;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
  padding: 0;
  margin: 0;
  border: 0;
  background-image: radial-gradient(#000d 20%, #0000 60%);
  background-color: #0000;
`;

const SpecialIndexDiv = styled(IndexDiv)`
  font-size: 0.5em;
  line-height: 2;
  align-content: end;
`;
const AlwaysCastIndexDiv = styled(IndexDiv)`
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
        <AlwaysCastIndexDiv data-name="AlwaysCastIndex">
          <span>{a}</span>
          <span>{c}</span>
          <span>{n}</span>
        </AlwaysCastIndexDiv>
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
