import { ActionId } from './actionId';
import { Action } from './action';
import { SpellType } from './spellTypes';
import { UnlockCondition } from './unlocks';

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
  // deck properties
  recursive?: boolean;
  iterative?: boolean;
  deck_index?: number;
  permanently_attached?: boolean /* Always Cast */;
  // Info
  beta?: boolean;
  spawn_requires_flag?: UnlockCondition;
  spawn_level?: string;
  spawn_probability?: string;
  price: number;
  ai_never_uses?: boolean;
  /* unused? */ spawn_manual_unlock?: boolean;
  /* unused? */ is_dangerous_blast?: boolean;
  /* unused? */ sprite_unidentified?: string;
  /* unused */ custom_uses_logic?: never;
  /* unused */ is_identified?: boolean;
  sound_loop_tag?: string;
  inventoryitem_id?: number;
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
