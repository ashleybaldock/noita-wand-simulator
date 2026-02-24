import type { SpellType } from './spellTypes';

const SpellTypeGroupInfoMapDefinition = {
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

export type SpellTypeGroup = keyof typeof SpellTypeGroupInfoMapDefinition;

export const spellTypeGroupsOrdered = Object.keys(
  SpellTypeGroupInfoMapDefinition,
).reverse() as readonly SpellTypeGroup[];

export type SpellTypeGroupName =
  (typeof SpellTypeGroupInfoMapDefinition)[SpellTypeGroup]['name'];

export type SpellTypeGroupSrc =
  (typeof SpellTypeGroupInfoMapDefinition)[SpellTypeGroup]['src'];

export type SpellTypeGroupDesc =
  (typeof SpellTypeGroupInfoMapDefinition)[SpellTypeGroup]['description'];

export type SpellTypeGroupUrl =
  (typeof SpellTypeGroupInfoMapDefinition)[SpellTypeGroup]['url'];

type SpellTypeGroupInfo = Readonly<{
  contains: readonly SpellType[];
  name: SpellTypeGroupName;
  src: SpellTypeGroupSrc;
  description: SpellTypeGroupDesc;
  url: SpellTypeGroupUrl;
}>;

export const spellTypeGroupInfoMap = SpellTypeGroupInfoMapDefinition as Record<
  SpellTypeGroup,
  Readonly<SpellTypeGroupInfo>
>;
