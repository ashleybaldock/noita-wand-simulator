import type { Action } from '@reduxjs/toolkit';

export type ListenerPredicate<T> = (
  action: Action,
  currentState: T,
  previousState: T,
) => boolean;
