export const actionSources = [
  'draw',
  'action',
  'perk',
  'perm',
  'related',
  'multiple',
] as const;

export type ActionSource = (typeof actionSources)[number];
