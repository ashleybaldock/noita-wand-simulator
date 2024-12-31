import type { ActionId } from './actionId';
import type { Action } from './action';
import type { SpellType } from './spellTypes';
import type { UnlockCondition } from './unlocks';
import type { SpellSpritePath } from './spellSprite';
import type { AlwaysCastWandIndex, MainWandIndex } from '../redux/WandIndex';
import type { ExtraEntity } from './extraEntities';
import type { ProjectileId } from './projectile';

export type SpellDeckInfo = {
  id: ActionId;
  deck_index?: MainWandIndex;
  /* Always Cast */
  permanently_attached?: boolean;
  always_cast_index?: AlwaysCastWandIndex;
};

export type SpellExtraInfo = {
  id: ActionId;
  beta?: boolean;
};

export type SpellProperties = {
  id: ActionId;
  name: string;
  description: string;
  sprite: SpellSpritePath;
  // Casting
  action: Action;
  type: SpellType;
  custom_xml_file?: string;
  related_projectiles?: [ProjectileId, number?];
  related_extra_entities?: ExtraEntity[];
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
