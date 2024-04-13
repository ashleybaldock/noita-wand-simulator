/**
 * Iterator utility functions
 *
 * source:    IterableIterator<T>
 * predicate: Predicate<T>
 * callback:  Callback<T>
 * mapper:    Mapper<T, Tout>
 *
 *✅   every( source, predicate: Predicate<T>        ): boolean;
 *✅    some( source, predicate: Predicate<T>        ): boolean;
 *
 *      find( source, predicate: Predicate<T>        ): T;
 *
 *   forEach( source, callback:  Callback<T>         ): void;
 *✅  filter( source, predicate: Predicate<T>        ): Iterator<T>;
 *✅ flatMap( source, mapper:    Mapper<T, Iterable<Tout>>: Iterator<T>;
 *✅     map( source, mapper:    Mapper<T, Tout> ): Iterator<T>;
 *    reduce( source, reducer:    , initialValue?: T ): Tout;
 *
 *✅ take(source: IterableIterator<T>, count: number): Iterator<>
 *    ├ takeLazily
 *    ├ takeArray
 *    ├ takeOne
 *    └ takeEagerly
 *   drop(source: IterableIterator<T>, count: number): Iterator<>
 */
/*
 *
 * ✅ zip(...iters)
 * interleave(i, j)      i[n] j[n] ▬▶︎ [i[0], j[0], i[1], j[1] ... i[n], j[n]]
 *
 * intertwine
 * entwine
 * weave
 * inject
 *
 * interpolate
 * debounce
 * throttle
 */
export type Predicate<T> = (t: T, i: number) => boolean;
export const anythingPredicate: Predicate<unknown> = (t: unknown, i: unknown) =>
  true;
export const nothingPredicate: Predicate<unknown> = (...arg) => false;

export type Mapper<T, O> = (t: T, i: number) => O;
export type Callback<T> = (t: T, i: number) => void;

export type SequenceComparisonOptions<T> = {
  filterPredicate?: Predicate<T>;
};

export function* iterIter<T>(source: Iterator<T>): IterableIterator<T> {
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
 *
 * !Beware, this immediately reads the requested (n) items from the source into memory
 *
 * @returns Array of n items from source
 */
export function takeArray<T>(source: IterableIterator<T>, n: number): Array<T> {
  return Array.from(takeLazily(source, n));
}

export function takeOne<T>(source: IterableIterator<T>): T | undefined {
  return source.next().value;
}

/**
 * Like takeLazily, but eager
 *
 * !Beware, this immediately reads all items from source into memory, not for use with infinite sources
 *
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

export type RepeatIterOptions = {
  repetitions?: number;
  repeatFromCache?: boolean;
};
/**
 * Caches and repeats the input
 * Repeats forever, and caches input by default
 *
 * @param source an array or iterator to repeat
 * @param {RepeatIterOptions} [options] input options
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
 * Group sets of values from N inputs
 *  to one output of tuples of length N
 *
 * [A1, A2, ...An]  ⎫     [[A1, B1, …X1],
 * [B1, B2, ...Bn]  ⎬  ▬▶︎   [A2, B2, …X2],
 * [X1, X2, ...Xn]  ⎭        …[An, Bn, …Xn]]
 */
export function* zipIter<T extends IterableIterator<unknown>[]>(
  ...iterables: T
): IterableIterator<{ [I in keyof T]: T[I] }> {
  while (true) {
    const results = iterables.map((i) => i.next());

    if (results.some(({ done }) => done)) {
      break;
    }
    yield results.map(({ value }) => value) as T;
  }
}

export function* zip<T extends Array<unknown>[]>(...args: T) {
  for (
    let i = 0;
    i <
    Math.min(
      ...args.map((e) => {
        return e.length;
      }),
    );
    ++i
  ) {
    yield args.map((e) => {
      return e[i];
    }) as { [I in keyof T]: T[I][number] };
  }
}

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
 * @returns true if predicate true for all items, false if not
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

export const compareSequencesIter = <T>(
  { filterPredicate = anythingPredicate }: SequenceComparisonOptions<T>,
  ...sequences: [
    IterableIterator<T>,
    IterableIterator<T>,
    ...IterableIterator<T>[],
  ]
): boolean =>
  every(
    zipIter(
      ...sequences.map((sequence) => filterIter(sequence, filterPredicate)),
    ),
    (group) => group.every((v) => v === group[0]),
  );

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
