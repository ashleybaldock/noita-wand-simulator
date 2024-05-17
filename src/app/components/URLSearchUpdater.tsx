import { useEffect } from 'react';
import { useURLSearch } from '../redux';

export const URLSearchUpdater = () => {
  const urlSearch = useURLSearch();

  useEffect(() => {
    if (window.location.search !== urlSearch) {
      // console.log(
      // `urlSearch update from ${window.location.search} to ${urlSearch}`,
      // );
      const url = new URL(window.location.href);
      url.search = urlSearch;
      window.history.pushState({}, '', url.toString());
    }
  }, [urlSearch]);
  return null;
};
