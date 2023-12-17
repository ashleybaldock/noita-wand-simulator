import { SpellId } from './spellId';
import { Wand } from './wand';

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

export function isSinglePreset(p: Preset | PresetGroup): p is Preset {
  return p.hasOwnProperty('spells');
}

export function isPresetGroup(p: Preset | PresetGroup): p is PresetGroup {
  return p.hasOwnProperty('presets');
}
