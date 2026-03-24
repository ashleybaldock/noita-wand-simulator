import { isNotNull, isNull } from './Predicate';
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
 *
 *           ╭────────╴◁️╮️╶︎────╴◁️╮️            ╶╴╶╴╶╴◁️╮️
 * [(0, 0), (1, 0), (2, 1), (3, 1), (4, 0), …️ (n-1, x)]
 *   ╰╴◁️╯️─────╴◁️╯️─︎────────────────────╴◁️╯️
 *
 *   𐍬  ⓐ︎⃝           init n0                   n0: parent(0) > stack(-1) - push 0
 *  /️  ╱️  ╲   [-1][0] 0  0  0  0 [0]    n1: parent(0) = stack(0)  ->
 *    ⓑ︎⃝   ⓒ         [1] 1  1 [4]
 *   ╱ ╲                [2][3]
 *  d   e   ✣⃟⃝ ✣⃘⃝ ✣⃞⃝ ✣꛰ ✣͍⃝ ✣⃣  ✴︎⃣ ⁕⃟＊⃟❊⃟ ✳︎⃟ ✢⃟ 𐌖 ㄩ⃟⃝ 𐌡꛰  ㄇ꛰
 *
 * serialise
 * if parent id > top id, push current node
 * if parent id = top id, pop + push
 * if parent id < top id, pop (parent id) + repeat
 */
export interface SerializableTree<T> {
  serializer(): IterableIterator<[parentIdx: ParentIdx, value: T]>;
  serialize: () => SerializedTree<T>;
}

export class MapTree<T> implements TreeRoot<T>, SerializableTree<T> {
  protected _root: MapTreeNode<T> | null = null;

  constructor(init: Readonly<SerializedTree<T>> = []) {
    /* Used to locate the parent of the node currently being deserialised */
    const ancestors: Array<[ParentIdx, MapTreeNode<T>]> = [];

    for (const [parentIdx, value] of init) {
      ancestors.splice(
        ancestors.findLastIndex(([idx]) => idx === parentIdx) + 1,
        Infinity,
      );
      ancestors.push([
        parentIdx,
        (ancestors[ancestors.length - 1]?.[1] ?? this).appendChild(value),
      ]);
    }

    // const lookup = new Map<ParentIdx, MapTreeNode<T>>();
    // let i = 0;
    // for (const [parentIdx, value] of init) {
    //   lookup.set(i++, (lookup.get(parentIdx) ?? this).appendChild(value));
    // }
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

  get isEmpty(): boolean {
    return isNull(this._root);
  }

  appendChild(value: T): MapTreeNode<T> {
    if (isNotNull(this._root)) {
      return this._root.appendChild(value);
    } else {
      this._root = new MapTreeNode(value);
      return this._root;
    }
  }

  *serializer(): IterableIterator<[parentIdx: ParentIdx, value: T]> {
    yield* mapIter(this.iter(), (n, i) => [i, n.value]);
  }

  serialize(): SerializedTree<T> {
    return [...this.serializer()];
  }
}

export class MapTreeNode<T> extends MapTree<T> implements TreeNode<T> {
  protected readonly _value: T;
  protected readonly _root: MapTreeNode<T>;
  protected readonly _parent: MapTreeNode<T>;
  protected readonly _children: MapTreeNode<T>[];

  private _childCount: number = 0;

  constructor(
    value: T,
    root?: MapTreeNode<T>,
    parent?: MapTreeNode<T>,
    children: MapTreeNode<T>[] = [],
  ) {
    super();
    this._value = value;
    this._root = root ?? this;
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

  get childCount(): number {
    return this._childCount;
  }

  appendChild(value: T): MapTreeNode<T> {
    const baby = new MapTreeNode(value, this._root, this);
    this._children.push(baby);
    this._childCount += 1;
    return baby;
  }

  get parent(): TreeNode<T> {
    return this._parent;
  }

  get root(): TreeNode<T> {
    return this._root;
  }
}
