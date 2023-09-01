import { ActionId } from './actionId';
import { Action } from './action';
import { SpellType } from './spellTypes';

export type Spell = {
  id: ActionId;
  name: string;
  description: string;
  sprite: string;
  // Casting
  action: Action;
  type: SpellType;
  custom_xml_file?: string;
  related_projectiles?: [string, number?];
  related_extra_entities?: string[];
  mana?: number;
  max_uses?: number;
  uses_remaining?: number;
  never_unlimited?: boolean;
  // Info
  beta?: boolean;
  spawn_requires_flag?: string;
  spawn_manual_unlock?: boolean;
  spawn_level?: string;
  spawn_probability?: string;
  sound_loop_tag?: string;
  price: number;
  ai_never_uses?: boolean;
  is_dangerous_blast?: boolean;
  sprite_unidentified?: string;
  // deck properties
  recursive?: boolean;
  iterative?: boolean;
  deck_index?: number;
  custom_uses_logic?: never;
  is_identified?: boolean;
  inventoryitem_id?: number;
  permanently_attached?: boolean;
};

export const validActionCallSources = [
  'projectile',
  'static',
  'material',
  'other',
  'utility',
] as const;

export type ValidActionCallSource = Extract<
  typeof validActionCallSources[number],
  SpellType
>;
