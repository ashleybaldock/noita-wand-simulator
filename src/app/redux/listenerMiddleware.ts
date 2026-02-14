import { createListenerMiddleware, addListener } from '@reduxjs/toolkit';
import type {
  TypedStartListening,
  TypedAddListener,
  TaskResult,
  TaskResolved,
  TaskRejected,
  TaskCancelled,
} from '@reduxjs/toolkit';
import type { RootState, AppDispatch } from './store';

export const listenerMiddleware = createListenerMiddleware();

export type AppStartListening = TypedStartListening<RootState, AppDispatch>;

export const startAppListening =
  listenerMiddleware.startListening as AppStartListening;

export const addAppListener = addListener as TypedAddListener<
  RootState,
  AppDispatch
>;
export const resultOk = <T>(result: TaskResult<T>): result is TaskResolved<T> =>
  result.status === 'ok';

export const resultRejected = <T>(
  result: TaskResult<T>,
): result is TaskRejected => result.status === 'rejected';

export const resultCancelled = <T>(
  result: TaskResult<T>,
): result is TaskCancelled => result.status === 'cancelled';
