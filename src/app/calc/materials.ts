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
  'material_rainbow',
] as const;

export type TrailMaterial = typeof trailMaterials[number];
const trailMaterialsSet: Set<TrailMaterial> = new Set(trailMaterials);
export const isTrailMaterial = (x: unknown): x is TrailMaterial =>
  isString(x) && (trailMaterialsSet as Set<string>).has(x);

export type TrailMaterialInfo = {
  name: string;
  description?: string;
};

const TrailMaterialInfoMap: Record<
  TrailMaterial,
  Readonly<TrailMaterialInfo>
> = {
  acid: { name: 'Acid' },
  alcohol: { name: 'Alcohol' },
  fire: { name: 'Fire' },
  gunpowder: { name: 'Gunpowder' },
  lava: { name: 'Lava' },
  oil: { name: 'Oil' },
  poison: { name: 'Poison' },
  water: { name: 'Water' },
  material_rainbow: { name: 'Rainbow' },
} as const;

export const getNameForTrailMaterial = (trailMaterial: TrailMaterial): string =>
  TrailMaterialInfoMap[trailMaterial].name;
