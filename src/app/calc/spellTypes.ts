import type { ActionId } from './actionId';
import type { SpellFamily } from './spellFamily';
import { useSprite, type Sprite } from './sprite';

const SpellTypeInfoMapDefinition = {
  projectile: {
    name: 'Projectile',
    sprite: 'icon.spelltype.projectile',
    light: 'rgb(90 35 35 / 1)',
    dark: 'rgb(65 25 25 / 1)',
    exampleId: 'LIGHT_BULLET',
    description: '',
    url: '',
    families: [
      'spark',
      'bombs',
      'plasma',
      'tele',
      'saws',
      'heal',
      'spitter',
      'hole',
      'arrows',
      'mist',
      'nature',
      'magicmissle',
      'firebolt',
      'physics',
      'lightning',
      'lumi',
      'fire',
    ],
  },
  static: {
    name: 'Static',
    sprite: 'icon.spelltype.static',
    light: 'rgb(141 63 24 / 1)',
    dark: 'rgb(85 52 34 / 1)',
    exampleId: 'DELAYED_SPELL',
    description: '',
    url: '',
    families: [
      'field',
      'vacuum',
      'projfield',
      'cloud',
      'sade',
      'explosion',
      'summon',
      'barrier',
      'bighole',
    ],
  },
  modifier: {
    name: 'Modifier',
    sprite: 'icon.spelltype.modifier',
    light: 'rgb(45 58 144 / 1)',
    dark: 'rgb(32 41 82 / 1)',
    exampleId: 'MANA_REDUCE',
    description: '',
    url: '',
    families: [
      'trail',
      'orbit',
      'larpa',
      'glimmer',
      'thrower',
      'personal',
      'curse',
      'arc',
      'crit',
      'hitfx',
      'bundle',
      'bounce',
      'topowermod',
      'shot',
      'transmod',
      'dmgtype',
      'pathmod',
      'gravity',
      'warpmod',
      'friendly',
      'homing',
      'lifetime',
      'explodemod',
    ],
  },
  multicast: {
    name: 'Multicast',
    sprite: 'icon.spelltype.multicast',
    light: 'rgb(28 109 115 / 1)',
    dark: 'rgb(33 67 70 / 1)',
    exampleId: 'BURST_2',
    description: '',
    url: '',
    families: ['tuple', 'scatter', 'formation'],
  },
  material: {
    name: 'Material',
    sprite: 'icon.spelltype.material',
    light: 'rgb(53 111 68 / 1)',
    dark: 'rgb( 47 72 54 / 1)',
    exampleId: 'MATERIAL_ACID',
    description: '',
    url: '',
    families: ['sea', 'circle', 'touch', 'drop'],
  },
  other: {
    name: 'Other',
    sprite: 'icon.spelltype.other',
    light: 'rgb(113 75 51 / 1)',
    dark: 'rgb(73 57 46 / 1)',
    exampleId: 'ADD_TRIGGER',
    description: '',
    url: '',
    families: [
      'addtrigger',
      'greek',
      'divideby',
      'random',
      'kantele',
      'ocarina',
    ],
  },
  utility: {
    name: 'Utility',
    sprite: 'icon.spelltype.utility',
    light: 'rgb(123 42 116 / 1)',
    dark: 'rgb(77 42 74 / 1)',
    exampleId: 'TELEPORT_CAST',
    description: '',
    url: '',
    families: ['plicate', 'platform', 'cast', 'spellsto', 'topower'],
  },
  passive: {
    name: 'Passive',
    sprite: 'icon.spelltype.passive',
    light: 'rgb(33 47 38 / 1)',
    dark: 'rgb(24 33 27 / 1)',
    exampleId: 'TINY_GHOST',
    description: '',
    url: '',
  },
} as const;

export type SpellType = keyof typeof SpellTypeInfoMapDefinition;

type PartialInfo = {
  exampleId: ActionId;
  families: SpellFamily[];
  sprite: Sprite;
};

export type SpellTypeInfo = (typeof SpellTypeInfoMapDefinition)[SpellType] &
  PartialInfo;

export type SpellTypeName =
  (typeof SpellTypeInfoMapDefinition)[SpellType]['name'];

export type SpellTypeDescription =
  (typeof SpellTypeInfoMapDefinition)[SpellType]['description'];

export type SpellTypeUrl =
  (typeof SpellTypeInfoMapDefinition)[SpellType]['url'];

export type SpellTypeLight =
  (typeof SpellTypeInfoMapDefinition)[SpellType]['light'];

export type SpellTypeDark =
  (typeof SpellTypeInfoMapDefinition)[SpellType]['dark'];

export type SpellTypeSpriteName =
  (typeof SpellTypeInfoMapDefinition)[SpellType]['sprite'];

export type SpellTypeInfoMap = Record<SpellType, Readonly<SpellTypeInfo>>;

export const spellTypeInfoMap = SpellTypeInfoMapDefinition as SpellTypeInfoMap;

export const isValidSpellType = (x: string): x is SpellType =>
  Object.prototype.hasOwnProperty.call(spellTypeInfoMap, x);

export const getSpriteForSpellType = (spellType: SpellType): Sprite =>
  useSprite(spellTypeInfoMap[spellType].sprite);

export const getColoursForSpellType = (
  spellType: SpellType,
): { light: string; dark: string } => ({
  light: spellTypeInfoMap[spellType].light,
  dark: spellTypeInfoMap[spellType].dark,
});
