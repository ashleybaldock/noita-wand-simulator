import styled from 'styled-components';
import type { FuzzySearchMatch } from '../../hooks/useFuzzySearch';
import useFuzzySearch from '../../hooks/useFuzzySearch';
import type { Spell } from '../../calc/spell';
import { spells } from '../../calc/spells';
import { useHotkeys } from 'react-hotkeys-hook';
import { FNSP, noop } from '../../util';
import { spellTypeInfoMap } from '../../calc/spellTypes';
import { translate } from '../../util/i18n';
import type { MouseEvent, MouseEventHandler, RefObject } from 'react';
import { useMemo, useState } from 'react';
import { WandAction } from '../Spells/WandAction';
import type { Hotkey } from 'react-hotkeys-hook/dist/types';
import { useAppDispatch } from '../../redux';
import {
  insertSpellAfterCursor,
  insertSpellBeforeCursor,
} from '../../redux/editorThunks';
import { WithDebugHints } from '../Debug';
import { mergeRefs } from '../../util/mergeRefs';

const inKeys = [
  'escape',
  'tab',
  'enter',
  'up',
  'down',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '0',
  // 'shift+tab',
  // 'shift+enter',
] as const;

type InKey = (typeof inKeys)[number];
const inKeySet: Set<InKey> = new Set(inKeys);

const isInKey = (key: string): key is InKey => {
  return (inKeySet as Set<string>).has(key);
};

const FuzzySearchWandAction = styled(WandAction)`
  opacity: 0.84;
  padding: 0.04em;
  transform-origin: 0.8em 0.8em;

  &:hover {
    opacity: 0.9;
  }
`;

export type FuzzySearchPlacement = 'page-middle' | 'header-right';

const Wrapper = styled.div<{ $place: FuzzySearchPlacement }>`
  position: fixed;
  display: grid;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  ${({ $place }) =>
    $place === 'page-middle'
      ? `
  place-items: center center;
    `
      : $place === 'header-right'
      ? `
  place-items: start end;
    `
      : `
  place-items: center center;
  `}

  z-index: var(--zindex-findspell);
`;

const Container = styled.div`
  --bsize-spell: 40px;

  display: flex;
  flex-direction: column;
  position: relative;

  height: 28vh;
  max-width: 50vw;
  width: 50vw;

  padding: 0.1em 0.2em;
  margin: 2px;
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

const SearchInput = styled.input.attrs({ type: 'text' })`
  flex: 0 0 0;
  width: 6em;

  margin: 0.3em 0;
  padding: 0.3em 0.5em 0.2em 0.5em;
  box-sizing: border-box;

  width: 100%;
  color: #fff;
  background-color: #222;
  text-align: center;

  font: inherit;
  font-size: 1.4em;
  line-height: 1;
  font-variant: all-small-caps;
  letter-spacing: 2px;

  outline: none;

  border: 4px solid var(--color-tab-border-active);
  border-width: 3px 3px 3px 5px;
  border-radius: 0em 15em 0em 15.1em/12em 54em 0em 54.4em;
  border-style: inset groove;

  &:focus {
    box-shadow: 0px 0 8px 0px #ff710ab8 inset, 0px 0px 10px 3px #680000;
    background-color: #0a0a0a;
  }

  &::placeholder {
    font-size: 0.66em;
    letter-spacing: 0;
    text-align: left;
    color: #666666;
  }
  &:placeholder-shown {
  }

  &:focus:placeholder-shown {
    font-variant: ;
  }
`;

const SearchResults = styled.ol`
  overflow-y: scroll;
  margin: 0.4em 0;
  padding: 0;
  background-color: #0c0c0cf2;
  border: 2px solid var(--color-tab-border-active);
  border-radius: 0 0.4em;
`;

const SearchResultBase = styled.li<{ $highlight?: boolean }>`
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
    `} {
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

const ResultNoMatch = styled(SearchResultBase)`
  justify-content: end;
  &::before {
    content: '...';
  }
`;
const ResultNoQuery = styled(SearchResultBase)`
  justify-content: end;
  &::before {
    content: '...';
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

const SearchResult = ({
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
    <SearchResultInputWrapper onClick={(e) => onClick(e)}>
      <SearchResultBase
        key={result.id}
        $highlight={highlight}
        className={className}
      >
        <FuzzySearchWandAction
          spellId={result.spell.id}
          spellType={result.spell.type}
          spellSprite={result.spell.sprite}
        ></FuzzySearchWandAction>
        <ResultDetails>
          <ResultName>
            {convertMatches(result.name, matches).map(
              ([resultPart, shouldHighlight], idx) =>
                shouldHighlight ? (
                  <Match key={idx}>{resultPart}</Match>
                ) : (
                  <NotMatch key={idx}>{resultPart}</NotMatch>
                ),
            )}
          </ResultName>
          <ResultDebug>
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

type SearchSpell = {
  spell: Spell;
  name: string;
  description: string;
  id: string;
  type: string;
};

/**
 * Search box
 *
 * @param place Location of search box
 *  - 'header-right'
 *  - 'page-center'
 * @param hidden Behaviour when hidden depends on selected place option
 *  - 'header-right': reduced visibility
 *  - 'page-center': display none
 */
export const FindSpell = ({
  place = 'header-right',
  hidden,
  hide = noop,
  className,
  focusRef,
}: {
  place?: FuzzySearchPlacement;
  hidden: boolean;
  className?: string;
  hide: () => void;
  focusRef: RefObject<HTMLInputElement>;
}) => {
  if (hidden && place === 'page-middle') {
    return null;
  }

  const dispatch = useAppDispatch();

  // TODO - create index during build
  const spellDataSet: readonly SearchSpell[] = useMemo(
    () =>
      spells.map(
        (spell): SearchSpell => ({
          spell,
          type: spellTypeInfoMap[spell.type].name,
          id: spell.id,
          name: translate(spell.name),
          description: translate(spell.description),
        }),
      ),
    [spells],
  );

  const { results, searchValue, setSearchValue } = useFuzzySearch<SearchSpell>({
    dataSet: spellDataSet,
    keys: ['name'], //'description', 'id'],
  });

  const filteredResults = results.slice(0, 10);

  const NO_RESULT = 0;
  const FIRST_RESULT = 1;
  type ResultNone = typeof NO_RESULT;
  type ResultFirst = typeof FIRST_RESULT;
  type ResultIndex = ResultNone | ResultFirst | number;

  const [highlight, setHighlight] = useState<ResultIndex>(0);

  const resultCount = filteredResults.length;

  const noQuery = resultCount === 0 && searchValue === '';
  const noResults = resultCount === 0 && searchValue !== '';

  const highlightIsLastResult = highlight >= resultCount;
  const highlightIsFirstResult = highlight <= 0;

  const insertSpell = (before = true) => {
    before
      ? dispatch(
          insertSpellBeforeCursor({
            spellId: filteredResults[highlight].item.spell.id,
          }),
        )
      : dispatch(
          insertSpellAfterCursor({
            spellId: filteredResults[highlight].item.spell.id,
          }),
        );
  };

  const selectResult = (n: ResultIndex) => {
    if (n <= resultCount) {
      setHighlight(n);
      insertSpell();
    }
  };

  const useHotkeysRef = useHotkeys<HTMLInputElement>(
    inKeys,
    (keyEvent, handler) => {
      // (((highlighted + 1) % resultCount) + resultCount) % resultCount,
      const highlightNext = () =>
        highlightIsLastResult
          ? setHighlight(FIRST_RESULT)
          : setHighlight(highlight + 1);

      const highlightPrev = () =>
        highlightIsFirstResult
          ? setHighlight(resultCount)
          : setHighlight(highlight - 1);

      const keyDispatch: Record<
        (typeof inKeys)[number],
        (keyEvent: KeyboardEvent, hotkey: Hotkey) => void
      > = {
        '1': () => selectResult(1),
        '2': () => selectResult(2),
        '3': () => selectResult(3),
        '4': () => selectResult(4),
        '5': () => selectResult(5),
        '6': () => selectResult(6),
        '7': () => selectResult(7),
        '8': () => selectResult(8),
        '9': () => selectResult(9),
        '0': () => selectResult(10),
        'escape': () => (noQuery ? hide() : setSearchValue('')),
        'enter': (_, { shift }) => insertSpell(shift),
        'up': () => highlightPrev(),
        'down': () => highlightNext(),
        'tab': (e, { shift }) => {
          if (shift) {
            if (highlightIsFirstResult) {
              e.preventDefault();
            } else {
              highlightPrev();
            }
          } else {
            if (highlightIsLastResult) {
              e.preventDefault();
            } else {
              highlightNext();
            }
          }
        },
        // (shift ? highlightPrev(() => e.preventDefault()) : highlightNext()) ,
        // 'shift+enter': () => insertHighlightedResult(true),
        // 'shift+tab': () => highlightPrev(),
      };
      // console.log(_, handler.keys, handler.shift, handler);

      handler.keys?.forEach(
        (key: string) => isInKey(key) && keyDispatch[key]?.(keyEvent, handler),
      );
    },
    {
      enableOnFormTags: ['INPUT'],
      ignoreModifiers: true,
      preventDefault: (_, handler): boolean => {
        console.log('pd', _, handler.keys, handler.shift, handler);
        return handler.shift ?? false;
      },
    },
    [
      noQuery,
      resultCount,
      highlight,
      highlightIsFirstResult,
      highlightIsLastResult,
    ],
  );

  const preventLossOfFocus = (e: MouseEvent) => {
    if (!hidden) {
      e.stopPropagation();
      e.preventDefault();
    }
  };

  return (
    <Wrapper
      $place={place}
      className={className}
      onClick={(e) => e.target === e.currentTarget && hide()}
    >
      <Container onMouseDown={(e) => preventLossOfFocus(e)}>
        <SearchInput
          ref={mergeRefs(useHotkeysRef, focusRef)}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          autoComplete="off"
          autoFocus={true}
          placeholder="spell name/id"
        ></SearchInput>
        <SearchResults>
          {noQuery && <ResultNoMatch>No Matches</ResultNoMatch>}
          {noResults && (
            <ResultNoQuery>Start typing to see suggestions</ResultNoQuery>
          )}
          {!noQuery &&
            !noResults &&
            filteredResults.map(({ item: result, matches, score }, idx) => (
              <SearchResult
                key={result.id}
                onClick={() => selectResult(idx)}
                result={result}
                score={score}
                matches={matches}
                highlight={idx === highlight}
              ></SearchResult>
            ))}
        </SearchResults>
      </Container>
    </Wrapper>
  );
};
