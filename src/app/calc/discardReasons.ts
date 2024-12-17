export const discardReasons = ['mana', 'charges', 'action'] as const;

export type DiscardReason = (typeof discardReasons)[number];
