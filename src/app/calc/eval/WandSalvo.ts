import type { WandCast } from './WandCast';

export type WandSalvo = {
  casts: WandCast[];
  reloadTime: number | undefined;
  wraps: number;
};
