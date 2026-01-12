import { isNotNull } from './Predicate';
import type { TreeNode, TreeRoot } from './Tree';
import { mapIter } from './iterTools';

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
// const MapTreeRootId = 0;
// type MapTreeRootId = typeof MapTreeRootId;
// export type MapTreeId = MapTreeRootId | number;

// const isMapTreeId = (x: unknown): x is MapTreeId => 'number' === typeof x;
// const isMapTreeRootId = (x: unknown): x is MapTreeRootId => 0 === x;

export type ParentIdx = number;
export type SerializedTree<T> = [parentIdx: ParentIdx, value: T][];

/**
 * Turns a tree into a flat array representing a pre-order traversal
 * Each entry consists of:
 *  - the node's value
 *  - the array index of its parent
 * This is enough information to reconstruct the tree, but can also
 * be used as a cached representation of the traversal
 */
export interface SerializableTree<T> {
  serializer(): IterableIterator<[parentIdx: ParentIdx, value: T]>;
  serialize: () => SerializedTree<T>;
}

export class MapTree<T> implements TreeRoot<T>, SerializableTree<T> {
  protected _root: MapTreeNode<T> | null = null;

  constructor(init: Readonly<SerializedTree<T>> = []) {
    let i = 0;
    const lookup = new Map<ParentIdx, MapTreeNode<T>>();
    for (const [parentIdx, value] of init) {
      lookup.set(i++, (lookup.get(parentIdx) ?? this).appendChild(value));
    }
  }

  *iter(): IterableIterator<TreeNode<T>> {
    if (isNotNull(this._root)) {
      yield* this._root;
    }
  }

  *iterChildren(): IterableIterator<TreeNode<T>> {
    if (isNotNull(this._root)) {
      yield* this._root.children;
    }
  }

  [Symbol.iterator](): IterableIterator<TreeNode<T>> {
    return this.iter();
  }

  get children(): IterableIterator<TreeNode<T>> {
    return this.iterChildren();
  }

  get childCount(): number {
    if (isNotNull(this._root)) {
      return this._root.childCount;
    }
    return 0;
  }

  appendChild = (value: T): MapTreeNode<T> => {
    if (isNotNull(this._root)) {
      return this._root.appendChild(value);
    } else {
      this._root = new MapTreeNode(value);
      return this._root;
    }
  };

  *serializer(): IterableIterator<[parentIdx: ParentIdx, value: T]> {
    yield* mapIter(this.iter(), (n, i) => [i, n.value]);
  }

  serialize = (): SerializedTree<T> => {
    return [...this.serializer()];
  };
}

export class MapTreeNode<T> extends MapTree<T> implements TreeNode<T> {
  protected readonly _value: T;
  protected readonly _parent: MapTreeNode<T>;
  protected readonly _children: MapTreeNode<T>[];

  constructor(
    value: T,
    parent?: MapTreeNode<T>,
    children: MapTreeNode<T>[] = [],
  ) {
    super();
    this._value = value;
    this._parent = parent ?? this;
    this._children = children;
  }

  get value(): T {
    return this._value;
  }

  *iter(): IterableIterator<TreeNode<T>> {
    yield this;
    yield* this._children;
  }

  *iterChildren(): IterableIterator<TreeNode<T>> {
    yield* this._children;
  }

  [Symbol.iterator](): IterableIterator<TreeNode<T>> {
    return this.iter();
  }

  get children(): IterableIterator<TreeNode<T>> {
    return this.iterChildren();
  }

  appendChild = (value: T): MapTreeNode<T> => {
    const baby = new MapTreeNode(value, this);
    this._children.push(baby);
    return baby;
  };

  get parent(): TreeNode<T> {
    return this._parent;
  }
}
