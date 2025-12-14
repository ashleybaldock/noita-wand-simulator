/**
 * Tree data structure
 */

export type TreeNode<T> = {
  value: T;
  parent: TreeNode<T>;
  children: IterableIterator<TreeNode<T>>;
  appendChild: (child: T) => void;
  [Symbol.iterator](): IterableIterator<TreeNode<T>>;
};

export type TreeRoot<T> = Omit<TreeNode<T>, 'parent'>;
