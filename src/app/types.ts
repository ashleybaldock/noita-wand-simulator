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
export type v2WandStateRecord = Record<keyof Wand, V2ParamName>;

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

export type SpellShiftDirection = 'left' | 'right' | 'none';
export type SpellEditMode = 'overwrite' | 'swap' | 'before' | 'after';
export type SelectionIndex = 'cursor' | number;

export type WandEditorState = {
  cursorIndex: number;
  selectFrom: number | null;
  selectTo: number | null;
};

export type WandSelection = 'none' | 'start' | 'thru' | 'end' | 'single';

export type CursorPosition = 'none' | 'before' | 'after';
export type CursorStyle = 'none' | 'insert';
export type Cursor = {
  position: CursorPosition;
  style: CursorStyle;
};

export type WandState = {
  wand: Wand;
  spellIds: SpellId[];
  alwaysIds: SpellId[];
  messages: string[];
  editor: WandEditorState;
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

export interface DragItemSelect {
  disc: 'select';
  dragStartIndex: number;
}
export const isDragItemSelect = (x: DragItem): x is DragItemSelect =>
  x.disc === 'select';

export interface DragItemSpell {
  disc: 'spell';
  actionId: ActionId;
  sourceWandIndex?: number;
}
export const isDragItemSpell = (x: DragItem): x is DragItemSpell =>
  x.disc === 'spell';

export type DragItem = DragItemSpell | DragItemSelect;
