/**
 * Tree data structure
 */

/**
 * Tree root node, lacks parent, can be empty
 */
export type TreeRoot<T> = Omit<TreeNode<T>, 'parent' | 'value' | 'root'> & {
  isEmpty: boolean;
};

/**
 * Tree node, always has parent (which may be itself)
 */
export type TreeNode<T> = {
  value: T;
  parent: TreeNode<T>;
  root: TreeNode<T>;
  children: IterableIterator<TreeNode<T>>;
  childCount: number;
  appendChild(child: T): TreeNode<T>;
  [Symbol.iterator](): IterableIterator<TreeNode<T>>;

  iter(): IterableIterator<TreeNode<T>>;
};
