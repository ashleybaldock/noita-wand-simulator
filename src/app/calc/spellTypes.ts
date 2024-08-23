import { isNotNullOrUndefined } from '../util';
import type { ActionId } from './actionId';

type PartialInfo = {
  exampleId: ActionId;
};

const SpellTypeInfoMapDefinition = {
  projectile: {
    name: 'Projectile',
    sprite: 'icon.spelltype.projectile',
    exampleId: 'LIGHT_BULLET',
    description: '',
    url: '',
  },
  static: {
    name: 'Static',
    sprite: 'icon.spelltype.static',
    exampleId: 'DELAYED_SPELL',
    description: '',
    url: '',
  },
  modifier: {
    name: 'Modifier',
    sprite: 'icon.spelltype.modifier',
    exampleId: 'MANA_REDUCE',
    description: '',
    url: '',
  },
  multicast: {
    name: 'Multicast',
    sprite: 'icon.spelltype.multicast',
    exampleId: 'BURST_2',
    description: '',
    url: '',
  },
  material: {
    name: 'Material',
    sprite: 'icon.spelltype.material',
    exampleId: 'MATERIAL_ACID',
    description: '',
    url: '',
  },
  other: {
    name: 'Other',
    sprite: 'icon.spelltype.other',
    exampleId: 'ADD_TRIGGER',
    description: '',
    url: '',
  },
  utility: {
    name: 'Utility',
    sprite: 'icon.spelltype.utility',
    exampleId: 'TELEPORT_CAST',
    description: '',
    url: '',
  },
  passive: {
    name: 'Passive',
    sprite: 'icon.spelltype.passive',
    exampleId: 'TINY_GHOST',
    description: '',
    url: '',
  },
} as const;

export type SpellType = keyof typeof SpellTypeInfoMapDefinition;

export type SpellTypeInfo = (typeof SpellTypeInfoMapDefinition)[SpellType] &
  PartialInfo;

export type SpellTypeName =
  (typeof SpellTypeInfoMapDefinition)[SpellType]['name'];

export type SpellTypeDescription =
  (typeof SpellTypeInfoMapDefinition)[SpellType]['description'];

export type SpellTypeUrl =
  (typeof SpellTypeInfoMapDefinition)[SpellType]['url'];

export type SpellTypeSpriteName =
  (typeof SpellTypeInfoMapDefinition)[SpellType]['sprite'];

export type SpellTypeInfoMap = Record<SpellType, Readonly<SpellTypeInfo>>;

export const spellTypeInfoMap = SpellTypeInfoMapDefinition as SpellTypeInfoMap;

export const isValidSpellType = (x: string): x is SpellType =>
  Object.prototype.hasOwnProperty.call(spellTypeInfoMap, x);

export const getSpriteForSpellType = (
  spellType?: SpellType,
): SpellTypeSpriteName | 'missing' =>
  isNotNullOrUndefined(spellType)
    ? spellTypeInfoMap[spellType].sprite
    : 'missing';

const groups = ['prj', 'mod', 'umo', 'smp'] as const;

export type SpellTypeGroup = (typeof groups)[number];

type SpellTypeGroupInfo = {
  contains: readonly SpellType[];
  name: string;
  src: string;
  description: string;
  url: string;
};

export const spellTypeGroupsOrdered = [
  ...groups,
].reverse() as readonly SpellTypeGroup[];
export const spellTypeGroupInfoMap: Record<SpellTypeGroup, SpellTypeGroupInfo> =
  {
    prj: {
      contains: ['projectile'],
      name: 'Projectile',
      src: '',
      description: '',
      url: '',
    },
    mod: {
      contains: ['modifier'],
      name: 'Modifier',
      src: '',
      description: 'Modifier type spells',
      url: '',
    },
    umo: {
      contains: ['utility', 'multicast', 'other'],
      name: 'Utility/Multicast/Other',
      src: '',
      description: 'Utility, Multicast and Other type spells',
      url: '',
    },
    smp: {
      contains: ['static', 'material', 'passive'],
      name: 'Static Proj./Material/Passive',
      src: '',
      description: 'Static Projectile, Material and Passive type spells',
      url: '',
    },
  } as const;

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
