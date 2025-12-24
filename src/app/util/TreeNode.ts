/**
 * Tree data structure
 */

export type TreeNode<T> = {
  value: T | undefined;
  parent: TreeNode<T> | undefined;
  children: IterableIterator<TreeNode<T>>;
  appendChild: (child: T) => void;
  [Symbol.iterator](): IterableIterator<TreeNode<T>>;

  iter(): IterableIterator<TreeNode<T>>;
};

export type TreeRoot<T> = Omit<TreeNode<T>, 'parent'>;
