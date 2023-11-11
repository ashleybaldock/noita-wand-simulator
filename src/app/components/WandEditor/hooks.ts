import { RefObject, useEffect, useState } from 'react';

const defaultColumnCount = 1;

export const getComputedColumns = <T extends HTMLElement>(
  ref: RefObject<T>,
): number => {
  if (!ref.current) return defaultColumnCount;

  // https://stackoverflow.com/a/58393617/5389588
  return window
    .getComputedStyle(ref.current)
    .getPropertyValue('grid-template-columns')
    .replace(' 0px', '')
    .split(' ').length;
};

/**
 * @param containerRef Ref to HTMLElement with grid styles applied
 * @param defaultCount Count to return during SSR or if the containerRef is not yet set
 * @returns number of columns visible in the grid (updates on resize or containerRef change)
 */
export const useVisibleGridCols = <T extends HTMLElement>(
  containerRef: RefObject<T>,
  defaultCount: number = defaultColumnCount,
): number => {
  const [visibleCols, setVisibleCols] = useState(defaultCount);

  useEffect(() => {
    const calcColumns = () => {
      if (!containerRef.current) return;

      // https://stackoverflow.com/a/58393617/5389588
      setVisibleCols(getComputedColumns(containerRef));
    };

    calcColumns();

    window.addEventListener('resize', calcColumns);
    return () => {
      window.removeEventListener('resize', calcColumns);
    };
  }, [containerRef, setVisibleCols]);

  return visibleCols;
};
