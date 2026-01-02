import { useRef } from 'react';

export const useFocus = <T extends HTMLElement>() => {
  const ref = useRef<T>(null);
  const focusElement = () => ref?.current?.focus?.();
  const blurElement = () => ref?.current?.blur?.();

  return [ref, focusElement, blurElement] as const;
};
