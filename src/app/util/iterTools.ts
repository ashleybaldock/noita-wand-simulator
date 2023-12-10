type Predicate<T> = (t: T) => boolean;
type Mapper<T, Tout> = (t: T) => Tout;
type IterMapper<T, Tout> = (t: T) => Iterable<Tout>;

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
 * !Beware, this reads all items from source into memory
 *
 * @returns Array of n items from source
 */
export function takeArray<T>(source: IterableIterator<T>, n: number): Array<T> {
  return Array.from(takeLazily(source, n));
}

/**
 * Like takeLazily, but eager
 *
 * !Beware, this reads all items from source into memory
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
 * Map values from source iterable to iterables
 * Similar to flatMap, map to a zero length iterator to omit values
 *
 * @param source an iterable to map from
 * @param {IterMapper} iterMapperFn function to execute for each value of source, should return an array or iterable
 */
export function* flatMapIter<T, Tout>(
  source: IterableIterator<T>,
  iterMapperFn: IterMapper<T, Tout>,
): IterableIterator<Tout> {
  for (let s of source) {
    for (let y of iterMapperFn(s)) {
      yield y;
    }
  }
}

/**
 * Filter source iterable based on predicate
 */
export function* filterIter<T>(
  source: IterableIterator<T>,
  predicate: Predicate<T>,
): IterableIterator<T> {
  for (const s of source) {
    if (predicate(s)) {
      yield s;
    }
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
  for (let s of source) {
    yield mapperFn(s);
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
 * Deduplicate input, keeps a count of unique inputs
 */
export function* tallyIter<T, Tout>(): IterableIterator<Tout> {}

// export function* zipIter<T extends Array<IterableIterator<unknown>>>(
//   ...iterables: T
// ): IterableIterator<{ [I in keyof T]: T[I] }> {}

// for (const z of zipIter([1, 2, 3].values(), ['a', 'b', 'c'].values())) {
// }

// function* zip<T extends any[][]>(...args: T) {
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

// for (const z of zip([1, 2, 3], ['a', 'b', 'c'])) {
// }
