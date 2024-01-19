import { isBoolean, isNumber, isString } from '../../util';

export type Wand = {
  cast_delay: number;
  mana_max: number;
  mana_charge_speed: number;
  spread: number;
  name: string;
  pic: string;
  speed: number;
  actions_per_round: number;
  shuffle_deck_when_empty: boolean;
  reload_time: number;
  deck_capacity: number;
};

const wandKeysAffectingSimulation: Array<keyof Wand> = [
  'cast_delay',
  'mana_max',
  'mana_charge_speed',
  'spread',
  'speed',
  'actions_per_round',
  'shuffle_deck_when_empty',
  'reload_time',
  'deck_capacity',
] as const;

export const compareWandsForSimulation = (a: Wand, b: Wand): boolean =>
  wandKeysAffectingSimulation.every((key) => a[key] === b[key]);

const wandQueryVersions = [1, 2] as const;
export type WandQueryVersion = (typeof wandQueryVersions)[number];

type WandParamValue = string | number | boolean;
export const isWandParamValue = (x: unknown): x is WandParamValue =>
  isString(x) || isNumber(x) || isBoolean(x);

const v2ParamNames = [
  'd',
  'm',
  'c',
  'q',
  'n',
  'p',
  'v',
  'a',
  'x',
  'r',
  'l',
  's',
  'w',
] as const;
type V2ParamName = (typeof v2ParamNames)[number];
type v2WandStateRecord = Record<keyof Wand, V2ParamName>;

// [ v1param, v2param ]
export const v2WandStateMapping: v2WandStateRecord = {
  cast_delay: 'd',
  mana_max: 'm',
  mana_charge_speed: 'c',
  spread: 'q',
  name: 'n',
  pic: 'p',
  speed: 'v',
  actions_per_round: 'a',
  shuffle_deck_when_empty: 'x',
  reload_time: 'r',
  deck_capacity: 'l',
} as const;
export const v2SpellsMapping = 's' as const;
export const v2AlwaysMapping = 'w' as const;
