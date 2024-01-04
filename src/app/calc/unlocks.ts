import type * as beta from './__generated__/beta/unlocks';

export type UnlockCondition = beta.UnlockCondition;

export const getUnlockName = (unlockCondition: UnlockCondition) =>
  unlockCondition.substring(14);
