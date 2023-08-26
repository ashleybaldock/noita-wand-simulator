import { ActionId, Gun, isValidActionId } from './calc';
import { ConfigState } from './redux/configSlice';

export type SpellId = ActionId | string | null;

export function isKnownSpell(spellId: SpellId): spellId is ActionId {
  return spellId !== null && isValidActionId(spellId);
}

export type Wand = Gun & {
  cast_delay: number;
  mana_max: number;
  mana_charge_speed: number;
  spread: number;
  name: string;
  pic: string;
  speed: number;
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

export type WandActionDragItem = {
  actionId?: string;
  sourceWandIndex?: number;
};

export type LocalStorageState = ConfigState;
