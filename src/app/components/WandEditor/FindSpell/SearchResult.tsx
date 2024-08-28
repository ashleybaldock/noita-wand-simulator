import type { MouseEventHandler } from 'react';
import styled from 'styled-components';
import type { FuzzySearchMatch } from '../../../hooks/useFuzzySearch';
import { FNSP, noop } from '../../../util';
import { WithDebugHints } from '../../Debug';
import { WandAction } from '../../Spells/WandAction';
import type { SearchSpell } from './FindSpell';

const FuzzySearchWandAction = styled(WandAction)`
  opacity: 0.84;
  padding: 0.04em;
  transform-origin: 0.8em 0.8em;

  &:hover {
    opacity: 0.9;
  }
`;

const SearchResultInputWrapper = styled.button`
  border: none;
  background-color: transparent;
  padding: 0;
  margin: 0;
  color: inherit;
  font: inherit;
  display: flex;
  flex: 1 1 100%;
  width: 100%;
  overflow: hidden;
`;

export const SearchResultBase = styled.li<{ $highlight?: boolean }>`
  display: flex;
  align-items: center;
  border-radius: 0.2em;
  border: 2px solid transparent;
  background: transparent;
  cursor: pointer;
  padding: 0;
  margin: 0;
  flex: 1 1 auto;

  ${({ $highlight = false }) =>
    $highlight
      ? `
    background: #1b1b1b;
    border: 2px solid #383838;
    `
      : `
  &:hover {
    background: #171717;
    border: 2px dotted #282828;
  }
    `}
`;

const ResultDetails = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  align-items: stretch;
  flex-direction: row;
  position: relative;
`;

const ResultDebug = styled.div`
  display: none;
  ${WithDebugHints} & {
    display: flex;
  }
  flex-direction: column;
  justify-content: end;
  flex-direction: row;
  position: absolute;
  right: 0;
  bottom: -70%;
`;

const ResultName = styled.span`
  display: inline-flex;
  align-items: center;
  flex: 1 1 auto;
  letter-spacing: 0.04em;
  white-space: pre;

  font-variant: all-small-caps;
  margin-left: 0.8em;
`;

const ResultScore = styled.span`
  display: inline-flex;
  margin-left: 1em;
  justify-content: end;
  text-align: right;
  font-size: 0.6em;
  opacity: 0.2;
  ${SearchResultBase}:hover & {
    opacity: 1;
  }
`;

const ResultMatches = styled.span`
  display: inline-flex;
  margin-left: 1em;
  justify-content: end;
  text-align: right;
  font-size: 0.6em;
  opacity: 0.2;
  ${SearchResultBase}:hover & {
    opacity: 1;
  }
`;

const NotMatch = styled.span`
  border: 0.04em outset transparent;
  padding: 0.04em 0 0.012em 0;
  line-height: 1;
`;
const Match = styled.span`
  color: var(--color-toggle-hover);

  border: 0.04em outset var(--color-arrow-action-highlight);
  padding: 0.04em 0 0.012em 0;
  line-height: 1;
  border-radius: 0 0.2em;
`;

const convertMatches = (
  matchResult: string,
  matches: [number, number][],
): [string, boolean][] => {
  if (matches.length === 0) {
    return [[matchResult, false]];
  }
  const result: [string, boolean][] = [];
  let lastEnd = 0;
  for (let i = 0; i < matches.length; i++) {
    const [matchStart, matchEnd] = matches[i];
    result.push([matchResult.slice(lastEnd, matchStart), false]);
    result.push([matchResult.slice(matchStart, matchEnd + 1), true]);
    lastEnd = matchEnd + 1;
  }
  result.push([matchResult.slice(lastEnd), false]);
  return result;
};

export const SearchResult = ({
  result,
  score,
  matches,
  highlight,
  className,
  onClick = noop,
}: {
  result: SearchSpell;
  score?: number;
  matches: FuzzySearchMatch[];
  highlight: boolean;
  className?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}) => {
  return (
    <SearchResultInputWrapper
      data-name="ResultWrapper"
      onClick={(e) => onClick(e)}
    >
      <SearchResultBase
        data-name="ResultBase"
        $highlight={highlight}
        className={className}
      >
        <FuzzySearchWandAction
          data-name="ResultAction"
          spellId={result.spell.id}
          spellType={result.spell.type}
        ></FuzzySearchWandAction>
        <ResultDetails data-name="ResultDetails">
          <ResultName data-name="ResultName">
            {convertMatches(result.name, matches).map(
              ([resultPart, shouldHighlight], idx) =>
                shouldHighlight ? (
                  <Match key={idx}>{resultPart}</Match>
                ) : (
                  <NotMatch key={idx}>{resultPart}</NotMatch>
                ),
            )}
          </ResultName>
          <ResultDebug data-name="ResultDebug">
            {/* <ResultId>{result.id}</ResultId> */}
            <ResultMatches>
              {matches
                .map(([a, b]) => (a === b ? a : `${a}-${b}`))
                .join(`,${FNSP}`)}
            </ResultMatches>
            <ResultScore>{score?.toFixed(4).slice(1) ?? '??'}</ResultScore>
          </ResultDebug>
        </ResultDetails>
      </SearchResultBase>
    </SearchResultInputWrapper>
  );
};
