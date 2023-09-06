/*
 * Utility types + guards
 */

export type TypedProperties<T, U> = Pick<
  T,
  {
    [K in keyof T]: T[K] extends U ? K : never;
  }[keyof T]
>;

export function notNull<T>(x: T | null): x is T {
  return x !== null;
}

export function notNullOrUndefined<T>(x: T | null | undefined): x is T {
  return x !== null && x !== undefined;
}

// type NestedKeyOf<ObjectType extends object> =
//   {[Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
// ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
// : `${Key}`}[keyof ObjectType & (string | number)];

export type NestedKeyOf<T, K = keyof T> = K extends keyof T & string
  ? `${K}` | (T[K] extends object ? `${K}.${NestedKeyOf<T[K]>}` : never)
  : never;
