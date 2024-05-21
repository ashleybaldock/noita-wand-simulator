import type { ActionId } from './actionId';
import type { Action } from './action';
import type { SpellType } from './spellTypes';
import type { UnlockCondition } from './unlocks';
import type { SpellSprite } from './spellSprite';

export type SpellDeckInfo = {
  id: ActionId;
  deck_index?: number;
  /* Always Cast */
  permanently_attached?: boolean;
};

export type SpellExtraInfo = {
  id: ActionId;
  beta?: boolean;
};

export type SpellProperties = {
  id: ActionId;
  name: string;
  description: string;
  sprite: SpellSprite;
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
  recursive?: boolean;
  iterative?: boolean;
  // Info
  spawn_requires_flag?: UnlockCondition;
  spawn_level?: string;
  spawn_probability?: string;
  price: number;
  ai_never_uses?: boolean;
};

export type SpellUnusedProperties = {
  id: ActionId;
  /* unused? */ spawn_manual_unlock?: boolean;
  /* unused? */ is_dangerous_blast?: boolean;
  /* unused? */ sprite_unidentified?: string;
  /* unused */ custom_uses_logic?: never;
  /* unused */ is_identified?: boolean;
  sound_loop_tag?: string;
  inventoryitem_id?: number;
};

export type Spell = SpellDeckInfo &
  SpellExtraInfo &
  SpellProperties &
  SpellUnusedProperties;
