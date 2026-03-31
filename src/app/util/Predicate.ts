// function not<U>(guard: (obj: any) => obj is U) {
//   return <T>(obj: T): obj is Exclude<T, U> => !guard(obj);
// }

// export type TypePredicate = <T>(x: unknown | T, i?: number) => x is T;
// export type Predicate = (x: unknown, i?: number) => boolean;
// export type TypePredicate<T> = (x: T | unknown, i?: number) => x is T;
// export type NotTypePredicate<Q> = <T>(
//   x: T | Q,
//   i?: number,
// ) => x is Exclude<T, Q>;

export type Predicate = <T>(x: T, i?: number) => boolean;

export const never = (x: unknown): x is never => false;

export const always = <T>(x: T): x is T => true;

export const isNull = (x: unknown): x is null => null === x;

export const isNotNull = (x: unknown): x is NonNullable<unknown> | undefined =>
  x !== null;

export const isUndefined = (x: unknown): x is undefined => x === undefined;

export const isNotUndefined = (x: unknown): x is NonNullable<unknown> | null =>
  x !== undefined;

export const isNullOrUndefined = (x: unknown): x is null | undefined =>
  x === null || x === undefined;

export const isNotNullOrUndefined = <T>(x: T | null | undefined): x is T =>
  x !== null && x !== undefined;

export const isNonNullable = <T>(x: T | unknown): x is NonNullable<unknown> =>
  x !== null && x !== undefined;

export const isSymbol = (x: unknown): x is symbol => 'symbol' === typeof x;
export const isString = (x: unknown): x is string => 'string' === typeof x;
export const isNumber = (x: unknown): x is number => 'number' === typeof x;

export const isBigint = (x: unknown): x is bigint => 'bigint' === typeof x;

export const isBoolean = (x: unknown): x is boolean => 'boolean' === typeof x;
export const isObject = (x: unknown): x is object => 'object' === typeof x;
export const isFunction = (x: unknown): x is () => unknown =>
  'function' === typeof x;

export const isIterable = (x: unknown): x is Iterable<unknown> =>
  isObject(x) &&
  Symbol.iterator in x &&
  typeof x[Symbol.iterator] === 'function';

// const a = (y?: object) => {
//   if (never(y)) {
//     typeof y;
//   }
//   if (always(y)) {
//     typeof y;
//   }
//   if (isNonNullable(y)) {
//     typeof y;
//     y.toString();
//   }
//   if (isNotUndefined(y)) {
//     y.toString();
//     typeof y;
//   }
// };
