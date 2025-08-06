/**
 * Tree data structure
 */

export interface TreeRoot<T> {
  value: T;
  children: IterableIterator<TreeNode<T>>;
  appendChild: (child: T) => void;
  [Symbol.iterator](): IterableIterator<TreeNode<T>>;
}

export interface TreeNode<T> extends TreeRoot<T> {
  parent?: TreeNode<T>;
}
