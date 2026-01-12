import { mapIter, narrowIter } from './iterTools';
import { sequentialId } from './util';
import {
  isNonNullable,
  isNotNullOrUndefined,
  isNullOrUndefined,
  isUndefined,
} from './Predicate';
import type { TreeNode, TreeRoot } from './Tree';

/**
 * Memoise a depth-first tree traversal
 *
 * Input Tree of form:
 * ╔═════════════════╦═════════════╗
 * ║ ┏ ━ ━ ━ ━┓      ║ Node type:  ║
 * ║ ╹ Parent ╻◁╌╮   ║ TreeNode≪️T≫️ ║
 * ║ ┗━ ━ ━ ╥ ┛  ┆   ╚═════════════╣
 * ║        ⍒    ┆                 ║
 * ║       ╭─────────────────────╮ ║
 * ║   ╭╌╌▷│  Node1  ╎  value: T │ ║
 * ║   ┆   ╰────┬────────────────╯ ║
 * ║(parent)    │                  ║
 * ║   ┆    ╭───┴───┬──╴╴╴╴──╮     ║
 * ║   ┆    ⍒       ⍒        ⍒     ║
 * ║   ╰╌[Child1, Child2 …️ ChildN] ║
 * ╚═══════════════════════════════╝
 *
 * Map<T>
 * get value()
 *
 * Flattens the tree into a Map, insertion order
 * being order nodes were visited
 *
 * Assumes that the tree is acyclic, excepting only
 * direct links from children to parent
 */
const MapTreeRootId = 0;
type MapTreeRootId = typeof MapTreeRootId;
export type MapTreeId = MapTreeRootId | number;

const isMapTreeId = (x: unknown): x is MapTreeId => 'number' === typeof x;
const isMapTreeRootId = (x: unknown): x is MapTreeRootId => 0 === x;

/**
 * Record of a tree node with links replaced with IDs
 */
export interface SerialisableTree {
  serialize: () => Array<[]>;
}
export type MapTreeEntry<T> = {
  value?: T;
  parentId?: MapTreeId;
  childIds?: MapTreeId[];
};

/**
 * For storage in Redux
 */
export type SerialisedMapTree<T> = [MapTreeId, MapTreeEntry<T>][];

export type SerializableMapTree<T> = {
  serialize: () => SerialisedMapTree<T>;
};

type MapTreeMap<T> = Map<MapTreeId, MapTreeEntry<T>>;
type MapTreeNodeMap<T> = Map<MapTreeId, MapTreeNode<T>>;
// type MapTreeNodeMap<T> = Map<MapTreeId, WeakRef<MapTreeNode<T>>>;

export class MapTree<T> implements TreeRoot<T>, SerializableMapTree<T> {
  protected nextMapTreeId: () => MapTreeId =
    sequentialId<MapTreeId>(MapTreeRootId);
  protected nodeMap: MapTreeNodeMap<T>;
  // protected map: MapTreeMap<T>;

  protected _root: MapTreeNode<T>;

  protected wrap = (entryId: MapTreeId) => {
    // if (isUndefined(entryId)) {
    //   return undefined;
    // }
    const entry = this.map.get(entryId);
    if (isUndefined(entry)) {
      return undefined;
    } else {
      const node = this.nodeMap.get(entryId)?.deref();
      if (isUndefined(node)) {
        return new MapTreeNode<T>(entry.value, entry.parentId, entry.childIds);
      } else {
        return node;
      }
    }
  };

  constructor(init?: Readonly<SerialisedMapTree<T>>) {
    this.nodeMap = new Map();
    // this.map = new Map(init);
  }

  *iter(): IterableIterator<TreeNode<T>> {
    yield* this._root;
  }

  [Symbol.iterator](): IterableIterator<TreeNode<T>> {
    return this.iter();
  }

  get value(): T {
    return this.map.get(this.id)?.value;
  }

  get children(): IterableIterator<TreeNode<T>> {
    return narrowIter(
      mapIter(
        (this.map.get(this.id)?.childIds ?? []).values(),
        (childId: MapTreeId) => this.wrap(childId),
      ),
      isNotNullOrUndefined,
    );
  }

  get childCount(): number {
    return this.map.get(this.id)?.childIds?.length ?? 0;
  }

  appendChild = (value: T): MapTreeNode<T> => {
    this._root = new MapTreeNode(value);
    return this._root;
    // const parentEntry = this.map.get(this.id);
    // if (isNonNullable(parentEntry)) {
    //   if (isNullOrUndefined(parentEntry.childIds)) {
    //     parentEntry.childIds = [];
    //   } else {
    //     parentEntry.childIds.push(baby.id);
    //   }
    // }
  };

  serialize = (): [MapTreeId, MapTreeEntry<T>][] => {
    return [...this.map.entries()];
  };
}

export class MapTreeNode<T> extends MapTree<T> implements TreeNode<T> {
  protected readonly _value: T;
  protected readonly _parent: MapTreeNode<T>;
  protected readonly _children: MapTreeNode<T>[];
  // protected readonly _parentId: MapTreeId;
  // protected readonly _childIds: MapTreeId[];

  protected readonly id: MapTreeId = this.nextMapTreeId();

  constructor(
    value: T,
    parent?: MapTreeNode<T>,
    children: MapTreeNode<T>[] = [],
  ) {
    super();
    this._value = value;
    this._parent = parent ?? this;
    this._children = children;
    // this._parentId = parentId;
    // this._childIds = childIds;
    // this.map.set(this.id, { value, parentId, childIds });
    this.nodeMap.set(this.id, this);
  }

  *iter(): IterableIterator<TreeNode<T>> {
    yield this;
    yield* this.children;
  }

  appendChild = (value: T): MapTreeNode<T> => {
    const baby = new MapTreeNode(value, this);
    this._children.push(baby);
    return baby;
  };
  get parent(): TreeNode<T> {
    return this._parent;
    // return this.wrap(this.map.get(this.id)?.parentId ?? this.id) ?? this;
  }
}
