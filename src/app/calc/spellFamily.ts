import { invertMap, invertOneToManyMap, objectEntries } from '../util';
import type { ActionId } from './actionId';

const SpellFamilyInfoMapDefinition = {
  addtrigger: ['ADD_TRIGGER', 'ADD_TIMER', 'ADD_DEATH_TRIGGER'],
  greek: ['ALPHA', 'GAMMA', 'TAU', 'OMEGA', 'MU', 'PHI', 'SIGMA', 'ZETA'],
  divideby: ['DIVIDE_2', 'DIVIDE_3', 'DIVIDE_4', 'DIVIDE_10'],
  random: ['RANDOM_SPELL', 'DRAW_RANDOM', 'DRAW_RANDOM_X3', 'DRAW_3_RANDOM'],
  kantele: ['KANTELE_A', 'KANTELE_D', 'KANTELE_DIS', 'KANTELE_E', 'KANTELE_G]'],
  ocarina: [
    'OCARINA_A',
    'OCARINA_B',
    'OCARINA_C',
    'OCARINA_D',
    'OCARINA_E',
    'OCARINA_F',
    'OCARINA_GSHARP',
    'OCARINA_A2',
  ],
  spark: [
    'LIGHT_BULLET',
    'LIGHT_BULLET_TRIGGER',
    'LIGHT_BULLET_TRIGGER_2',
    'LIGHT_BULLET_TIMER',
  ],
  bombs: [
    'TNTBOX',
    'TNTBOX_BIG',
    'NUKE',
    'NUKE_GIGA',
    'DYNAMITE',
    'GLITTER_BOMB',
    'MISSILE',
    'BOMB_HOLY',
    'BOMB_HOLY_GIGA',
    'PROPANE_TANK',
    'BOMB_CART',
    'MINE_DEATH_TRIGGER',
    'PIPE_BOMB',
    'PIPE_BOMB_DEATH_TRIGGER',
    'MINE',
    'BOMB',
  ],
  plasma: ['LASER_EMITTER', 'LASER_EMITTER_FOUR', 'LASER_EMITTER_CUTTER'],
  tele: [
    'TELEPORT_PROJECTILE',
    'TELEPORT_PROJECTILE_SHORT',
    'TELEPORT_PROJECTILE_STATIC',
    'SWAPPER_PROJECTILE',
    'TELEPORT_PROJECTILE_CLOSER',
    'HOOK',
  ],
  saws: ['DISC_BULLET', 'DISC_BULLET_BIG', 'DISC_BULLET_BIGGER'],
  heal: ['HEAL_BULLET', 'ANTIHEAL'],
  spitter: [
    'SPITTER',
    'SPITTER_TIMER',
    'SPITTER_TIER_2',
    'SPITTER_TIER_2_TIMER',
    'SPITTER_TIER_3',
    'SPITTER_TIER_3_TIMER',
  ],
  hole: ['BLACK_HOLE', 'BLACK_HOLE_DEATH_TRIGGER', 'WHITE_HOLE'],
  arrows: [
    'ARROW',
    'LANCE',
    'LANCE_HOLY',
    'BULLET',
    'BULLET_TRIGGER',
    'BULLET_TIMER',
  ],
  mist: ['MIST_RADIOACTIVE', 'MIST_ALCOHOL', 'MIST_SLIME', 'MIST_BLOOD'],
  nature: ['FISH', 'EXPLODING_DEER', 'EXPLODING_DUCKS', 'WORM_SHOT', 'PEBBLE'],
  magicmissle: ['ROCKET', 'ROCKET_TIER_2', 'ROCKET_TIER_3'],
  firebolt: [
    'GRENADE',
    'GRENADE_TRIGGER',
    'GRENADE_TIER_2',
    'GRENADE_TIER_3',
    'GRENADE_ANTI',
  ],
  physics: [
    'CRUMBLING_EARTH',
    'SUMMON_ROCK',
    'SUMMON_EGG',
    'SUMMON_HOLLOW_EGG',
    'TNTBOX',
    'TNTBOX_BIG',
    'GLUE_SHOT',
    'TENTACLE',
    'TENTACLE_TIMER',
  ],
  lightning: ['LIGHTNING', 'BALL_LIGHTNING', 'THUNDERBALL'],
  lumi: ['LUMINOUS_DRILL', 'LASER_LUMINOUS_DRILL'],
  fire: ['FIREBOMB', 'FIREBALL', 'METEOR', 'FLAMETHROWER'],

  field: [
    'CHAOS_POLYMORPH_FIELD',
    'ELECTROCUTION_FIELD',
    'FREEZE_FIELD',
    'REGENERATION_FIELD',
    'TELEPORTATION_FIELD',
    'LEVITATION_FIELD',
    'SHIELD_FIELD',
    'BERSERK_FIELD',
    'POLYMORPH_FIELD',
  ],
  vacuum: ['VACUUM_POWDER', 'VACUUM_LIQUID'],
  projfield: [
    'PROJECTILE_TRANSMUTATION_FIELD',
    'PROJECTILE_THUNDER_FIELD',
    'PROJECTILE_GRAVITY_FIELD',
  ],
  cloud: [
    'CLOUD_WATER',
    'CLOUD_OIL',
    'CLOUD_BLOOD',
    'CLOUD_ACID',
    'CLOUD_THUNDER',
  ],
  sade: ['METEOR_RAIN', 'WORM_RAIN'],
  explosion: [
    'EXPLOSION',
    'EXPLOSION_LIGHT',
    'FIRE_BLAST',
    'POISON_BLAST',
    'ALCOHOL_BLAST',
    'THUNDER_BLAST',
  ],
  summon: ['SWARM_FLY', 'SWARM_FIREBUG', 'SWARM_WASP', 'FRIEND_FLY'],
  barrier: ['WALL_HORIZONTAL', 'WALL_VERTICAL', 'WALL_SQUARE'],
  bighole: [
    'BLACK_HOLE_BIG',
    'BLACK_HOLE_GIGA',
    'WHITE_HOLE_BIG',
    'WHITE_HOLE_GIGA',
  ],

  tuple: [],
  scatter: [],
  formation: [],

  sea: [
    'SEA_ACID_GAS',
    'SEA_MIMIC',
    'SEA_LAVA',
    'SEA_ALCOHOL',
    'SEA_OIL',
    'SEA_WATER',
    'SEA_SWAMP',
    'SEA_ACID',
  ],
  circle: ['CIRCLE_FIRE', 'CIRCLE_ACID', 'CIRCLE_OIL', 'CIRCLE_WATER'],
  touch: [
    'TOUCH_GOLD',
    'TOUCH_WATER',
    'TOUCH_OIL',
    'TOUCH_ALCOHOL',
    'TOUCH_PISS',
    'TOUCH_GRASS',
    'TOUCH_BLOOD',
    'TOUCH_SMOKE',
  ],
  drop: [
    'MATERIAL_WATER',
    'MATERIAL_OIL',
    'MATERIAL_BLOOD',
    'MATERIAL_ACID',
    'MATERIAL_CEMENT',
  ],

  plicate: [
    'I_SHOT',
    'Y_SHOT',
    'T_SHOT',
    'W_SHOT',
    'QUAD_SHOT',
    'PENTA_SHOT',
    'HEXA_SHOT',
  ],
  topower: ['MONEY_MAGIC', 'BLOOD_TO_POWER'],
  platform: ['TEMPORARY_WALL', 'TEMPORARY_PLATFORM'],
  cast: [
    'LONG_DISTANCE_CAST',
    'TELEPORT_CAST',
    'SUPER_TELEPORT_CAST',
    'CASTER_CAST',
  ],
  spellsto: [
    'ALL_NUKES',
    'ALL_DISCS',
    'ALL_ROCKETS',
    'ALL_DEATHCROSSES',
    'ALL_BLACKHOLES',
    'ALL_ACID',
  ],

  trail: [
    'RAINBOW_TRAIL',
    'ACID_TRAIL',
    'POISON_TRAIL',
    'OIL_TRAIL',
    'WATER_TRAIL',
    'GUNPOWDER_TRAIL',
    'FIRE_TRAIL',
    'BURN_TRAIL',
  ],

  orbit: [
    'ORBIT_DISCS',
    'ORBIT_FIREBALLS',
    'ORBIT_NUKES',
    'ORBIT_LASERS',
    'ORBIT_LARPA',
  ],

  larpa: [
    'LARPA_CHAOS',
    'LARPA_DOWNWARDS',
    'LARPA_UPWARDS',
    'LARPA_CHAOS_2',
    'LARPA_DEATH',
    'CHAIN_SHOT',
  ],

  glimmer: [
    'COLOUR_RED',
    'COLOUR_ORANGE',
    'COLOUR_GREEN',
    'COLOUR_YELLOW',
    'COLOUR_PURPLE',
    'COLOUR_BLUE',
    'COLOUR_RAINBOW',
    'COLOUR_INVIS',
  ],

  thrower: [
    'TENTACLE_RAY',
    'LASER_EMITTER_RAY',
    'FIREBALL_RAY_LINE',
    'FIREBALL_RAY',
    'LIGHTNING_RAY',
  ],

  personal: [
    'FIREBALL_RAY_ENEMY',
    'LIGHTNING_RAY_ENEMY',
    'TENTACLE_RAY_ENEMY',
    'GRAVITY_FIELD_ENEMY',
  ],

  curse: [
    'CURSE',
    'CURSE_WITHER_PROJECTILE',
    'CURSE_WITHER_EXPLOSION',
    'CURSE_WITHER_MELEE',
    'CURSE_WITHER_ELECTRICITY',
  ],

  arc: ['ARC_ELECTRIC', 'ARC_FIRE', 'ARC_GUNPOWDER', 'ARC_POISON'],

  crit: [
    'HITFX_BURNING_CRITICAL_HIT',
    'HITFX_CRITICAL_WATER',
    'HITFX_CRITICAL_OIL',
    'HITFX_CRITICAL_BLOOD',
    'CRITICAL_HIT',
  ],

  hitfx: [
    'HITFX_EXPLOSION_SLIME',
    'HITFX_EXPLOSION_SLIME_GIGA',
    'HITFX_EXPLOSION_ALCOHOL',
    'HITFX_EXPLOSION_ALCOHOL_GIGA',
  ],

  bundle: ['ROCKET_DOWNWARDS', 'ROCKET_OCTAGON'],

  bounce: [
    'BOUNCE',
    'REMOVE_BOUNCE',
    'BOUNCE_HOLE',
    'BOUNCE_SMALL_EXPLOSION',
    'BOUNCE_EXPLOSION',
    'BOUNCE_SPARK',
    'BOUNCE_LASER',
    'BOUNCE_LASER_EMITTER',
    'BOUNCE_LARPA',
    'BOUNCE_LIGHTNING',
  ],

  topowermod: ['ESSENCE_TO_POWER', 'SPELLS_TO_POWER'],

  shot: [
    'ZERO_DAMAGE',
    'HEAVY_SHOT',
    'LIGHT_SHOT',
    'SPEED',
    'ACCELERATING_SHOT',
    'DECELERATING_SHOT',
  ],

  transmod: [
    'WATER_TO_POISON',
    'BLOOD_TO_ACID',
    'LAVA_TO_BLOOD',
    'LIQUID_TO_EXPLOSION',
    'TOXIC_TO_ACID',
    'STATIC_TO_SAND',
    'TRANSMUTATION',
  ],

  dmgtype: ['ELECTRIC_CHARGE', 'FREEZE'],

  pathmod: [
    'HEAVY_SPREAD',
    'MATTER_EATER',
    'CLIPPING_SHOT',
    'AVOIDING_ARC',
    'FLOATING_ARC',
    'SPIRALING_SHOT',
    'ORBIT_SHOT',
    'PINGPONG_PATH',
    'SINEWAVE',
    'CHAOTIC_ARC',
    'FLY_DOWNWARDS',
    'FLY_UPWARDS',
    'HORIZONTAL_ARC',
    'LINE_ARC',
  ],

  gravity: ['GRAVITY', 'GRAVITY_ANTI'],

  warpmod: ['PHASING_ARC', 'TRUE_ORBIT'],

  friendly: ['BLOODLUST', 'PIERCING_SHOT'],

  homing: [
    'HOMING',
    'ANTI_HOMING',
    'HOMING_WAND',
    'HOMING_SHORT',
    'HOMING_ROTATE',
    'HOMING_SHOOTER',
    'AUTOAIM',
    'HOMING_ACCELERATING',
    'HOMING_CURSOR',
    'HOMING_AREA',
  ],

  lifetime: ['LIFETIME', 'LIFETIME_DOWN', 'NOLLA', 'SLOW_BUT_STEADY'],

  explodemod: [
    'EXPLOSION_REMOVE',
    'EXPLOSION_TINY',
    'EXPLOSIVE_PROJECTILE',
    'CLUSTERMOD',
  ],
} as const;

export type SpellFamily = keyof typeof SpellFamilyInfoMapDefinition;

export type SpellFamilyInfo =
  (typeof SpellFamilyInfoMapDefinition)[SpellFamily];

export type SpellFamilyInfoRecord = Record<SpellFamily, readonly ActionId[]>;

const spellFamilyInfoRecord =
  SpellFamilyInfoMapDefinition as SpellFamilyInfoRecord;

const spellFamilyInfoMap = new Map([...objectEntries(spellFamilyInfoRecord)]);

const inverseSpellFamilyInfoMap = invertOneToManyMap(spellFamilyInfoMap);

export const getSpellFamilyForActionId = (id: ActionId) =>
  inverseSpellFamilyInfoMap.get(id);
