export const actionSources = [
  'draw',
  'action',
  'perk',
  'multiple',
  'unknown',
] as const;

export type ActionSource = typeof actionSources[number];
