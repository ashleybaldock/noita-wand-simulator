import { isNotNullOrUndefined } from '../util';

const SpellTypeInfoMapDefinition = {
  projectile: {
    name: 'Projectile',
    src: 'data/spelltypes/item_bg_projectile.png',
    egSrc: 'var(--sprite-action-light-bullet)',
    description: '',
    url: '',
  },
  static: {
    name: 'Static',
    src: 'data/spelltypes/item_bg_static_projectile.png',
    egSrc: 'var(--sprite-action-delayed-spell)',
    description: '',
    url: '',
  },
  modifier: {
    name: 'Modifier',
    src: 'data/spelltypes/item_bg_modifier.png',
    egSrc: 'var(--sprite-action-mana-reduce)',

    description: '',
    url: '',
  },
  multicast: {
    name: 'Multicast',
    src: 'data/spelltypes/item_bg_draw_many.png',
    egSrc: 'var(--sprite-action-burst-2)',
    description: '',
    url: '',
  },
  material: {
    name: 'Material',
    src: 'data/spelltypes/item_bg_material.png',
    egSrc: 'var(--sprite-action-material-acid)',
    description: '',
    url: '',
  },
  other: {
    name: 'Other',
    src: 'data/spelltypes/item_bg_other.png',
    egSrc: 'var(--sprite-action-add-trigger)',
    description: '',
    url: '',
  },
  utility: {
    name: 'Utility',
    src: 'data/spelltypes/item_bg_utility.png',
    egSrc: 'var(--sprite-action-teleport-cast)',
    description: '',
    url: '',
  },
  passive: {
    name: 'Passive',
    src: 'data/spelltypes/item_bg_passive.png',
    egSrc: 'var(--sprite-action-tiny-ghost)',
    description: '',
    url: '',
  },
} as const;

export type SpellType = keyof typeof SpellTypeInfoMapDefinition;

export type SpellTypeInfo = (typeof SpellTypeInfoMapDefinition)[SpellType];

export type SpellTypeName =
  (typeof SpellTypeInfoMapDefinition)[SpellType]['name'];

export type SpellTypeDescription =
  (typeof SpellTypeInfoMapDefinition)[SpellType]['description'];

export type SpellTypeUrl =
  (typeof SpellTypeInfoMapDefinition)[SpellType]['url'];

export type SpellTypeSrc =
  (typeof SpellTypeInfoMapDefinition)[SpellType]['src'];

export type SpellTypeInfoMap = Record<SpellType, Readonly<SpellTypeInfo>>;

export const spellTypeInfoMap = SpellTypeInfoMapDefinition as SpellTypeInfoMap;

export const isValidSpellType = (x: string): x is SpellType =>
  Object.prototype.hasOwnProperty.call(spellTypeInfoMap, x);

export const getBackgroundUrlForSpellType = (spellType?: SpellType) =>
  isNotNullOrUndefined(spellType)
    ? `url('/${spellTypeInfoMap[spellType].src}')`
    : `url('/data/spelltypes/item_bg_unknown.png')`;

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
