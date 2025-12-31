import { useCallback } from 'react';

export const useDropRef = <T extends HTMLElement>(drop: (element: T) => void) =>
  useCallback(
    (element: T | null) => {
      if (element) {
        drop(element);
      }
    },
    [drop],
  );
