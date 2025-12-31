import { useCallback } from 'react';

export const useDragRef = <T extends HTMLElement>(drag: (element: T) => void) =>
  useCallback(
    (element: T | null) => {
      if (element) {
        drag(element);
      }
    },
    [drag],
  );
