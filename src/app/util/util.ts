import { Preset, PresetGroup } from '../types';

export const noop = () => {};

export const isNotNull = <T>(x: T | null): x is T => x !== null;

export const isNotNullOrUndefined = <T>(x: T | null | undefined): x is T =>
  x !== null && x !== undefined;

export const isString = (x: unknown): x is string => typeof '' === typeof x;
export const isNumber = (x: unknown): x is number => typeof 42 === typeof x;
export const isBoolean = (x: unknown): x is boolean =>
  typeof false === typeof x;

export const assertNever = (_: never): never => {
  throw new Error('This should never happen.');
};

export const parseBooleanFromString = (
  str: string,
  defaultTo: boolean = false,
  truthy: RegExp = /(?:^1$|^y$|^Y$|^t$|^T$|^true|^yes)/,
  falsey: RegExp = /(?:^0$|^n$|^N$|^f$|^F$|^false|^no)/,
) => truthy.test(str) || !falsey.test(str) || defaultTo;

export function union<T, U>(setA: Set<T>, setB: Set<U>) {
  let _union = new Set<T | U>(setA);
  for (let elem of setB) {
    _union.add(elem);
  }
  return _union;
}

export function range(n: number) {
  return [...Array(n).keys()];
}

type DiffResult<T extends object> = Partial<
  { [key in keyof T]: { a: T[key]; b: T[key] } }
>;

export function diff<T extends object>(a: T, b: T) {
  const result: any = {};
  const keys = [...new Set([...Object.keys(a), ...Object.keys(b)])];
  keys.forEach((k) => {
    const aa: any = a;
    const ba: any = b;
    if (aa[k] !== ba[k]) {
      result[k] = { a: aa[k], b: ba[k] };
    }
  });
  return result as DiffResult<T>;
}

export function isSinglePreset(p: Preset | PresetGroup): p is Preset {
  return p.hasOwnProperty('spells');
}

export function isPresetGroup(p: Preset | PresetGroup): p is PresetGroup {
  return p.hasOwnProperty('presets');
}

export const objectKeys = <T extends object>(obj: T): (keyof T)[] =>
  Object.keys(obj) as (keyof T)[];

export type ObjectEntries<T> = { [K in keyof T]: [K, T[K]] }[keyof T];

export const objectEntries = <T extends object>(obj: T): ObjectEntries<T>[] =>
  Object.entries(obj) as ObjectEntries<T>[];

export const groupBy = <T, K extends string>(arr: T[], keyFn: (x: T) => K) =>
  arr.reduce((acc, cur) => {
    const k = keyFn(cur);
    if (!acc[k]) {
      acc[k] = [];
    }
    acc[k].push(cur);
    return acc;
  }, {} as Record<K, T[]>);

/**
 * Typed inverse of a Record
 * e.g. Record<K,V> => Record<V,K>
 */
export const invertRecord = <
  K extends string | number | symbol,
  V extends string | number | symbol,
>(
  obj: Record<K, V>,
): Record<V, K> => {
  const result = {} as Record<V, K>;
  objectEntries(obj).forEach(([key, value]) => {
    result[value] = key;
  });
  return result;
};

/**
 * Typed inverse of a Map
 * e.g. Map<K,V> => Map<V,K>
 */
export const invertMap = <K, V>(obj: Map<K, V>): Map<V, K> =>
  new Map<V, K>(
    mapIter(obj.entries(), ([key, value]) => ({ ok: true, val: [value, key] })),
  );

export function constToDisplayString(c: string) {
  return c.replace(/_/g, ' ').replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

export const omit = <T extends object, K extends keyof T>(obj: T, keys: K[]) =>
  Object.fromEntries(
    Object.entries(obj).filter(([k, v]) => !keys.includes(k as K)),
  ) as Partial<T>;

export const trimArray = <T>(arr: T[], predicate: (o: T) => boolean): T[] => {
  let result = [...arr];
  while (result.length > 0 && predicate(result[result.length - 1])) {
    result.pop();
  }
  return result;
};

export type TypedProperties<T, U> = Pick<
  T,
  {
    [K in keyof T]: T[K] extends U ? K : never;
  }[keyof T]
>;

export const numSign = (v: any, round?: number) => {
  if (round !== undefined) {
    v = Math.round(Number(v) * Math.pow(10, round)) / Math.pow(10, round);
  }
  return (v < 0 ? '' : '+') + v;
};

export const round = (v: number, position: number) =>
  Math.round(Number(v) * Math.pow(10, position)) / Math.pow(10, position);

export const sign = (v: number) => (v < 0 ? '' : '+') + v;

export const toFrames = (durationInSeconds: number, fps: number = 60) =>
  round(durationInSeconds * fps, 2);

export const toSeconds = (durationInFrames: number, fps: number = 60) =>
  round(durationInFrames / fps, 2);

export const copyToClipboard = async (text: string) =>
  'clipboard' in navigator
    ? await navigator.clipboard.writeText(text)
    : document.execCommand('copy', true, text);

export function forceDisableCanvasSmoothing() {
  // https://stackoverflow.com/a/22018649
  // save old getContext
  const oldGetContext = HTMLCanvasElement.prototype.getContext;

  // get a context, set it to smoothed if it was a 2d context, and return it.
  function getSmoothContext(this: any, contextType: any) {
    let resCtx = oldGetContext.apply(this, arguments as any);
    if (contextType === '2d') {
      setToFalse(resCtx, 'imageSmoothingEnabled');
      setToFalse(resCtx, 'mozImageSmoothingEnabled');
      setToFalse(resCtx, 'oImageSmoothingEnabled');
      setToFalse(resCtx, 'webkitImageSmoothingEnabled');
    }
    return resCtx;
  }

  function setToFalse(obj: any, prop: any) {
    if (obj[prop] !== undefined) obj[prop] = false;
  }

  // inject new smoothed getContext
  HTMLCanvasElement.prototype.getContext = getSmoothContext as any;
}

// https://stackoverflow.com/a/7616484
export function hashString(s: string) {
  let hash = 0;
  let i;
  let chr;
  if (s.length === 0) return hash;
  for (i = 0; i < s.length; i++) {
    chr = s.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}

type Maybe<T> =
  | {
      ok: true;
      val: T;
    }
  | {
      ok: false;
    };

export function* mapIter<TI, TO>(
  iterable: IterableIterator<TI>,
  callback: (input: TI) => Maybe<TO>,
): IterableIterator<TO> {
  for (let x of iterable) {
    const result = callback(x);
    if (result.ok) {
      yield result.val;
    }
  }
}
