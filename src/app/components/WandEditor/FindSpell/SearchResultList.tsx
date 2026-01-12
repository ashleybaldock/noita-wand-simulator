import styled from 'styled-components';
import { noop } from '../../../util/util';
import type { ResultIndex, SearchSpell } from './FindSpell';
import { SearchResultBase, SearchResult } from './SearchResult';
import type { FuzzySearchResult } from '../../../hooks/useFuzzySearch';

const ResultNoMatch = styled(SearchResultBase)`
  justify-content: end;
  &::before {
    content: '...';
  }
`;

const ListWrapper = styled.ol`
  background-color: #0c0c0cf2;
  border: 2px solid var(--color-tab-border-active);
  border-radius: 0 0.4em;
  position: absolute;
  inset: 100% 0% auto 0%;
  z-index: var(--zindex-findspell-results);
  width: fit-content;
  min-width: 10ch;
  max-width: 33vw;
  padding: 0.2em 0.5ch;
  overflow-y: scroll;
  margin: 0.4em 0;

  @media screen and (max-width: 500px) {
    width: 100vw;
    position: fixed;
    inset: calc(var(--top-banner-height) + var(--ou) * 3) 0 auto 0;
    margin: 0;
    border: 0;
    padding: calc(var(--ou) * 3);
    box-sizing: border-box;
  }
`;

export const SearchResultList = ({
  results,
  highlightIdx,
  className,
  onSelectResult = noop,
}: {
  results: FuzzySearchResult<SearchSpell>[];
  highlightIdx: ResultIndex;
  className?: string;
  onSelectResult?: (resultIdx: number) => void;
}) => {
  const resultCount = results.length;
  const noResults = resultCount === 0;
  return (
    <ListWrapper className={className}>
      {noResults ? (
        <ResultNoMatch data-name="SearchNoMatch">No Matches</ResultNoMatch>
      ) : (
        results.map(({ item: result, matches, score }, idx) => (
          <SearchResult
            key={result.id}
            onClick={() => onSelectResult(idx)}
            result={result}
            score={score}
            matches={matches}
            highlight={idx === highlightIdx}
          ></SearchResult>
        ))
      )}
    </ListWrapper>
  );
};
