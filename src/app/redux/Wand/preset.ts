import type { SpellId } from './spellId';
import type { Wand } from './wand';

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
  return Object.prototype.hasOwnProperty.call(p, 'spells');
}

export function isPresetGroup(p: Preset | PresetGroup): p is PresetGroup {
  return Object.prototype.hasOwnProperty.call(p, 'presets');
}
