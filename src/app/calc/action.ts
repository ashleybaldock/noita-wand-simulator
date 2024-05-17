import type { GunActionState } from './actionState';

export type Action = (
  c: GunActionState,
  recursion_level?: number,
  iteration?: number,
) => number | void;
