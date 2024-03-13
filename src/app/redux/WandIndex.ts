import { isNumber } from '../util';

export const AC1 = Symbol('AC1');
export const AC2 = Symbol('AC2');
export const AC3 = Symbol('AC3');
export const AC4 = Symbol('AC4');
const AlwaysCastIndicies = [AC1, AC2, AC3, AC4] as const;

export const ZTA = Symbol('ZTA');
const SpecialWandIndices = [ZTA] as const;

export type AlwaysCastWandIndex = (typeof AlwaysCastIndicies)[number];
export const alwaysCastIndexSet: Set<SpecialWandIndex> = new Set([
  ...SpecialWandIndices,
]);
export const alwaysCastIndexMap: Record<AlwaysCastWandIndex, number> = {
  [AC1]: 1,
  [AC2]: 2,
  [AC3]: 3,
  [AC4]: 4,
};

export type SpecialWandIndex = (typeof SpecialWandIndices)[number];
export const specialIndexSet: Set<SpecialWandIndex> = new Set([
  ...SpecialWandIndices,
]);

export type MainWandIndex = number;

export type WandIndex = MainWandIndex | AlwaysCastWandIndex | SpecialWandIndex;

export const isMainWandIndex = (id: unknown): id is MainWandIndex =>
  isNumber(id);

export const isAlwaysCastIndex = (id: unknown): id is AlwaysCastWandIndex =>
  (alwaysCastIndexSet as Set<unknown>).has(id);

export const isSpecialWandIndex = (id: unknown): id is SpecialWandIndex =>
  (specialIndexSet as Set<unknown>).has(id);

export const isWandIndex = (id: unknown): id is WandIndex =>
  isNumber(id) || isAlwaysCastIndex(id) || isSpecialWandIndex(id);
