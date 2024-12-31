import type { WandShot } from './WandShot';

export type WandSalvo = {
  shots: WandShot[];
  reloadTime: number | undefined;
  wraps: number;
};
