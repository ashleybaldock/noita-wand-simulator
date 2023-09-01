import { Preset, PresetGroup } from '../types';

const defaultPreset: Readonly<Preset> = {
  name: '',
  wand: {
    actions_per_round: 1,
    deck_capacity: 26,
    reload_time: 0,
    shuffle_deck_when_empty: false,
    cast_delay: 0,
    mana_charge_speed: 20000,
    mana_max: 20000,
    spread: 0,
    name: '',
    pic: '',
    speed: 1,
  },
  spells: [],
};

export const defaultWand = defaultPreset.wand;

export const defaultPresets: Array<Preset | PresetGroup> = [
  {
    name: 'Advanced Guide: Introduction to Greek Letter Spells',
    presets: [
      {
        name: 'Wand Refresh',
        wand: { ...defaultWand, deck_capacity: 5 },
        spells: ['BURST_2', 'BLACK_HOLE', 'RESET', 'LARPA_CHAOS', 'NUKE'],
      },
      {
        name: 'Gamma',
        wand: { ...defaultWand, deck_capacity: 8 },
        spells: [
          'MANA_REDUCE',
          'MANA_REDUCE',
          'BURST_2',
          'LIGHT_BULLET_TRIGGER',
          'GAMMA',
          'CHAINSAW',
          'RESET',
          'BLACK_HOLE_BIG',
        ],
      },
      {
        name: 'Mu 1',
        wand: { ...defaultWand, deck_capacity: 4 },
        spells: [
          'EXPLOSIVE_PROJECTILE',
          'EXPLOSIVE_PROJECTILE',
          'MU',
          'LIGHT_BULLET',
        ],
      },
      {
        name: 'Mu 2',
        wand: { ...defaultWand, deck_capacity: 14 },
        spells: [
          'MANA_REDUCE',
          'BURST_2',
          'GAMMA',
          'LIGHT_BULLET',
          'CHAINSAW',
          'RESET',
          'HOMING',
          'PIERCING_SHOT',
          'CLIPPING_SHOT',
          'LIFETIME',
          'CURSE_WITHER_EXPLOSION',
          'EXPLOSIVE_PROJECTILE',
          'EXPLOSIVE_PROJECTILE',
          'MU',
        ],
      },
      {
        name: 'Alpha',
        wand: { ...defaultWand, deck_capacity: 11 },
        spells: [
          'ROCKET_TIER_3',
          'GAMMA',
          'BURST_2',
          'ALPHA',
          'RESET',
          'CHAINSAW',
          'RESET',
          'ORBIT_LARPA',
          'LARPA_CHAOS',
          'LARPA_DEATH',
          'MU',
        ],
      },
      {
        name: 'Tau',
        wand: { ...defaultWand, deck_capacity: 14 },
        spells: [
          'BURST_2',
          'LONG_DISTANCE_CAST',
          'MANA_REDUCE',
          'MANA_REDUCE',
          'MANA_REDUCE',
          'NOLLA',
          'GAMMA',
          'BLACK_HOLE_DEATH_TRIGGER',
          'REGENERATION_FIELD',
          'NOLLA',
          'TELEPORT_PROJECTILE_STATIC',
          'CHAINSAW',
          'RESET',
          'TAU',
        ],
      },
    ],
  },
  {
    name: 'Expert Guide: Draw',
    presets: [
      {
        name: 'Spell Evaluation',
        wand: { ...defaultWand, deck_capacity: 9 },
        spells: [
          'DAMAGE',
          'BURST_2',
          'BURST_2',
          'LIGHT_BULLET',
          'LIGHT_BULLET',
          'LIGHT_BULLET',
          'SPEED',
          'LIGHT_BULLET',
          'NUKE',
        ],
      },
      {
        name: 'Wrapping 1',
        wand: { ...defaultWand, deck_capacity: 7 },
        spells: [
          'BURST_2',
          'LIGHT_BULLET',
          'LIGHT_BULLET',
          'LIGHT_BULLET',
          'LIGHT',
        ],
      },
      {
        name: 'Wrapping 2',
        wand: { ...defaultWand, deck_capacity: 7 },
        spells: [
          'LIGHT_BULLET',
          'LIGHT_BULLET',
          'LIGHT_BULLET',
          'LIGHT_BULLET',
          'LIGHT_BULLET',
          'LIGHT_BULLET',
          'LIGHT_BULLET',
        ],
      },
      {
        name: 'Wrapping 3',
        wand: { ...defaultWand, deck_capacity: 8 },
        spells: [
          'LIGHT_BULLET',
          'LIGHT_BULLET',
          'LIGHT_BULLET',
          'LIGHT_BULLET',
          'LIGHT_BULLET',
          'LIGHT_BULLET',
          'LIGHT_BULLET',
          'LIGHT',
        ],
      },
      {
        name: 'Triggers',
        wand: { ...defaultWand, deck_capacity: 8 },
        spells: [
          'HOMING',
          'PIERCING_SHOT',
          'LIGHT_BULLET_TRIGGER',
          'BURST_3',
          'DAMAGE',
          'DIGGER',
          'DIGGER',
          'DIGGER',
        ],
      },
    ],
  },
  {
    name: 'Expert Guide: Divide By Spells',
    presets: [
      {
        name: 'Simple Divides',
        wand: { ...defaultWand, deck_capacity: 2 },
        spells: ['DIVIDE_10', 'LIGHT_BULLET'],
      },
      {
        name: 'Dividing a Modifier',
        wand: { ...defaultWand, deck_capacity: 3 },
        spells: ['DIVIDE_10', 'DAMAGE', 'LIGHT_BULLET'],
      },
      {
        name: 'Discard Displacement',
        wand: { ...defaultWand, deck_capacity: 6 },
        spells: [
          'BURST_2',
          'DIVIDE_2',
          'DAMAGE',
          'LIGHT_BULLET',
          'LIGHT_BULLET',
          'RESET',
        ],
      },
      {
        name: 'Mechanics of Multiple Divides',
        wand: { ...defaultWand, deck_capacity: 3 },
        spells: ['DIVIDE_10', 'DIVIDE_4', 'LIGHT_BULLET'],
      },
      {
        name: 'Multiple Divides on a Modifier',
        wand: { ...defaultWand, deck_capacity: 4 },
        spells: ['DIVIDE_10', 'DIVIDE_4', 'DAMAGE', 'LIGHT_BULLET'],
      },
      {
        name: 'Iteration limit',
        wand: { ...defaultWand, deck_capacity: 6 },
        spells: [
          'BURST_2',
          'DIVIDE_10',
          'DIVIDE_10',
          'DIVIDE_10',
          'DAMAGE',
          'LIGHT_BULLET',
        ],
      },
      {
        name: 'Wrapping Strangeness',
        wand: { ...defaultWand, deck_capacity: 6 },
        spells: [
          'BURST_4',
          'DIVIDE_10',
          'DIVIDE_10',
          'DIVIDE_10',
          'DAMAGE',
          'LIGHT_BULLET',
        ],
      },
    ],
  },
  {
    name: 'Expert Guide: Calling and Recursion',
    presets: [
      {
        name: 'Tau Example',
        wand: { ...defaultWand, deck_capacity: 3 },
        spells: ['TAU', 'TAU', 'LIGHT_BULLET'],
      },
      {
        name: 'Omega example',
        wand: { ...defaultWand, deck_capacity: 5 },
        spells: ['GAMMA', 'RESET', 'LIGHT_BULLET', 'OMEGA', 'OMEGA'],
      },
    ],
  },
  {
    name: 'Expert Guide: High Damage Wands with Spells to Power',
    presets: [
      {
        name: 'Spells to Power',
        wand: { ...defaultWand, deck_capacity: 19 },
        spells: [
          'BURST_3',
          'DIVIDE_10',
          'DIVIDE_10',
          'DIVIDE_4',
          'DIVIDE_2',
          'DIVIDE_2',
          'MONEY_MAGIC',
          'DIVIDE_10',
          'RUBBER_BALL',
          'CHAINSAW',
          'BURST_2',
          'DIVIDE_10',
          'DIVIDE_10',
          'DIVIDE_4',
          'DIVIDE_2',
          'DIVIDE_2',
          'SPELLS_TO_POWER',
          'DIVIDE_10',
          'RUBBER_BALL',
        ],
      },
      {
        name: 'Crit',
        wand: { ...defaultWand, deck_capacity: 26 },
        spells: [
          'BURST_3',
          'DIVIDE_10',
          'DIVIDE_10',
          'DIVIDE_4',
          'DIVIDE_2',
          'DIVIDE_2',
          'BLOOD_TO_POWER',
          'DIVIDE_10',
          'RUBBER_BALL',
          'LASER_LUMINOUS_DRILL',
          'BURST_4',
          'HOMING_ROTATE',
          'DIVIDE_10',
          'RUBBER_BALL',
          'DIVIDE_10',
          'DIVIDE_10',
          'DIVIDE_4',
          'DIVIDE_4',
          'SPELLS_TO_POWER',
          'MATERIAL_WATER',
          'DIVIDE_10',
          'DIVIDE_10',
          'DIVIDE_4',
          'DIVIDE_2',
          'DIVIDE_2',
          'HITFX_CRITICAL_WATER',
        ],
      },
      {
        name: 'Velocity Damage 1',
        wand: { ...defaultWand, deck_capacity: 7 },
        spells: [
          'DIVIDE_10',
          'ACCELERATING_SHOT',
          'DIVIDE_2',
          'LIGHT_SHOT',
          'HOMING_ROTATE',
          'BLOOD_TO_POWER',
          'RUBBER_BALL',
        ],
      },
      {
        name: 'Velocity Damage 2',
        wand: { ...defaultWand, deck_capacity: 26 },
        spells: [
          'BURST_3',
          'DIVIDE_10',
          'DIVIDE_10',
          'DIVIDE_4',
          'DIVIDE_4',
          'BLOOD_TO_POWER',
          'DIVIDE_10',
          'RUBBER_BALL',
          'LASER_LUMINOUS_DRILL',
          'BURST_2',
          'DIVIDE_4',
          'ACCELERATING_SHOT',
          'SPEED',
          'HOMING_ROTATE',
          'DIVIDE_10',
          'RUBBER_BALL',
          'DIVIDE_10',
          'DIVIDE_10',
          'DIVIDE_10',
          'SPELLS_TO_POWER',
          'MATERIAL_WATER',
          'DIVIDE_10',
          'DIVIDE_10',
          'DIVIDE_4',
          'DIVIDE_4',
          'HITFX_CRITICAL_WATER',
        ],
      },
    ],
  },
];
