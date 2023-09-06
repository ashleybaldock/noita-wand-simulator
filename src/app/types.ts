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

export type WandState = {
  wand: Wand;
  spellIds: SpellId[];
  messages: string[];
};

export type Preset = {
  name: string;
  wand: Wand;
  spells: SpellId[];
};

export type PresetGroup = {
  name: string;
  presets: (Preset | PresetGroup)[];
};

export function isSinglePreset(p: Preset | PresetGroup): p is Preset {
  return p.hasOwnProperty('spells');
}

export function isPresetGroup(p: Preset | PresetGroup): p is PresetGroup {
  return p.hasOwnProperty('presets');
}

export type WandActionDragItem = {
  actionId?: string;
  sourceWandIndex?: number;
};
