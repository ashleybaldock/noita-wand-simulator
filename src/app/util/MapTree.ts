import type { Stack } from './Stack';
import { createStack } from './Stack';
import { mapIter, narrowIter, takeArray } from './iterTools';
import { sequentialId, tee } from './util';
import {
  isNonNullable,
  isNotNullOrUndefined,
  isNullOrUndefined,
  isUndefined,
} from './Predicate';
import type { TreeNode, TreeRoot } from './TreeNode';

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
export type MapTreeId = number;

const nextMapTreeId = sequentialId<MapTreeId>();

/**
 * Record of a tree node with links replaced with IDs
 */
export interface SerialisableTree<T> {
  serialize: () => Array<[]>;
}
export interface MapTreeRoot<T> extends TreeRoot<T> {}

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
type MapTreeNodeMap<T> = Map<MapTreeId, WeakRef<MapTreeNode<T>>>;

export class MapTree<T> implements TreeRoot<T>, SerializableMapTree<T> {
  protected nodeMap: MapTreeNodeMap<T> = new Map();
  protected map: MapTreeMap<T>;

  protected readonly id: MapTreeId = nextMapTreeId();

  protected wrap = (entryId?: MapTreeId) => {
    if (isUndefined(entryId)) {
      return undefined;
    }
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
    this.map = new Map(init);
  }

  *iter(): IterableIterator<TreeNode<T>> {
    yield* this.children;
  }

  [Symbol.iterator](): IterableIterator<TreeNode<T>> {
    return this.iter();
  }

  get value(): T | undefined {
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

  appendChild = (value: T) => {
    const baby = new MapTreeNode(value);
    const parentEntry = this.map.get(this.id);
    if (isNonNullable(parentEntry)) {
      if (isNullOrUndefined(parentEntry.childIds)) {
        parentEntry.childIds = [];
      }
      parentEntry.childIds.push(baby.id);
    }
  };

  serialize = (): [MapTreeId, MapTreeEntry<T>][] => {
    return [...this.map.entries()];
  };
}

export class MapTreeNode<T> extends MapTree<T> implements TreeNode<T> {
  constructor(value?: T, parentId?: MapTreeId, childIds?: MapTreeId[] = []) {
    super();
    this.map.set(this.id, { value, parentId, childIds });
    this.nodeMap.set(this.id, new WeakRef(this));
  }

  *iter(): IterableIterator<TreeNode<T>> {
    yield this;
    yield* this.children;
  }

  get parent(): TreeNode<T> | undefined {
    const parentId = this.map.get(this.id)?.parentId;
    return this.wrap(parentId);
  }
}
