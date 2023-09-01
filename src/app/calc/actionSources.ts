export const actionSources = ['draw', 'action', 'perk', 'multiple'] as const;

export type ActionSource = typeof actionSources[number];
