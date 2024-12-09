import type { Stack } from './Stack';
import { createStack } from './Stack';
import { takeArray } from './iterTools';
import { isNotNullOrUndefined, sequentialId, tee } from './util';
import type { TreeNode } from './TreeNode';

/**
 * Memoise a depth-first tree traversal
 *
 * Input Tree of form:
 * ╔═════════════════╦═════════════╗
 * ║ ┏ ━ ━ ━ ━┓      ║ Node type:  ║
 * ║ ╹ Parent ╻◁╮    ║ TreeNode≪T≫ ║
 * ║ ┗━ ━ ━ ╥ ┛ ┆    ╚═════════════╣
 * ║        ⍒   ┆                  ║
 * ║       ╭─────────╮       ╭───╮ ║
 * ║   ╭╌╌▷│  Node1  ╞(value)╡ T │ ║
 * ║   ┆   ╰────╥────╯       ╰───╯ ║
 * ║(parent)    ╟(children)        ║
 * ║   ┆    ╭───╨───┬──╴╴╴╴──╮     ║
 * ║   ┆    ⍒       ⍒        ⍒     ║
 * ║   ╰╌[Child1, Child2 … ChildN] ║
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

/**
 * Record of a tree node with links replaced with IDs
 */
export type MapTreeNode<T> = {
  value: T;
  id: MapTreeId;
  parentId?: MapTreeId;
  childIds: MapTreeId[];
};

export type SerialisedMapTree<T> = Map<MapTreeId, MapTreeNode<T>>;

/**
 * Wrapper around MapTreeNode<T>
 * pretending to be a tree with links
 */
export type MapTree<T> = {
  value: T;
  children: MapTree<T>[];
  parent?: MapTree<T>;
};

/**
 * Turn a tree with reference links into a tree using ID lookups
 * Performs a depth-first traversal
 *
 * TODO - this could expose a generator for doing ordered traversals
 */
export const mapTreeToMap = <T extends object>(
  rootNode?: TreeNode<T>,
): Map<MapTreeId, MapTreeNode<T>> => {
  console.log(rootNode);

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
      id: currentNodeId,
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

  return tee.log(mapTree);
};

/*
 * Turn serialised tree traversal back into
 * something resembling a tree
 */
export const mappedTreeToTreeMap = <T>(
  mapTree: Map<MapTreeId, MapTreeNode<T>>,
): MapTree<T> => {
  const makeSubTree = ({
    value,
    childIds,
    parentId,
  }: MapTreeNode<T>): MapTree<T> => {
    console.log(value, childIds, parentId);
    return {
      value,
      // TODO memoize this
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
