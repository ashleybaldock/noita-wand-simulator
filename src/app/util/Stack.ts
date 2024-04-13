export type Stack<T> = {
  push: (val: T) => void;
  pop: () => T | undefined;
  peek: () => T;
};

export const createStack = <T>(): Stack<T> => {
  type Stacked<T> = {
    val: T;
    next: Stacked<T>;
  };

  let head: Stacked<T>;
  return Object.freeze({
    push: (val: T) => (head = { val, next: head }),
    pop: (): T => {
      const result = head;
      head = head?.next;
      return result?.val;
    },
    peek() {
      return head?.val;
    },
  });
};
