import type { MutableRefObject, LegacyRef, RefCallback } from 'react';
import { isNotNullOrUndefined } from './util';

const setMutableRef = <T, M extends MutableRefObject<T>>(ref: M, value: T) =>
  (ref.current = value);

const isMutableRef = <T>(
  x: string | MutableRefObject<T> | undefined | null,
  v: T,
): x is MutableRefObject<T> =>
  isNotNullOrUndefined(x) &&
  typeof x === 'object' &&
  Object.hasOwnProperty.call(x, 'current') &&
  typeof x.current === typeof v;

type MergableRef<T> = MutableRefObject<T> | LegacyRef<T> | undefined | null;

export const mergeRefs =
  <T>(...args: Array<MergableRef<T> | Array<MergableRef<T>>>): RefCallback<T> =>
  (value) =>
    args
      .flat()
      .forEach((ref) =>
        typeof ref === 'function'
          ? ref(value)
          : isMutableRef(ref, value) && setMutableRef(ref, value),
      );
