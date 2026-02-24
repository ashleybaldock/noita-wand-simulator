import type { ActionId } from './actionId';

const SpellFamilyInfoMapDefinition = {
  addtrigger: {
    spells: ['ADD_TRIGGER', 'ADD_TIMER', 'ADD_DEATH_TRIGGER'],
  },
  greek: {
    spells: ['ALPHA', 'GAMMA', 'TAU', 'OMEGA', 'MU', 'PHI', 'SIGMA', 'ZETA'],
  },
  divideby: {
    spells: ['DIVIDE_2', 'DIVIDE_3', 'DIVIDE_4', 'DIVIDE_10'],
  },
  random: {
    spells: ['RANDOM_SPELL', 'DRAW_RANDOM', 'DRAW_RANDOM_X3', 'DRAW_3_RANDOM'],
  },
  kantele: {
    spells: [
      'KANTELE_A',
      'KANTELE_D',
      'KANTELE_DIS',
      'KANTELE_E',
      'KANTELE_G]',
    ],
  },
  ocarina: {
    spells: [
      'OCARINA_A',
      'OCARINA_B',
      'OCARINA_C',
      'OCARINA_D',
      'OCARINA_E',
      'OCARINA_F',
      'OCARINA_GSHARP',
      'OCARINA_A2',
    ],
  },
} as const;

export type SpellFamily = keyof typeof SpellFamilyInfoMapDefinition;

type PartialSpellFamilyInfo = {
  spells: ActionId[];
};

export type SpellFamilyInfo =
  (typeof SpellFamilyInfoMapDefinition)[SpellFamily] & PartialSpellFamilyInfo;

export type SpellFamilyInfoMap = Record<SpellFamily, Readonly<SpellFamilyInfo>>;

export const spellTypeInfoMap =
  SpellFamilyInfoMapDefinition as SpellFamilyInfoMap;
