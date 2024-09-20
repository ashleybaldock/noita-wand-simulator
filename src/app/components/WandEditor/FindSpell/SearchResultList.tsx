import styled from 'styled-components';
import { noop } from '../../../util/util';
import type { SearchSpell } from './FindSpell';
import { SearchResultBase, SearchResult } from './SearchResult';
import type { FuzzySearchResult } from '../../../hooks/useFuzzySearch';

const ResultNoMatch = styled(SearchResultBase)`
  justify-content: end;
  &::before {
    content: '...';
  }
`;

const ListWrapper = styled.ol`
  width: 100%;
  overflow-y: scroll;
  margin: 0.4em 0;
  padding: 0;
  background-color: #0c0c0cf2;
  border: 2px solid var(--color-tab-border-active);
  border-radius: 0 0.4em;
  position: absolute;
  top: 100%;
  z-index: var(--zindex-findspell-results);
`;

export const SearchResultList = ({
  results,
  highlightIdx,
  className,
  onSelectResult = noop,
}: {
  results: FuzzySearchResult<SearchSpell>[];
  highlightIdx: number;
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
