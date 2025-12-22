import type { Stack } from './Stack';
import { createStack } from './Stack';
import { filterIter, mapIter, takeArray } from './iterTools';
import { sequentialId, tee } from './util';
import {isNonNullable, isNotNullOrUndefined, isNullOrUndefined} from './Predicate';
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
 * ║       ╭─────────┬╭───╮        ║
 * ║   ╭╌╌▷│  Node1  ╎╎ T │        ║
 * ║   ┆   ╰────┬────┴╰───╯        ║
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
  serialize: () => Array<[]>
};
export interface MapTreeRoot<T> extends TreeRoot<T> {
}

export type SerialisedMapTree<T> = Array<[MapTreeId, T, MapTreeId[]?]>;

export type MapTreeEntry<T> = [data: T, children: MapTreeId[]?];

export class MapTreeNode<T> implements TreeNode<T> {
  private map: Map<MapTreeId, MapTreeEntry<T>>;

  private id: MapTreeId;
  private parentId?: MapTreeId;

  constructor(map: Map<MapTreeId, MapTreeEntry<T>>, value: T, parentId?: MapTreeId, childIds?: MapTreeId[] = []) {
    this.map = map;
    this.id = nextMapTreeId();
    this.parentId = parentId;
    this.map.set(this.id, [value, childIds]);
  }
  [Symbol.iterator](): IterableIterator<TreeNode<T>> {
    this.map.entries
    throw new Error('Method not implemented.');
  }

  get parent(): TreeNode<T> | undefined {
    return (this.parentId && this.map.get(this.parentId)) ?? undefined;
  }

  appendChild = (value: T) => {
    const baby = new MapTreeNode(this.map, value);
    const parentEntry = this.map.get(this.id);
    if (isNonNullable(parentEntry)) {
      parentEntry[1]?.push(baby.id) ?? parentEntry.push([baby.id]);
      // parentEntry[1]?.push(baby.id) ?? this.map.set(this.id, [parentEntry[0], [baby.id]]);
    }
  }
  
  get value(): T | undefined {
    return this.map.get(this.id)?.[0];
  }
  get children(): IterableIterator<TreeNode<T>> {
    return filterIter(mapIter((this.map.get(this.id)?.childIds ?? []).values(), (childId: MapTreeId) => this.map.get(childId)), isNonNullable);
  }
}

class MapTree<T> implements TreeRoot<T> extends Map<MapTreeId, MapTreeNode<T>> {
  private map: Map<MapTreeId, MapTreeNode<T>>;
  private id: MapTreeId;

  constructor(init: readonly [MapTreeId, MapTreeNode<T>][] | null) {
    super(init);
    this.map = new Map(init);
    this.id = nextMapTreeId();
  }

  get value(): T | undefined {
    return this.map.get(this.id);
  }

  get children(): IterableIterator<TreeNode<T>> {
    return filterIter(mapIter(this.#childIds.values(), (childId) => this.#map.get(childId)),);
  }

  appendChild: (child: T) => void;
}

/**
 * Wrapper around MapTreeNode<T>
 * pretending to be a tree with links
 */
// export interface MapTree<T> extends Map<MapTreeId, MapTreeNode<T>>, TreeNode<T> {
//   value: T;
//   children: MapTree<T>[];
//   parent?: MapTree<T>;
// }
export interface MapTreeIf<T> extends MapIterator<[MapTreeId, MapTreeNode<T>]>, TreeNode<T> {
  value: T;
  // children: MapTree<T>[];
  children: MapIterator<T>;
  parent?: MapTree<T>;
  [Symbol.iterator](): MapIterator<[MapTreeId, MapTreeNode<T>]>;
  
}
/**
 * For storage in Redux
 */
// export type SerialisedMapTree<T> =
//   | [MapTreeId, MapTreeNode<T>][]
//   | MapIterator<[MapTreeId, MapTreeNode<T>]>;

/**
 * Turn a tree with reference links into a tree using ID lookups
 * Performs a depth-first traversal
 *
 * TODO - this could expose a generator for doing ordered traversals
 */
export const convertTreeToMapTree = <T extends object>(
  rootNode?: TreeNode<T>,
): MapTree<T> => {
  // console.log(rootNode);

  const nextNodeId = sequentialId<MapTreeId>();

  const mapTree = new Map<MapTreeId, MapTreeNode<T>>();

  for (
    let currentNode = rootNode,
      currentNodeId = nextNodeId(),
      nodeIdMap = new Map<T, MapTreeId>(),
      traversalStack: Stack<TreeNode<T>> = createStack();
    isNotNullOrUndefined(currentNode);
    currentNode = traversalStack.pop(/* O️(1) */), currentNodeId = nextNodeId()
  ) {
    nodeIdMap.set(/* WC O️(log n) */ currentNode.value, currentNodeId);

    /* For any node that has a parent, that parent ought to
     * already be in the mapping (else how did we get here..?) */
    const parentId =
      (currentNode.parent &&
        nodeIdMap.get(/* WC O️(log n) */ currentNode.parent.value)) ??
      undefined;
    mapTree.set(/* WC O️(log n) */ currentNodeId, {
      // id: currentNodeId,
      value: currentNode.value,
      parentId: parentId,
      childIds: [],
    });

    /* Update parent's children to include this node */
    if (isNotNullOrUndefined(parentId)) {
      const parent = mapTree.get(/* WC O️(log n) */ parentId);
      parent?.childIds.push(/* O️(1) */ currentNodeId);
    }
    // currentNode.children.forEach((child) =>
    // traversalStack.push(/* O️(1︎) */ child),
    // );
    /* This is a hack to avoid reversing the order
     * of the children by pushing them in reverse reverse
     * order onto the stack
     * TODO - a better stack */
    currentNode.children.findLast((child, i, arr) => {
      if (i in arr) {
        traversalStack.push(/* O️(1︎) */ child);
      }
    });
  }

  return tee.log(deserialiseMapTree(mapTree.entries()));
};

export const serialiseMapTree = <T>(mapTree: MapTree<T>): SerialisedMapTree<T> => {
  return mapTree.
};

/*
 * Turn serialised tree traversal back into
 * something resembling a tree
 */
export const deserialiseMapTree = <T>(
  serialisedMapTree: SerialisedMapTree<T>,
): MapTree<T> => {
  const mapTree = new Map(serialisedMapTree);
  const makeSubTree = ({
    value,
    childIds,
    parentId,
  }: MapTreeNode<T>): MapTree<T> => {
    // console.log(value, childIds, parentId);
    return {
      value,
      /* Lazy evaluation */
      get children(): MapTree<T>[] {
        return childIds
          .flatMap((childId) => mapTree.get(childId) ?? [])
          .map((child) => makeSubTree(child));
      },
      // TODO memoize this
      /* Lazy evaluation */
      get parent(): MapTree<T> | undefined {
        if (isNotNullOrUndefined(parentId)) {
          const parentNode = mapTree.get(parentId);
          if (isNotNullOrUndefined(parentNode)) {
            return makeSubTree(parentNode);
          }
        }
      },
    };
  };
  return makeSubTree(takeArray(mapTree.values(), 1)[0]);
};
