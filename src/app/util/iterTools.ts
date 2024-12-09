import { isObject } from './util';

/**
 * Iterator utility functions
 *
 *
 *     1. Brief guide to Iterators
 *
 * ╼══╾ Protocols ╼═══════════════════════════════════════════════╡1.1╞═╾
 *
 * ╴╴╴ Iterable : Iterable<T> ╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶┤1.1.1├╶
 *
 *  Defines iteration behavior, e.g what for..of loops over
 *  - Implements the @@iterator method, via the key [Symbol.iterator]
 *
 *   [Symbol.iterator]: () => <Object implementing Iterator protocol>
 *
 * ╴╴╴ Iterator : Iterator<T> ╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶┤1.2.1├╶
 *
 *  Defines interface to the sequence of values
 *  - Must have a next() method that returns an IteratorResult:
 *
 *   next(x?: IN) => { done: boolean, value: OUT | undefined }
 *
 *  - Optionally implements:
 *
 *   return(x?: IN)
 *
 *   throw(e?: Exception)
 *
 * ╼══╾ Objects ╼═════════════════════════════════════════════════╡1.2╞═╾
 *
 * ╴╴╴ Generator : IterableIterator<T> ╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶┤1.2.1├╶
 *
 *  Implements both Iterable and Iterator protocols
 *  - created via generator functions:
 *
 *   function* HelloGenerator<string> () {
 *     while (true) {
 *       yield 'hello';
 *     }
 *   }
 *
 *
 *     2. This library
 *
 * ╼══╾ Types ╼═══════════════════════════════════════════════════╡2.1╞═╾
 *
 * ╴╴╴ Generator : IterableIterator<T> ╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶┤1.2.1├╶
 *
 *   source:    IterableIterator<T>
 *   predicate: Predicate<T>
 *   callback:  Callback<T>
 *   mapper:    Mapper<T, Tout>
 *
 *
 * ╼══╾ Methods ╼═════════════════════════════════════════════════╡2.2╞═╾
 *
 * ╔════════════╗
 * ║ Buffering: ╚════════════════════════════╗
 * ║ Repetition │ (S[a,b,…] -> S[a,b,…,a,b…] ║
 * ╚╤═══════════╧════════════════════════════╝
 *  ├╴repeat(source: IterableIterator<T>,
 *  │       options: RepeatIterOptions): Iterator<T>
 *  │                ├╴repetitions                                      │
 *  │                └╴repeatFromCache                                  │
 * ╔════════════╗
 * ║ Buffering: ╚═══════════════════════════╗
 * ║ Reordering │ (S[a,b,c,…] -> S[c,a,b,…] ║
 * ╚╤═══════════╧═══════════════════════════╝
 *  ├╴stack(source: IterableIterator<T>): IterStack<T>
 *  │    IterStack: {
 *  │      push(source: IterableIterator<T>))
 *  │      next() => IteratorResult<T>;
 *  │    }
 *  │                                                                   │
 *  ├╴queue(source: IterableIterator<T>): IterStack<T>
 *
 * ╔════════╤══════════════╗
 * ║ Subset │ (S -> Sʹ⊆ S) ║
 * ╚╤═══════╧══════════════╝
 *  ├╴take(source: IterableIterator<T>, count: number): Iterator<>      │ ✅
 *  │  ├╴takeLazily                                                     │
 *  │  ├╴takeArray                                                      │
 *  │  ├╴takeOne                                                        │
 *  │  └╴takeEagerly                                                    │
 *  ├╴drop(source: IterableIterator<T>, count: number): Iterator<>      │ 🔶
 *  │                                                                   │
 *  └╴filter( source, predicate: Predicate<T>        ): Iterator<T>;    │ ✅
 *                                                                      │
 * ╔══════════╤══════════╗                                              │
 * ║ Reducing │ (S -> V) ║                                              │
 * ╚╤═════════╧══════════╝                                              │
 *  ├╴forEach( source, callback:  Callback<T>         ): void;          │ ✅
 *  ├╴reduce( source, reducer:    , initialValue?: T ): Tout;           │ 🔶
 *  ├╴find( source, predicate: Predicate<T>        ): T;                │ ✅
 *  │                                                                   │
 *  ├╴every( source, predicate: Predicate<T>        ): boolean;         │ ✅
 *  └╴some( source, predicate: Predicate<T>        ): boolean;          │ ✅
 *                                                                      │
 * ╔═════════╤═══════════════════╗                                      │
 * ║ Mapping │ (S[i] -> S[f(i)]) ║                                      │
 * ╚╤════════╧═══════════════════╝                                      │
 *  ├╴map( source, mapper:    Mapper<T, Tout> ): Iterator<T>;           │ ✅
 *  ├╴flatMap( source, mapper: Mapper<T, Iterable<Tout>>: Iterator<T>;  │ ✅
 *  │                                                                   │
 *  ├╴enumerate(i)       i[n]      ▬▶︎ [[i[0], 0], … [i[n], n]]          │ 🔶
 *  ├╴intersperse(i, f)  i[n]      ▬▶︎ [i[0], f(i[0]), … i[n], f(i[n])]  │ 🔶
 *  │                                                                   │
 *                                                                      │
 * ╔═══════════╤════════════════════════╗                               │
 * ║ Splitting │ (S[i] -> [S1, S2, …SN] ║                               │
 * ╚╤══════════╧════════════════════════╝                               │
 *  ├╴fork(i)     i: [[A1, B1, … N1],         [A1, A2, …An]             │ 🔶
 *  │                  [A2, B2, … N2],   ▬▶︎   [B1, B2, …Bn]             │
 *  │                       ...                    ...                  │
 *  │                  …[An, Bn, … Nn]]       [N1, N2, …Nn]             │
 *  ├╴                                                                  │
 *                                                                      │
 * ╔═══════════╤═══════════╗                                            │
 * ║ Combining │ (Sᴺ -> S) ║                                            │
 * ╚╤══════════╧═══════════╝                                            │
 *  ├╴concat(...i)      i[0], …i[N]  ▬▶︎  [i[0][0], …i[0][n],            │ ✅
 *  │                                           ...                     │
 *  │                                     i[N][0], …i[N][n]]            │
 *  │                                                                   │
 *  ├╴interleave(i, j)   i[n] j[n] ▬▶︎ [i[0], j[0], … i[n], j[n]]        │ 🔶
 *  │                                                                   │
 *  ├╴transpose(...i)  i[0]:⎧ [A1, A2, …An] ⎫     [[A1, B1, … N1],      │ ✅
 *  │  (zip/unzip)     i[1]:⎪ [B1, B2, …Bn] ⎩  ▬▶︎  [A2, B2, … N2],      │
 *  │                    …  ⎪      ...      ⎧            ...            │
 *  │                  i[N]:⎩ [N1, N2, …Nn] ⎭      [An, Bn, … Nn]]      │
 *  ├╴                                                                  │
 *  └╴intertwine                                                        │
 *                                                                      │
 * entwine                                                              │
 * weave                                                                │
 * inject                                                               │
 *                                                                      │
 * ╔════════════╤══════════════════╗                                    │
 * ║ Hysteresis │ (S[x...y] -> Sʹ) ║                                    │
 * ╚╤═══════════╧══════════════════╝                                    │
 *  ├╴interpolate                                                       │
 *  ├╴debounce                                                          │
 *  ├╴throttle                                                          │
 *  └╴                                                                  │
 */
export type Predicate<T> = (t: T, i: number) => boolean;
export const anythingPredicate: Predicate<unknown> = () => true;
export const nothingPredicate: Predicate<unknown> = () => false;

export type Mapper<T, O> = (t: T, i: number) => O;
export type Callback<T> = (t: T, i: number) => void;

export type SequenceComparisonOptions<T> = {
  filterPredicate?: Predicate<T>;
};

export const isIterable = (x: unknown): x is Iterable<unknown> =>
  isObject(x) &&
  Symbol.iterator in x &&
  typeof x[Symbol.iterator] === 'function';

// export const isIterator = (x: unknown): x is Iterator<unknown> => isObject(x) && 'next' in x && typeof x['next'] === 'function';

/**
 * Wrap an Iterable<T> or Iterator<T> in a Generator function, making it an IterableIterator<T>
 */
export function* iterIter<T>(
  source: Iterator<T> | Iterable<T>,
): IterableIterator<T> {
  if (isIterable(source)) {
    source = source[Symbol.iterator]();
  }
  for (
    let { value, done } = source.next();
    !done;
    { value, done } = source.next()
  ) {
    yield value;
  }
}

/**
 * Creates an iterator over the first n values of source
 *
 * !Note, this is a shallow operation and the underlying iterator is consumed
 */
export function* takeLazily<T>(
  source: IterableIterator<T>,
  n: number,
): IterableIterator<T> {
  for (
    let { value, done } = source.next(), i = 0;
    !done && i < n;
    { value, done } = source.next(), i++
  ) {
    yield value;
  }
}

/**
 * Like takeLazily, but eager
 * !Beware, this immediately reads the requested (n) items from the source into memory
 * @returns Array of n items from source
 */
export function takeArray<T>(source: IterableIterator<T>, n: number): Array<T> {
  return Array.from(takeLazily(source, n));
}

/**
 * Like takeArray, but take until iterator exhausted
 * !Beware, this immediately reads the requested (n) items from the source into memory
 * !Beware, do not use with infinite source iterator
 * @returns Array of all items from source
 */
export function takeAll<T>(source: IterableIterator<T>): Array<T> {
  return Array.from(takeLazily(source, Number.POSITIVE_INFINITY));
}

/**
 * Get the next value from source
 * @returns A single item from source
 */
export function takeOne<T>(source: IterableIterator<T>): T | undefined {
  return source.next().value;
}

/**
 * @summary Like takeLazily, but eager
 * @desc !Beware, this immediately reads all items from source into memory, not for use with infinite sources
 * @param source an array or iterator to repeat
 * @param n number of items to take
 * @returns Iterable of n items from source
 */
export function* takeEagerly<T>(
  source: IterableIterator<T>,
  n: number,
): IterableIterator<T> {
  for (const i of takeArray(source, n)) {
    yield i;
  }
}

/**
 * Options for {repeatIter}
 *
 * @property {number} [repetitions=Number.POSITIVE_INFINITY] How many times to repeat
 * @property {boolean} [repeatFromCache=true] If true, results of first run through iterator are cached and replayed; If false, the source is reset (if possible) and used again
 */
export type RepeatIterOptions = {
  repetitions?: number;
  repeatFromCache?: boolean;
};
/**
 * Caches and repeats the input
 * @desc Repeats forever, and caches input by default
 *
 * @param {(Array<T>|IterableIterator<T>)} source an array or iterator to repeat
 * @param {RepeatIterOptions} [options] input options
 * @yields
 */
export function* repeatIter<T>(
  source: Array<T> | IterableIterator<T>,
  {
    repetitions = Number.POSITIVE_INFINITY,
    repeatFromCache = true,
  }: RepeatIterOptions = {},
): IterableIterator<T> {
  const cache = [];
  if (repetitions > 0) {
    for (let i = 0; i < repetitions; i++) {
      if (!repeatFromCache || i === 0) {
        for (const s of source) {
          repeatFromCache && cache.push(s);
          yield s;
        }
      } else {
        for (const c of cache) {
          yield c;
        }
      }
    }
  }
}

/**
 * Map source iterable items to multiple values
 *
 * Similar to Array.flatMap(), you can map to a zero length iterator to omit a value
 *
 *           input      mapper fn       output
 *    omit: [a,a,a] ▬▶︎    (a => []) ▬▶︎ []
 * replace: [a,a,a] ▬▶︎   (a => [b]) ▬▶︎ [b,b,b]
 *  expand: [a,a,a] ▬▶︎ (a => [b,c]) ▬▶︎ [b,c,b,c,b,c]
 *
 * @param {T} source An iterable to map from
 * @param {Mapper} mapperFn Executed for each value of source, should return an iterable of zero or more items
 * @returns {IterableIterator<Tout>} Iterable of transformed values
 */
export function* flatMapIter<T, Tout>(
  source: IterableIterator<T>,
  mapperFn: Mapper<T, Iterable<Tout>>,
): IterableIterator<Tout> {
  let i = 0;
  for (const s of source) {
    for (const y of mapperFn(s, i++)) {
      yield y;
    }
  }
}

/**
 * Execute callback for every item in source
 */
export function forEachIter<T>(
  source: IterableIterator<T>,
  callback: Callback<T>,
): void {
  let i = 0;
  for (const s of source) {
    callback(s, i++);
  }
}

/**
 * Execute callback for every item in source
 */
export function* forEachSideEffectIter<T>(
  source: IterableIterator<Readonly<T>>,
  callback: Callback<Readonly<T>>,
): IterableIterator<Readonly<T>> {
  let i = 0;
  for (const s of source) {
    callback(s, i++);
    yield s;
  }
}

/**
 * Apply a mapping function to each item in source iterable
 * (To map to multiple (or omit) items, use flatMapIter
 */
export function* mapIter<T, Tout>(
  source: IterableIterator<T>,
  mapperFn: Mapper<T, Tout>,
): IterableIterator<Tout> {
  let i = 0;
  for (const s of source) {
    yield mapperFn(s, i++);
  }
}

/**
 * Filter source iterable based on predicate
 */
export function* filterIter<T>(
  source: IterableIterator<T>,
  predicate: Predicate<T>,
): IterableIterator<T> {
  let i = 0;
  for (const s of source) {
    if (predicate(s, i++)) {
      yield s;
    }
  }
}

/**
 * Yield a result no more frequently than interval T
 */
// export function* throttleIter<T>(
//   iterable: IterableIterator<T>,
// ): IterableIterator<T> {}

/**
 * Perform a function on each item in iterable
 * and return the running result
 */
// export function* reduceIter<T, Tout>(
//   iterable: IterableIterator<T>,
//   accumulate: (acc: Tout, t: T) => Tout,
//   initial?: Tout,
//   // accumulator: Mapper<T, Tout>,
// ): IterableIterator<Tout> {
//   let acc = initial ?? iterable.next();
//   for (let x of iterable) {
//     acc = accumulate(acc, x);
//     yield acc;
//   }
// }

/**
 * Keeps a running count of unique items
 * @returns tuple of item and current count
 *          of that item (including this one)
 *
 * [A, B, A, B, C]  ▬▶︎  [[A,1], [B,1], [A,2], [B,2], [C,1]]
 *
 * !Beware, this stores previously seen items in memory
 */
export function* tallyIter<T>(
  source: IterableIterator<T>,
): IterableIterator<[T, number]> {
  const seen = new Map<T, number>();
  for (const s of source) {
    const count = (seen.get(s) ?? 0) + 1;
    seen.set(s, count);
    yield [s, count];
  }
}

/**
 * Remove duplicates from input
 *
 * [A, B, A, B, C]  ▬▶︎  [A, B, C]
 *
 * !Beware, this stores previously seen items in memory
 */
export function* uniqueIter<T>(
  source: IterableIterator<T>,
): IterableIterator<T> {
  /* TODO use WeakSet for object references */
  const seen = new Set<T>();
  for (const s of source) {
    if (!seen.has(s)) {
      seen.add(s);
      yield s;
    }
  }
}

/**
 * Yield all values from multiple source iterators, in order
 */
export function* concat<T>(
  ...iterables: IterableIterator<T>[]
): IterableIterator<T> {
  for (const iterable of iterables) {
    yield* iterable;
  }
}

/**
 * Transforms source iterators into
 *  each made up of the Nth item of each iteration of the input
 *
 *   [[A1, B1, … X1],     ⎫     [A1, A2, … An]
 *     [A2, B2, … X2],    ⎬  ▬▶︎ [B1, B2, … Bn]
 *      …[An, Bn, … Xn]]  ⎭     [X1, X2, … Xn]
 *
 *   [A1, A2, … An]  ⎫     [[A1, B1, … X1],
 *   [B1, B2, … Bn]  ⎬  ▬▶︎   [A2, B2, … X2],
 *   [X1, X2, … Xn]  ⎭        …[An, Bn, … Xn]]
 *
 */
export function* transpose<T extends IterableIterator<unknown>[]>(
  ...iterables: T
): IterableIterator<{ [K in keyof T]: T[K] }> {
  while (true) {
    const results = iterables.map((i) => i.next());

    if (results.some(({ done }) => done)) {
      break;
    }
    yield results.map(({ value }) => value) as T;
  }
}

/**
 * Group sets of values from N inputs
 *  to one output of tuples of length N
 *
 * [A1, A2, … An]  ⎫     [[A1, B1, … X1],
 * [B1, B2, … Bn]  ⎬  ▬▶︎   [A2, B2, … X2],
 * [X1, X2, … Xn]  ⎭        …[An, Bn, … Xn]]
 */
// export function* zip1<T>(
//   ...args: T[] | [T[]]
// ): Array<{ [K in keyof T]: T[K] }> {
//   const arrays:  = args.length === 1 ? args.flat() : args
//   return takeArray(transpose(arrays.map((array) => array.values())));
// }

// const toIterator = <T, I extends Iterator<T> | Iterable<T>>(thing: I): IterableIterator<T> => {
//   if (isIterable(thing)) {
//     return thing[Symbol.iterator]();
//   }
//   return thing;
// }

// export const zip = <T extends Iterable<unknown> | Iterator<unknown>>(...args: T[]): Array<{ [K in keyof T]: T[K] }> => {
//   const iterators = args.map((arg) => iterIter(toIterator(arg)));

//   return takeAll(transpose(iterators))
// }

// export function* zip<T extends Array<unknown>[]>(...args: T) {
//   for (
//     let i = 0;
//     i <
//     Math.min(
//       ...args.map((e) => {
//         return e.length;
//       }),
//     );
//     ++i
//   ) {
//     yield args.map((e) => {
//       return e[i];
//     }) as { [I in keyof T]: T[I][number] };
//   }
// }

/**
 * Does predicate hold true for some item in source
 *
 * @returns true if predicate true for all items, false if not
 * (Short-circuit evaluation: returns early on first failed predicate check)
 *
 * !Beware, in the worst-case this reads all items in source
 */
export function some<T>(
  source: IterableIterator<T>,
  predicate: Predicate<T>,
): boolean {
  let i = 0;
  for (const s of source) {
    if (predicate(s, i++)) {
      return true;
    }
  }
  return false;
}

/**
 * Does predicate hold true for every item in source
 *
 * @returns {true} if predicate true for all items
 * @returns {false} if predicate false for any item
 * (Short-circuit evaluation: returns early on first failed predicate check)
 *
 * !Beware, in the worst-case this reads all items in source
 */
export function every<T>(
  source: IterableIterator<T>,
  predicate: Predicate<T>,
): boolean {
  let i = 0;
  for (const s of source) {
    if (!predicate(s, i++)) {
      return false;
    }
  }
  return true;
}

/**
 * Compare 2 or more iterators to check they match
 *
 * Takes an optional filterPredicate which is applied to each iterator
 * before they are compared
 *
 * Lazy evaluation, stops early if a non-match found
 *
 * @returns {true} if all sequences match
 * @returns {false} if any of them differ
 */
export const compareSequencesIter = <T>(
  { filterPredicate = anythingPredicate }: SequenceComparisonOptions<T>,
  ...sequences: [
    IterableIterator<T>,
    IterableIterator<T>,
    ...IterableIterator<T>[],
  ]
): boolean =>
  every(
    transpose(
      ...sequences.map((sequence) => filterIter(sequence, filterPredicate)),
    ),
    (group) => group.every((v) => v === group[0]),
  );

/**
 * Generators
 */

/**
 * Produce sequential IDs
 * @param startFrom Index to start sequence at defaults to 0
 * @param isValid Predicate used to validate each generated id
 */
export function* sequentialIter<T extends number>(
  startFrom: T,
  isValid: (n: number) => n is T,
): IterableIterator<T> {
  let next = startFrom;
  while (true) {
    if (isValid(next)) {
      yield next;
    }
    next++;
  }
}

/**
 * Generate range
 *
 *
 *          ╭┈┈┈┈┈┈╸Behaviour╺┈┈┈┈┈┈┈┈┈╸Default╺┈┈┈┈┈╮
 *  start╺─╮╺┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈╸
 *         │     start at N       │                  │
 *  count╺╮╰────────────────────────────────────────╸│
 *        │     + = stop after N  │ any: +inf        │
 *  step╺╮│   -/0 = do nothing    │                  │
 *       │╰─────────────────────────────────────────╸│
 *  end╺╮│    +/- = step by N     │ start = end:  0  │
 *      ││      0 = repeat start  │ start > end: -1  │
 *      ││ ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈ │ start < end: +1  │
 *      ││    step:   -   0   +   │                  │
 *      │╰──────────┬───┼───┼───────────────────────╸│
 *      │   < start │ Y │ ⁃ ╎ ⁃   │ step > 1: +inf   │
 *      │   = start │ ⁃ │ ⁃ ╎ ⁃   │ step = 0: start  │
 *      │   > start │ ⁃ │ ⁃ ╎ Y   │ step < 1: -inf   │
 *      ╰───────────────────────────────────────────╸╵
 */
export type RangeGeneratorConfig = {
  start: number;
  step?: number;
  end?: number;
  count?: number;
};
export function* rangeIter({
  start,
  step = 1,
  count = Number.POSITIVE_INFINITY,
  end = start + step * count,
}: RangeGeneratorConfig): IterableIterator<number> {
  for (
    let next = start, i = 0;
    i < count && step > 0 ? next < end : step < 0 ? next > end : true;
    i++, next += step
  ) {
    yield next;
  }
}

// const iterProxy: ProxyHandler<IterableIterator<T>> = {
//     get: <K extends keyof IterableIterator<T>, V extends IterableIterator<T>[K]>(target: IterableIterator<T>, property: K) => {
//       // return target[property];
//       // return (value: IterableIterator<T>[typeof property]) => {
//       return (value: V): IterableIterator<T> | IterableIterator<T>[K] => {
//         if (value) {
//           target[property] = value;
//           return new Proxy(target, iterProxy);
//         }
//         return target[property];
//       }
//     }
//   }
// }

// const wrappedResult =
// <F extends (...args: unknown[]) => unknown, T>(target: T, func: F) =>
// (...params: Parameters<F>) => {
// const result = func.apply(target, params);
// return [result];
// };

// export type IterTools = IterableIterator<unknown> & {
// takeLazily: (source: IterableIterator<unknown>, n: number) => IterTools;
// };

// const wrapIterable = (iterable: IterableIterator<unknown>): IterTools => {
// return new Proxy(iterable as IterTools, {
// get: <K extends keyof IterTools, V extends IterTools[K]>(
//   target: IterTools,
//   property: K,
//   receiver: unknown,
// ) => {
//   // return target[property];
//   // return (value: IterableIterator<T>[typeof property]) => {
//   return (value: V): IterTools | IterTools[K] => {
//     if (value) {
//       target[property] = value;
//       return wrapIterable(target);
//     }
//     return Reflect.get(target, property, receiver);
//   };
// },
// });
// };

// // const wrapIterable = <T>(iterable: IterableIterator<T>) => {
// //   return new Proxy(iterable, {
// //     get: <K extends keyof IterableIterator<T>, V extends IterableIterator<T>[K]>(target: IterableIterator<T>, property: K) => {
// //       // return target[property];
// //       // return (value: IterableIterator<T>[typeof property]) => {
// //       return (value: V): IterableIterator<T> | IterableIterator<T>[K] => {
// //         if (value) {
// //           target[property] = value;
// //           return new Proxy(target, iterProxy);
// //         }
// //         return target[property];
// //       }
// //     }
// //   })
// // };

// // export const itertools: IterTools<unknown> = {
// //   takeLazily: wrapGenerator(takeLazily),
// // };

/*
 * A stack of Iterables
 *
 * The most recently pushed iterable yields the next() value
 *
 * push([r])                          r
 * next() -> r                       / \
 * push([a,b])                      a   b
 * next() -> a                     /|\
 * push([c,d,e])                  c d e
 * next() -> c                      |
 * next() -> d                      f
 * push([f])
 * next() -> f                 r,a,c,d,f,e,b
 * next() -> e             (Pre-order traversal)
 * next() -> b
 *
 */
// export type IterStack<T> = {
//   push: (valIter: IterableIterator<T>) => void;
//   pop: () => T | undefined;
//   peek: () => T;

//   next: (x?: unknown) => IteratorResult<T>;
// };

// export const createIterStack = <T>(): IterStack<T> => {
// };
