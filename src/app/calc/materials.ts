import { isString } from '../util/util';

export const trailMaterials = [
  'acid',
  'alcohol',
  'fire',
  'gunpowder',
  'lava',
  'oil',
  'poison',
  'water',
] as const;

export type TrailMaterial = typeof trailMaterials[number];
const trailMaterialsSet: Set<TrailMaterial> = new Set(trailMaterials);
export const isTrailMaterial = (x: unknown): x is TrailMaterial =>
  isString(x) && (trailMaterialsSet as Set<string>).has(x);
