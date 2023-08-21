import {
  Random as RandomExt,
  SetRandomSeed as SetRandomSeedExt,
} from './random';
import { Action } from '../';
import { store } from '../../redux/store';

const debug = false;

export function Random(min: number, max: number) {
  return RandomExt(min, max);
}

export function SetRandomSeed(a: number, b: number) {
  SetRandomSeedExt(store.getState().config.config.random.worldSeed, a, b);
}

export function GameGetFrameNum() {
  return store.getState().config.config.random.frameNumber;
}

export function* luaFor(start: number, count: number, step: number = 1) {
  let cur = start,
    n = 0;
  while (n < count) {
    yield cur;
    cur += step;
    n++;
  }
}

/* Note how this version:
 * a) copies the input array
 * b) compares against the original length
 * Which isn't how it is in lua
function* ipairs<T>([...arr]: T[]): Generator<[number,T]> {
  const len = arr.length;
  let i = -1;
  while (++i < len) {
    yield [i, arr[i]];
  }
}
*/

export function* ipairs<T>(arr: T[], tag: string = ''): Generator<[number, T]> {
  const log = (tag: string, i: number, arr: T[]) =>
    console.log(
      `${tag}(${i}) ${(arr as unknown as Action[])
        .map(({ id }, idx) => (idx === i ? `[${id}]` : `${id}`))
        .join(', ')}`,
    );

  let i = 0;
  while (i < arr.length) {
    debug && log(tag, i, arr);
    yield [i, arr[i]];
    i++;
  }
}
