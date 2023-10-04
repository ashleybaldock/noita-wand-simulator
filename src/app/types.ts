import { isBoolean, isNumber, isString } from 'lodash';
import { ActionId, isValidActionId } from './calc/actionId';

export type SpellId = ActionId | string | null;

export function isKnownSpell(spellId: SpellId): spellId is ActionId {
  return spellId !== null && isValidActionId(spellId);
}

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

const wandQueryVersions = [1, 2] as const;
export type WandQueryVersion = typeof wandQueryVersions[number];

export type WandParamValue = string | number | boolean;
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
export type V2ParamName = typeof v2ParamNames[number];
export type V2ParamInfo = {
  name: V2ParamName;
  defaultValue: WandParamValue;
};
export type v2WandStateRecord = Record<keyof Wand, V2ParamInfo>;
// [ v1param, v2param, defaultValue ]
export const v2WandStateMapping: v2WandStateRecord = {
  cast_delay: { name: 'd', defaultValue: 0.5 },
  mana_max: { name: 'm', defaultValue: 20000 },
  mana_charge_speed: { name: 'c', defaultValue: 20000 },
  spread: { name: 'q', defaultValue: -2 },
  name: { name: 'n', defaultValue: '' },
  pic: { name: 'p', defaultValue: '' },
  speed: { name: 'v', defaultValue: 1.2 },
  actions_per_round: { name: 'a', defaultValue: 1 },
  shuffle_deck_when_empty: { name: 'x', defaultValue: false },
  reload_time: { name: 'r', defaultValue: 1.0 },
  deck_capacity: { name: 'l', defaultValue: 12 },
} as const;
export const v2SpellsMapping = 's' as const;
export const v2AlwaysMapping = 'w' as const;

export type WandState = {
  wand: Wand;
  spellIds: SpellId[];
  alwaysIds: SpellId[];
  messages: string[];
  fromQuery?: WandQueryVersion;
};

export type Preset = {
  name: string;
  wand: Wand;
  spells: SpellId[];
  always: SpellId[];
};

export type PresetGroup = {
  name: string;
  presets: (Preset | PresetGroup)[];
};

export type WandActionDragItem = {
  actionId?: string;
  sourceWandIndex?: number;
};

export type SpellEditMode = 'overwrite' | 'swap' | 'before' | 'after';
