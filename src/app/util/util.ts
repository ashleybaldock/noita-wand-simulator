import { FPS } from './constants';
import { mapIter, sequentialIter } from './iterTools';
export { tee } from './teebug';
export type { TeeBug } from './teebug';

export const noop = () => {};

export const echo = <T>(a: T) => a;

export const isNotNull = <T>(x: T | null): x is T => x !== null;

export const isNotNullOrUndefined = <T>(x: T | null | undefined): x is T =>
  x !== null && x !== undefined;

export const isUndefined = (x: unknown): x is undefined => x === undefined;

export const isNull = (x: unknown): x is null => null === x;

export const isSymbol = (x: unknown): x is symbol => 'symbol' === typeof x;

export const isString = (x: unknown): x is string => 'string' === typeof x;

export const isNumber = (x: unknown): x is number => 'number' === typeof x;

export const isBigint = (x: unknown): x is bigint => 'bigint' === typeof x;

export const isBoolean = (x: unknown): x is boolean => 'boolean' === typeof x;

export const isObject = (x: unknown): x is object => 'object' === typeof x;

export const isFunction = (x: unknown): x is () => unknown =>
  'function' === typeof x;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const assertNever = (_?: never): never => {
  throw new Error('This should never happen.');
};

export const parseBooleanFromString = (
  str: string,
  defaultTo: boolean = false,
  truthy: RegExp = /(?:^1$|^y$|^Y$|^t$|^T$|^true|^yes)/,
  falsey: RegExp = /(?:^0$|^n$|^N$|^f$|^F$|^false|^no)/,
) => truthy.test(str) || !falsey.test(str) || defaultTo;

export function union<T, U>(setA: Set<T>, setB: Set<U>) {
  const _union = new Set<T | U>(setA);
  for (const elem of setB) {
    _union.add(elem);
  }
  return _union;
}

export const range = (n: number) => [...Array(n).keys()];

// type DiffResult<T extends object> = Partial<{
//   [key in keyof T]: { a: T[key]; b: T[key] };
// }>;
// export function diff<T extends object>(a: T, b: T) {
//   const result: T = {};
//   const keys = [...new Set([...Object.keys(a), ...Object.keys(b)])];
//   keys.forEach((k) => {
//     const aa: T = a;
//     const ba: T = b;
//     if (aa[k] !== ba[k]) {
//       result[k] = { a: aa[k], b: ba[k] };
//     }
//   });
//   return result as DiffResult<T>;
// }

// type StyleSource = Promise<string> | string | (() => string);

// const isThenable = <T>(x: unknown): x is Promise<T> =>
//   isNotNullOrUndefined(x) &&
//   typeof x === 'object' &&
//   'then' in x! &&
//   typeof x.then === 'function';

// const x = (a: Promise<string> | string | (() => string)): number => 0;

export type ValueOf<T> = T[keyof T];

export type KeyOfType<Obj extends object, KeyType> = {
  [k in keyof Obj]: Obj[k] extends KeyType ? k : never;
}[keyof Obj];

export type ObjectKey = string | number | symbol;

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
 * Like Object.fromEntries using only keys
 * @param keys string[] of key names to add
 * @param defaultTo default value to set for each property
 */
export const objectFromKeys = <const T extends ReadonlyArray<ObjectKey>, F>(
  keys: T,
  defaultTo: F | (() => F),
): { [K in T[number]]: F } => {
  return Object.fromEntries(
    keys.map((k) => [k, isFunction(defaultTo) ? defaultTo() : defaultTo]),
  ) as {
    [K in T[number]]: F;
  };
};

export const objectFromObjectKeys = <
  O extends object,
  const T extends [keyof O],
  F,
>(
  obj: O,
  defaultTo: F | (() => F),
): { [K in T[number]]: F } =>
  objectFromKeys(objectKeys(obj), defaultTo) as { [K in T[number]]: F };

export type ChangeFields<T, R> = Omit<T, keyof R> & R;

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
    Object.entries(obj).filter(([k]) => !keys.includes(k as K)),
  ) as Partial<T>;

export const trimArray = <T>(arr: T[], predicate: (o: T) => boolean): T[] => {
  const result = [...arr];
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

const compareIdentity = (a: unknown, b: unknown) => a === b;
/**
 * Compare two sequences
 */
export const sequencesMatch = (
  a: unknown[],
  b: unknown[],
  comparator: (a: unknown, b: unknown) => boolean = compareIdentity,
): boolean => a.length === b.length && a.every((l, i) => comparator(l, b[i]));

/**
 * Checks if sequences have the same items in the same order
 * Ignores empty spaces/length etc.
 */
export const sequencesMatchIgnoringHoles = (
  a: unknown[],
  b: unknown[],
): boolean =>
  sequencesMatch(
    a.filter((x) => isNotNullOrUndefined(x)),
    b.filter((x) => isNotNullOrUndefined(x)),
  );

export const fixedLengthCopy = <T>(
  arr: readonly T[],
  size: number = arr.length,
): T[] => {
  return size > arr.length
    ? [...arr, ...Array(size - arr.length).fill(null)]
    : arr.slice(0, size);
};

export type TypedProperties<T, U> = Pick<
  T,
  {
    [K in keyof T]: T[K] extends U ? K : never;
  }[keyof T]
>;

export const round = (n: number, to: number) =>
  Math.round(n * Math.pow(10, to)) / Math.pow(10, to);

export const sign = (n: number) => (n < 0 ? '' : '+') + n;

export const toFrames = (durationInSeconds: number, fps: number = FPS) =>
  round(durationInSeconds * fps, 2);

export const toSeconds = (durationInFrames: number, fps: number = FPS) =>
  round(durationInFrames / fps, 2);

export const ordinalSuffix = (n: number) =>
  n % 20 === 1 ? 'st' : n % 20 === 2 ? 'nd' : n % 20 === 3 ? 'rd' : 'th';
/**
 * min: lifetime - variation, max: lifetime + variation
 * range: abs(max - min) + 1
 * range: variation * 2 + 1
 * chance = 1/range
 *
 * 60-7= 53, 60+7 = 67, 67-53+1= 15, 1/15 =  0.0667
 * 50-10= 40, 50+10= 60, 60-40+1= 21, 1/21= 0.0476
 * 10-40= -30, 10+40= 50, 50--30+1= 81, 1/81= 0.0012
 */
export const wispChance = (variation: number, lifetime: number = -1) => {
  if (lifetime - variation > -1 || lifetime + variation < -1) {
    return 0;
  }
  return 1 / (variation * 2 + 1);
};

export const copyToClipboard = async (text: string) =>
  'clipboard' in navigator
    ? await navigator.clipboard.writeText(text)
    : document.execCommand('copy', true, text);

// export function forceDisableCanvasSmoothing() {
//   // https://stackoverflow.com/a/22018649
//   // save old getContext
//   const oldGetContext = HTMLCanvasElement.prototype.getContext;

//   // get a context, set it to smoothed if it was a 2d context, and return it.
//   function getSmoothContext(this: any, contextType: any) {
//     let resCtx = oldGetContext.apply(this, arguments as any);
//     if (contextType === '2d' && isNotNullOrUndefined(resCtx)) {
//       setToFalse(resCtx, 'imageSmoothingEnabled');
//       setToFalse(resCtx, 'mozImageSmoothingEnabled');
//       setToFalse(resCtx, 'oImageSmoothingEnabled');
//       setToFalse(resCtx, 'webkitImageSmoothingEnabled');
//     }
//     return resCtx;
//   }

//   function setToFalse(obj: RenderingContext, prop: keyof RenderingContext) {
//     if (isNotNullOrUndefined(obj[prop]) obj[prop] = false;
//   }

//   // inject new smoothed getContext
//   HTMLCanvasElement.prototype.getContext = getSmoothContext as any;
// }

export const toUrl = (path: string) => {
  if (path.startsWith('data:image')) {
    return `url("${path}")`;
  }
  if (path.startsWith('/')) {
    return `url('${path}')`;
  }
  return `url('/${path}')`;
};

export const capitalize = <T extends string>(s: T) =>
  (s[0].toUpperCase() + s.slice(1)) as Capitalize<typeof s>;

export type CamelCase<T> = {
  [Property in keyof T as KebabToCamel<Property & string>]: T[Property];
};

export type KebabToCamel<T extends string> =
  T extends `${infer Head}-${infer Tail}`
    ? `${Head}${Capitalize<KebabToCamel<Tail>>}`
    : T;

export const manglePropName = <T extends string>(
  propName: T,
): KebabToCamel<T> =>
  propName
    .split('-')
    .map((p, i) => (i === 0 ? p : capitalize(p)))
    .join('') as KebabToCamel<T>;

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

export const sequentialId = <T extends number>() => {
  const isValidT = (n: number): n is T => n > 0;
  const startFrom = 1;
  if (isValidT(startFrom)) {
    const idGenerator = sequentialIter<T>(startFrom, isValidT);
    return () => {
      const { done, value } = idGenerator.next();
      if (!done) {
        return value;
      }
      throw new Error('Exhausted ID iterator');
    };
  }
  throw new Error('Failed to init ID iterator');
};
