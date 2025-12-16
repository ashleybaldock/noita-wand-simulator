export interface DefaultedMap<K, V> extends Map<K, V> {
  get(key: K): V;
}
interface DefaultedMapConstructor {
  new <K, V>(
    defaultValue: V,
    entries?: readonly (readonly [K, V])[] | null,
  ): DefaultedMap<K, V>;
  readonly prototype: DefaultedMap<any, any>;
}
declare const DefaultedMap: DefaultedMapConstructor;
