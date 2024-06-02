import { isNumber } from '../util';

export const CUR = 'CUR';
export type CursorWandIndex = typeof CUR;

export const AC1 = 'AC1';
export const AC2 = 'AC2';
export const AC3 = 'AC3';
export const AC4 = 'AC4';
export const AlwaysCastIndicies = [AC1, AC2, AC3, AC4] as const;

export const ZTA = 'ZTA';
const SpecialWandIndices = [ZTA] as const;

export type AlwaysCastWandIndex = (typeof AlwaysCastIndicies)[number];
export const alwaysCastIndexSet: Set<SpecialWandIndex> = new Set([
  ...SpecialWandIndices,
]);
export const alwaysCastIndexMap: Record<AlwaysCastWandIndex, number> = {
  AC1: 1,
  AC2: 2,
  AC3: 3,
  AC4: 4,
};

export type SpecialWandIndex = (typeof SpecialWandIndices)[number];
export const specialIndexSet: Set<SpecialWandIndex> = new Set([
  ...SpecialWandIndices,
]);

export type MainWandIndex = number;

export type SelectionWandIndex = MainWandIndex | CursorWandIndex;

export type WandIndex =
  | MainWandIndex
  | AlwaysCastWandIndex
  | CursorWandIndex
  | SpecialWandIndex;

export const isMainWandIndex = (id: unknown): id is MainWandIndex =>
  isNumber(id);

export const isAlwaysCastIndex = (id: unknown): id is AlwaysCastWandIndex =>
  (alwaysCastIndexSet as Set<unknown>).has(id);

export const isCursorWandIndex = (id: unknown): id is CursorWandIndex =>
  id === CUR;

export const isSpecialWandIndex = (id: unknown): id is SpecialWandIndex =>
  (specialIndexSet as Set<unknown>).has(id);

export const isSelectionWandIndex = (id: unknown): id is SelectionWandIndex =>
  isNumber(id) || isSelectionWandIndex(id);

export const isWandIndex = (id: unknown): id is WandIndex =>
  isNumber(id) || isAlwaysCastIndex(id) || isSpecialWandIndex(id);
