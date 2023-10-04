import { Slice } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './store';

type SliceNames = keyof RootState;

type StoreData<SliceName extends SliceNames> = {
  [K in SliceName]: RootState[K];
};

type WrappedSliceMethods<S extends Slice> = {
  [ActionName in keyof S['actions']]: (
    ...args: Parameters<S['actions'][ActionName]>
  ) => void;
};

export const useSliceWrapper = <S extends Slice, N extends SliceNames>(
  slice: S,
  sliceName: N,
): WrappedSliceMethods<S> & Readonly<StoreData<N>> => {
  const dispatch = useDispatch();
  const { actions } = slice;

  const data = useSelector<RootState, RootState[N]>(
    (state) => state[sliceName],
  );
  const dataOutput = { [sliceName]: data } as Readonly<StoreData<N>>;

  const methods = Object.keys(actions).reduce((acc, k) => {
    const key = k as keyof typeof actions;
    type Method = S['actions'][typeof key];

    if (actions[key]) {
      return {
        ...acc,
        [key]: (...input: Parameters<Method>) => {
          dispatch(actions[key](input));
        },
      };
    }
    return acc;
  }, {} as WrappedSliceMethods<S>);

  return { ...methods, ...dataOutput };
};
