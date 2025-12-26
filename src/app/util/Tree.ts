/**
 * Tree data structure
 */

/**
 * Tree root node, lacks parent
 */
export type TreeRoot<T> = Omit<TreeNode<T>, 'parent'>;

/**
 * Tree node
 */
export type TreeNode<T> = {
  value: T | undefined;
  parent: TreeNode<T> | undefined;
  children: IterableIterator<TreeNode<T>>;
  childCount: number;
  appendChild: (child: T) => TreeNode<T> | undefined;
  [Symbol.iterator](): IterableIterator<TreeNode<T>>;

  iter(): IterableIterator<TreeNode<T>>;
};
