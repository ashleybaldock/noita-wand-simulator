import type { Stack } from './Stack';
import { createStack } from './Stack';
import { takeArray } from './iterTools';
import { isNotNullOrUndefined, sequentialId } from './util';
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
type MapTreeId = number;

/**
 * Record of a tree node with links replaced with IDs
 */
type MapTreeNode<T> = {
  value: T;
  id: MapTreeId;
  parentId?: MapTreeId;
  childIds: MapTreeId[];
};

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
export const mapTreeToMapTree = <T extends object>(
  rootNode?: TreeNode<T>,
): MapTree<T> => {
  const nextNodeId = sequentialId<MapTreeId>();

  const mapTree = new Map<MapTreeId, MapTreeNode<T>>();

  for (
    let currentNode = rootNode,
      currentNodeId = nextNodeId(),
      nodeIdMap = new Map<T, MapTreeId>(),
      traversalStack: Stack<TreeNode<T>> = createStack();
    isNotNullOrUndefined(currentNode);
    currentNode = traversalStack.pop(/* O(1) */), currentNodeId = nextNodeId()
  ) {
    nodeIdMap.set(/* WC O(log n) */ currentNode.value, nextNodeId());

    /* For any node that has a parent, that parent ought to
     * already be in the mapping (else how did we get here..?) */
    const parentId =
      (currentNode.parent &&
        nodeIdMap.get(/* WC O(log n) */ currentNode.parent.value)) ??
      undefined;
    mapTree.set(/* WC O(log n) */ currentNodeId, {
      id: currentNodeId,
      value: currentNode.value,
      parentId: parentId,
      childIds: [],
    });

    /* Update parent's children to include this node */
    if (isNotNullOrUndefined(parentId)) {
      const parent = mapTree.get(/* WC O(log n) */ parentId);
      parent?.childIds.push(/* O(1) */ currentNodeId);
    }
    currentNode.children.forEach((child) =>
      traversalStack.push(/* O(1) */ child),
    );
  }

  return wrapMapNode(mapTree);
};

const wrapMapNode = <T>(
  mapTree: Map<MapTreeId, MapTreeNode<T>>,
): MapTree<T> => {
  const makeSubTree = ({
    value,
    childIds,
    parentId,
  }: MapTreeNode<T>): MapTree<T> => {
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
