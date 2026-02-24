import type { SpellType } from './spellTypes';

export const validActionCallSources = [
  'projectile',
  'static',
  'material',
  'other',
  'utility',
] as const;

export type ValidActionCallSource = Extract<
  (typeof validActionCallSources)[number],
  SpellType
>;

const validActionCallSourceMap: Readonly<Set<SpellType>> = new Set(
  validActionCallSources,
);

export const isValidActionCallSource = (
  spellType: SpellType,
): spellType is ValidActionCallSource =>
  validActionCallSourceMap.has(spellType);
