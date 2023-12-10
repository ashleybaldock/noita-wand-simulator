import { Preset, PresetGroup } from '../types';
import { FPS } from './constants';
import { mapIter } from './iterTools';

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

/**
 * Rounds a number
 */
// type RoundOptions = {
//   step?: number;
//   min?: number;
//   max?: number;
//   method?: 'ceil' | 'floor' | 'round';
// };
// export const roundToStep = (
//   n: number,
//   {
//     step = 1,
//     min = Number.NEGATIVE_INFINITY,
//     max = Number.POSITIVE_INFINITY,
//     method = 'round',
//   }: RoundOptions,
// ) => {
//   return Math.ceil((n - offset) / increment) * increment + offset;
// };

export const parseBooleanFromString = (
  str: string,
  defaultTo: boolean = false,
  truthy: RegExp = /(?:^1$|^y$|^Y$|^t$|^T$|^true|^yes)/,
  falsey: RegExp = /(?:^0$|^n$|^N$|^f$|^F$|^false|^no)/,
) => truthy.test(str) || !falsey.test(str) || defaultTo;

type Methods<T> = { [P in keyof T as T[P] extends Function ? P : never]: T[P] };

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

type DiffResult<T extends object> = Partial<{
  [key in keyof T]: { a: T[key]; b: T[key] };
}>;

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
  new Map<V, K>(mapIter(obj.entries(), ([key, value]) => [value, key]));

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

/*
 * Counts duplicate entries
 * Returns [[key, count], ...[keyN, countN]]
 */
export const tally = <T>(arr: T[]): [T, number][] => [
  ...arr
    .reduce(
      (map, cur) => map.set(cur, (map.get(cur) ?? 0) + 1),
      new Map<T, number>(),
    )
    .entries(),
];

export type TypedProperties<T, U> = Pick<
  T,
  {
    [K in keyof T]: T[K] extends U ? K : never;
  }[keyof T]
>;

export const formatYesNo = (
  v: boolean,
  {
    ifTrue = 'Yes',
    ifFalse = 'No',
  }: { ifTrue?: JSX.Element | string; ifFalse?: JSX.Element | string } = {},
) => (v ? ifTrue : ifFalse);

export const round = (n: number, to: number) =>
  Math.round(n * Math.pow(10, to)) / Math.pow(10, to);

export const sign = (n: number) => (n < 0 ? '' : '+') + n;

export const signZero = <T>(n: number, ifZero: T | string = '--') =>
  n === 0 ? ifZero : sign(n);

export const toFrames = (durationInSeconds: number, fps: number = FPS) =>
  round(durationInSeconds * fps, 2);

export const toSeconds = (durationInFrames: number, fps: number = FPS) =>
  round(durationInFrames / fps, 2);

export const radiusThresholdBonus = (
  radius: number,
  ifZero: JSX.Element | string = '--',
): JSX.Element | string => {
  if (isNaN(radius)) return 'n/a';
  if (radius < 32) return signZero(0, ifZero);
  if (radius < 64) return signZero(325);
  if (radius < 128) return signZero(375);
  if (radius < 211) return signZero(500);
  return `${signZero(600)}|${signZero(500)}`;
};

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

export const toUrl = (path: string) => {
  if (path.startsWith('data:image')) {
    return `url("${path}")`;
  }
  if (path.startsWith('/')) {
    return `url('${path}')`;
  }
  return `url('/${path}')`;
};

export const toBackgroundImage = (path?: string) =>
  isNotNullOrUndefined(path)
    ? `background-image: ${toUrl(path)};`
    : 'background-color: red;';

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
