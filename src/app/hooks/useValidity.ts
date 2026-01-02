import { useEffect, useRef, useState } from 'react';

export const useValidity = <T extends HTMLInputElement>() => {
  const ref = useRef<T>(null);
  const [valid, setValid] = useState(true);

  const setCustomValidity = (error: string) =>
    ref?.current?.setCustomValidity?.(error);

  useEffect(() => {
    setCustomValidity(valid ? '' : 'Invalid');
  }, [valid, setCustomValidity]);

  return [ref, valid, setValid, setCustomValidity] as const;
};
