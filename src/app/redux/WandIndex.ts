import { isNotNullOrUndefined, isNumber } from '../util';

export const CUR = 'CUR';
export type CursorWandIndex = typeof CUR;

export const INV = 'INV';
export type InventoryWandIndex = typeof INV;

export const AlwaysCastIndicies = ['AC1', 'AC2', 'AC3', 'AC4'] as const;
export type AlwaysCastWandIndex = (typeof AlwaysCastIndicies)[number];
export const alwaysCastIndexSet: Set<AlwaysCastWandIndex> = new Set([
  ...AlwaysCastIndicies,
]);
export const alwaysCastIndexMap: Record<AlwaysCastWandIndex, number> = {
  AC1: 0,
  AC2: 1,
  AC3: 2,
  AC4: 3,
};

export const ZTA = 'ZTA';
export type ZetaWandIndex = typeof ZTA;
const SpecialWandIndices = [ZTA] as const;

export type SpecialWandIndex = (typeof SpecialWandIndices)[number];
export const specialIndexSet: Set<SpecialWandIndex> = new Set([
  ...SpecialWandIndices,
]);

export type MainWandIndex = number;

export type SelectionWandIndex = MainWandIndex | CursorWandIndex;

export type WandIndex =
  | InventoryWandIndex
  | CursorWandIndex
  | MainWandIndex
  | AlwaysCastWandIndex
  | SpecialWandIndex;

export type DroppableWandIndex =
  | MainWandIndex
  | AlwaysCastWandIndex
  | SpecialWandIndex;

export const isMainWandIndex = (id: unknown): id is MainWandIndex =>
  isNumber(id);

export const isAlwaysCastIndex = (id: unknown): id is AlwaysCastWandIndex =>
  (alwaysCastIndexSet as Set<unknown>).has(id);

export const isCursorWandIndex = (id: unknown): id is CursorWandIndex =>
  'CUR' === id;

export const isSpecialWandIndex = (id: unknown): id is SpecialWandIndex =>
  (specialIndexSet as Set<unknown>).has(id);

export const isSelectionWandIndex = (id: unknown): id is SelectionWandIndex =>
  isNumber(id);

export const isWandIndex = (id: unknown): id is WandIndex =>
  isNumber(id) || isAlwaysCastIndex(id) || isSpecialWandIndex(id);

export const isWithinBounds = (
  id: WandIndex | undefined,
  capacity: number,
): boolean =>
  isNotNullOrUndefined(id) &&
  (!isMainWandIndex(id) || (id >= 0 && id < capacity));
