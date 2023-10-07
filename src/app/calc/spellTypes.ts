const SpellTypeInfoMapDefinition = {
  projectile: {
    name: 'Projectile',
    src: 'data/spelltypes/item_bg_projectile.png',
    description: '',
    url: '',
  },
  static: {
    name: 'Static',
    src: 'data/spelltypes/item_bg_static_projectile.png',
    description: '',
    url: '',
  },
  modifier: {
    name: 'Modifier',
    src: 'data/spelltypes/item_bg_modifier.png',
    description: '',
    url: '',
  },
  multicast: {
    name: 'Multicast',
    src: 'data/spelltypes/item_bg_draw_many.png',
    description: '',
    url: '',
  },
  material: {
    name: 'Material',
    src: 'data/spelltypes/item_bg_material.png',
    description: '',
    url: '',
  },
  other: {
    name: 'Other',
    src: 'data/spelltypes/item_bg_other.png',
    description: '',
    url: '',
  },
  utility: {
    name: 'Utility',
    src: 'data/spelltypes/item_bg_utility.png',
    description: '',
    url: '',
  },
  passive: {
    name: 'Passive',
    src: 'data/spelltypes/item_bg_passive.png',
    description: '',
    url: '',
  },
} as const;

export type SpellType = keyof typeof SpellTypeInfoMapDefinition;

export type SpellTypeInfo = typeof SpellTypeInfoMapDefinition[SpellType];

export type SpellTypeName =
  typeof SpellTypeInfoMapDefinition[SpellType]['name'];

export type SpellTypeDescription =
  typeof SpellTypeInfoMapDefinition[SpellType]['description'];

export type SpellTypeUrl = typeof SpellTypeInfoMapDefinition[SpellType]['url'];

export type SpellTypeSrc = typeof SpellTypeInfoMapDefinition[SpellType]['src'];

export type SpellTypeInfoMap = Record<SpellType, Readonly<SpellTypeInfo>>;

export const spellTypeInfoMap = SpellTypeInfoMapDefinition as SpellTypeInfoMap;

export const isValidSpellType = (x: string): x is SpellType =>
  Object.prototype.hasOwnProperty.call(spellTypeInfoMap, x);

const groups = ['prj', 'mod', 'umo', 'smp'] as const;

export type SpellTypeGroup = typeof groups[number];

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
      src: 'data/spelltypes/item_bg_projectile.png',
      description: '',
      url: '',
    },
    mod: {
      contains: ['modifier'],
      name: 'Modifier',
      src: 'data/spelltypes/item_bg_modifier.png',
      description: 'Modifier type spells',
      url: '',
    },
    umo: {
      contains: ['utility', 'multicast', 'other'],
      // name: 'Utl/Mlt/Oth',
      name: 'Utility/Multicast/Other',
      src: 'data/spelltypes/item_bg_draw_many.png',
      description: 'Utility, Multicast and Other type spells',
      url: '',
    },
    smp: {
      contains: ['static', 'material', 'passive'],
      name: 'Static Projectile/Material/Passive',
      src: 'data/spelltypes/item_bg_material.png',
      description: 'Static Projectile, Material and Passive type spells',
      url: '',
    },
  } as const;

export const mapSpellTypeToGroup: Record<SpellType, SpellTypeGroup> = {
  projectile: 'prj',
  modifier: 'mod',
  multicast: 'umo',
  other: 'umo',
  utility: 'umo',
  static: 'smp',
  material: 'smp',
  passive: 'smp',
} as const;
