import { isNotNullOrUndefined } from '../util';

export const damageTypes = [
  'curse',
  'drill',
  'electricity',
  'explosion',
  'fire',
  'heal',
  'holy',
  'ice',
  'lackofair',
  'material',
  'melee',
  'midas',
  'physics-blackhole',
  'physics-crush',
  'physics-impact',
  'poison',
  'projectile',
  'radioactive',
  'slice',
] as const;

export type DamageType = typeof damageTypes[number];

export type DamageTypeInfo = {
  name: string;
  src: string;
  description: string;
};

const damageTypeInfoMap: Record<DamageType, Readonly<DamageTypeInfo>> = {
  'curse': {
    name: 'Curse',
    src: '',
    description: '',
  },
  'drill': {
    name: 'Drill',
    src: '',
    description: '',
  },
  'electricity': {
    name: 'Electric',
    src: '',
    description: '',
  },
  'explosion': {
    name: 'Explosion',
    src: '',
    description: '',
  },
  'fire': {
    name: 'Fire',
    src: '',
    description: '',
  },
  'heal': {
    name: 'Healing',
    src: '',
    description: '',
  },
  'holy': {
    name: 'Holy',
    src: '',
    description: '',
  },
  'ice': {
    name: 'Ice',
    src: '',
    description: '',
  },
  'lackofair': {
    name: 'Suffocation',
    src: '',
    description: '',
  },
  'material': {
    name: 'Material',
    src: '',
    description: '',
  },
  'melee': {
    name: 'Melee',
    src: '',
    description: '',
  },
  'midas': {
    name: 'Midas',
    src: '',
    description: '',
  },
  'physics-blackhole': {
    name: 'Gravity',
    src: '',
    description: '',
  },
  'physics-crush': {
    name: 'Crush',
    src: '',
    description: '',
  },
  'physics-impact': {
    name: 'Impact',
    src: '',
    description: '',
  },
  'poison': {
    name: 'Poison',
    src: '',
    description: '',
  },
  'projectile': {
    name: 'Projectile',
    src: '',
    description: '',
  },
  'radioactive': {
    name: 'Toxic',
    src: '',
    description: '',
  },
  'slice': {
    name: 'Slice',
    src: '',
    description: '',
  },
} as const;

export const getBackgroundUrlForDamageType = (damageType?: DamageType) =>
  isNotNullOrUndefined(damageType)
    ? `background-image: url('/data/damagetypes/dmg_${damageType}.png');`
    : `background-image: url('/data/damagetypes/dmg_other.png');`;
