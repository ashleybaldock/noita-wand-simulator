import { useEffect } from 'react';
import { setWand, useAppDispatch, useURLSearch } from '../redux';
import { generateWandStateFromSearch } from '../redux/Wand/fromSearch';

export const URLSearchUpdater = () => {
  const dispatch = useAppDispatch();

  const [undoIndex, urlSearch] = useURLSearch();

  useEffect(() => {
    const url = new URL(window.location.href);
    const stateFromSearch = generateWandStateFromSearch(url.search);

    dispatch(setWand(stateFromSearch));
  }, []);

  useEffect(() => {
    if (window.location.search !== urlSearch) {
      // console.log(
      // `urlSearch update from ${window.location.search} to ${urlSearch}`,
      // );
      const url = new URL(window.location.href);
      url.search = urlSearch;
      window.history.replaceState({ undoIndex }, '', url.toString());
    }
  }, [urlSearch]);

  return null;
};
