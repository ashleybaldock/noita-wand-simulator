/* Magic */
type InferValue<Prop extends PropertyKey, Desc> = Desc extends {
  get(): unknown;
  value: unknown;
}
  ? never
  : Desc extends { value: infer T }
  ? Record<Prop, T>
  : Desc extends { get(): infer T }
  ? Record<Prop, T>
  : never;

type DefineProperty<
  Prop extends PropertyKey,
  Desc extends PropertyDescriptor,
> = Desc extends { writable: unknown; set(val: unknown): unknown }
  ? never
  : Desc extends { writable: unknown; get(): unknown }
  ? never
  : Desc extends { writable: false }
  ? Readonly<InferValue<Prop, Desc>>
  : Desc extends { writable: true }
  ? InferValue<Prop, Desc>
  : Readonly<InferValue<Prop, Desc>>;

function defineProperty<
  Obj extends object,
  Key extends PropertyKey,
  PDesc extends PropertyDescriptor,
>(
  obj: Obj,
  prop: Key,
  val: PDesc,
): asserts obj is Obj & DefineProperty<Key, PDesc> {
  Object.defineProperty(obj, prop, val);
}

// const defineMethod = <
//   O extends object,
// >(
//   x: O,
//   key: keyof TeeBug,
//   f: ideEffect,
// ): asserts x is O & { K: BoundTee } => {
//   Object.defineProperty(x, key, {
//     enumerable: false,
//     configurable: false,
//     value: f,
//   });
// };

/*  */
export type SideEffect = <T, Q>(i: Readonly<T>, ...args: Readonly<Q>[]) => void;
export type Tee = <T, Q>(
  f: SideEffect,
  x: Readonly<T>,
  ...args: Readonly<Q>[]
) => T;
export type BoundTee = <T, Q>(i: Readonly<T>, ...args: Readonly<Q>[]) => T;

export type TeeBug = Tee & {
  log: BoundTee;
  info: BoundTee;
  warn: BoundTee;
  error: BoundTee;
  debug: BoundTee;
};

/**
 * Input provided to a side effect function, and then returned
 * e.g. for logging return values from function calls without
 *      adding an intermediate variable
 *
 *  return doOtherStuff(doStuff()); // log result of doStuff()
 *
 *  const x = doStuff();
 *  console.log(x);                 // eh
 *  return doOtherStuff(x);
 *
 *  return doOtherStuff(tee.log(doStuff()));          // console.log/warn/error etc.
 *
 *  return doOtherStuff(tee(speciallog, doStuff()));  // Custom side effect
 */
export const tee: TeeBug = (() => {
  const teeBase: Tee = <T, Q>(
    f: SideEffect = console.log,
    x: Readonly<T>,
    ...args: Readonly<Q>[]
  ) => {
    f(x, ...args);
    return x;
  };

  // defineMethod(teeFn, 'log', console.log);

  defineProperty(teeBase, 'log', {
    value: Function.prototype.call.bind(teeBase, teeBase, console.log),
    enumerable: false,
    configurable: false,
  });
  defineProperty(teeBase, 'info', {
    value: Function.prototype.call.bind(teeBase, teeBase, console.info),
    enumerable: false,
    configurable: false,
  });
  defineProperty(teeBase, 'warn', {
    value: Function.prototype.call.bind(teeBase, teeBase, console.warn),
    enumerable: false,
    configurable: false,
  });
  defineProperty(teeBase, 'error', {
    value: Function.prototype.call.bind(teeBase, teeBase, console.error),
    enumerable: false,
    configurable: false,
  });
  defineProperty(teeBase, 'debug', {
    value: Function.prototype.call.bind(teeBase, teeBase, console.debug),
    enumerable: false,
    configurable: false,
  });
  return teeBase;
})();
