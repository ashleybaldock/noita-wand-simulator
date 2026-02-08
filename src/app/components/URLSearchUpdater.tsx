import { useEffect, useState } from 'react';
import { setWand, useAppDispatch, useURLSearch } from '../redux';
import { generateWandStateFromSearch } from '../redux/Wand/fromSearch';

export const URLSearchUpdater = () => {
  const dispatch = useAppDispatch();

  const [firstRun, setFirstRun] = useState(true);

  const [undoIndex, urlSearch] = useURLSearch();

  useEffect(() => {
    if (firstRun) {
      const url = new URL(window.location.href);
      const stateFromSearch = generateWandStateFromSearch(url.search);

      dispatch(setWand(stateFromSearch));
      setFirstRun(false);
    } else {
      if (window.location.search !== urlSearch) {
        // console.log(
        // `urlSearch update from ${window.location.search} to ${urlSearch}`,
        // );
        const url = new URL(window.location.href);
        url.search = urlSearch;
        window.history.replaceState({ undoIndex }, '', url.toString());
      }
    }
  }, [urlSearch, firstRun]);

  useEffect(() => {}, [urlSearch]);

  return null;
};
