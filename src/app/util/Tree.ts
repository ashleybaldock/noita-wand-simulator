/**
 * Tree data structure
 */

/**
 * Tree root node, lacks parent
 */
export type TreeRoot<T> = Omit<TreeNode<T>, 'parent' | 'value'>;

/**
 * Tree node
 */
export type TreeNode<T> = {
  value: T;
  parent: TreeNode<T>;
  children: IterableIterator<TreeNode<T>>;
  childCount: number;
  appendChild: (child: T) => TreeNode<T>;
  [Symbol.iterator](): IterableIterator<TreeNode<T>>;

  iter(): IterableIterator<TreeNode<T>>;
};
