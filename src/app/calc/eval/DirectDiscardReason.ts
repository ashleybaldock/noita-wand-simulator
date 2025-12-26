const directDiscardReasons = [
  'NoUsesRemaining',
  'NotEnoughManaForAction',
] as const;

export type DirectDiscardReason = (typeof directDiscardReasons)[number];
