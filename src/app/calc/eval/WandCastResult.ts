import type { ChangeFields } from '../../util';
import type { EvalTree } from './serialize';
import type { WandCast } from './WandCast';

export type WandCastResult = ChangeFields<
  WandCast,
  {
    actionCallTrees: EvalTree[];
  }
>;
