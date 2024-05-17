// export type Deque<T> = readonly [big: End<T>, little: End<T>];

// export type End<T> = {
//   enqueue: (value: T) => void;
//   dequeue: () => T;
//   peek: () => T;
// };

// type Link<T> = {
//   value: T;
//   turnwise: Link<T>;
//   widdershins: Link<T>;
// };

// export const createDeque = <T>(): Deque<T> => {
//   let end: Link<T>;
//   return Object.freeze([
//     /* big end */
//     Object.freeze({
//       enqueue: (value: T): void => {
//         const link: Partial<Link<T>> = (end, value) => {
//           const unlinked: Partial<Link<T>>;

//          unlinked = {
//             value,
//           };
//           unlinked.turnwise = unlinked as Link<T>;
//           unlinked.widdershins = unlinked as Link<T>;

//           unlinked = {...unlinked
//           turnwise: end?.turnwise,
//           widdershins: end };
//           end ? end.turnwise = end.turnwise.widdershins = link : end = link;
//       },
//       dequeue: (): T => {},
//       peek: (): T => {},
//     }),
//     /* little end */
//     Object.freeze({
//       enqueue: (value: T): void => {},
//       dequeue: (): T => {},
//       peek: (): T => {},
//     }),
//   ]);
// };
