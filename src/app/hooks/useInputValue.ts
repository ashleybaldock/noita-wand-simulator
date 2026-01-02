import { useRef } from 'react';

export const useInputValue = <T extends HTMLInputElement>() => {
  const ref = useRef<T>(null);

  return [ref, ref.current?.value] as const;
};
