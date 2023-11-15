type Predicate<T> = (t: T) => boolean;
type MapTo<T, Tout> = (t: T) => Tout;
type MapToIter<T, Tout> = (t: T) => Iterable<Tout>;

/*
 * Map each item in iterable to an iterable
 * Like flatMap, 0 length iterable omits
 */
export function* flatMapIter<T, Tout>(
  iterable: IterableIterator<T>,
  mapToIter: MapToIter<T, Tout>,
): IterableIterator<Tout> {
  for (let x of iterable) {
    for (let y of mapToIter(x)) {
      yield y;
    }
  }
}

/*
 * Filter items in iterable based on predicate
 */
export function* filterIter<T>(
  iterable: IterableIterator<T>,
  predicate: Predicate<T>,
): IterableIterator<T> {
  for (const x of iterable) {
    if (predicate(x)) {
      yield x;
    }
  }
}

/*
 * Transform each item in iterable using mapping function
 * (To omit items, use flatMapIter)
 */
export function* mapIter<T, Tout>(
  iterable: IterableIterator<T>,
  mapper: MapTo<T, Tout>,
): IterableIterator<Tout> {
  for (let x of iterable) {
    yield mapper(x);
  }
}

/*
 * Perform a function on each item in iterable
 * and return the running result
 */
// export function* reduceIter<T, Tout>(
//   iterable: IterableIterator<T>,
//   accumulate: (acc: Tout, t: T) => Tout,
//   initial?: Tout,
//   // accumulator: MapTo<T, Tout>,
// ): IterableIterator<Tout> {
//   let acc = initial ?? iterable.next();
//   for (let x of iterable) {
//     acc = accumulate(acc, x);
//     yield acc;
//   }
// }

/*
 * Deduplicate input, keeps a count of unique inputs
 */
export function* tallyIter<T, Tout>(): IterableIterator<Tout> {}
