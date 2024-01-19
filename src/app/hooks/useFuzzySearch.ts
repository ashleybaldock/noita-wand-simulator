import { useState, useMemo } from 'react';
import type { FuseResult } from 'fuse.js';
import Fuse from 'fuse.js';

interface IUseSearchProps<T> {
  dataSet: readonly T[];
  keys: string[];
}

export type FuzzySearchMatch = [from: number, to: number];

export type FuzzySearchResultWrapper<T> = {
  item: T;
  score?: number;
  matches: FuzzySearchMatch[];
};

const SCORE_THRESHOLD = 0.4;

export default function useFuzzySearch<T>({
  dataSet,
  keys,
}: IUseSearchProps<T>) {
  const [searchValue, setSearchValue] = useState('');

  const fuse = useMemo(() => {
    const options = {
      ignoreLocation: true,
      includeScore: true,
      includeMatches: true,
      keys,
    };

    return new Fuse(dataSet, options);
  }, [dataSet, keys]);

  const results = useMemo(() => {
    if (!searchValue) return [];

    const searchResults: FuseResult<T>[] = fuse.search(searchValue);

    return searchResults
      .filter(
        (fuseResult) =>
          (fuseResult?.score ?? SCORE_THRESHOLD + 1) < SCORE_THRESHOLD,
      )
      .map(
        (fuseResult): FuzzySearchResultWrapper<T> => ({
          item: fuseResult.item,
          score: fuseResult.score,
          matches: fuseResult.matches?.flatMap(({ indices }) => indices) ?? [],
        }),
      );
  }, [fuse, searchValue, dataSet]);

  return {
    searchValue,
    setSearchValue,
    results,
  };
}
