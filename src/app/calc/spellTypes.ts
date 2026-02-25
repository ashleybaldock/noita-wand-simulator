import { isNotNullOrUndefined } from '../util';
import type { ActionId } from './actionId';
import type { SpellFamily } from './spellFamily';

const SpellTypeInfoMapDefinition = {
  projectile: {
    name: 'Projectile',
    sprite: 'icon.spelltype.projectile',
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
    exampleId: 'BURST_2',
    description: '',
    url: '',
    families: ['tuple', 'scatter', 'formation'],
  },
  material: {
    name: 'Material',
    sprite: 'icon.spelltype.material',
    exampleId: 'MATERIAL_ACID',
    description: '',
    url: '',
    families: ['sea', 'circle', 'touch', 'drop'],
  },
  other: {
    name: 'Other',
    sprite: 'icon.spelltype.other',
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
    exampleId: 'TELEPORT_CAST',
    description: '',
    url: '',
    families: ['plicate', 'platform', 'cast', 'spellsto', 'topower'],
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

type PartialInfo = {
  exampleId: ActionId;
  families: SpellFamily[];
};

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
