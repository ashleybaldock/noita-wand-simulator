import type { ActionId } from './actionId';
import type { Action } from './action';
import type { SpellType } from './spellTypes';
import type { UnlockCondition } from './unlocks';
import type { SpellSpritePath } from './spellSprite';
import type { AlwaysCastWandIndex, MainWandIndex } from '../redux/WandIndex';
import type { ExtraEntity } from './extraEntities';
import type { ProjectileId } from './projectile';
import { useSprite, type Sprite, type SpriteName } from './sprite';
import {objectEntries} from '../util';

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

export type SpellField = keyof Spell;
export type SpellFieldInfo = <T extends typeof Spell[SpellField]>{
  readonly name: string;
  readonly renderValue: (v: T) => string;
  readonly tip?: string;
  readonly icon?: SpriteName;
  readonly group?: string;
  readonly customYes?: string;
  readonly customNo?: string;
};

export const spellFieldInfoDefinition: Partial<
  Record<SpellField, SpellFieldInfo>
> = {
  name: { name: 'Name' },
  description: { name: 'Description' },
  sprite: { name: 'Sprite' },
  action: { name: 'Action' },
  type: { name: 'Type' },
  custom_xml_file: { name: 'Custom XML File', icon: 'icon.xmlfile' },
  related_projectiles: { name: 'Related Projectiles' },
  related_extra_entities: { name: 'Related Extra Entities' },
  mana: { name: 'Mana Cost', icon: 'icon.manadrain' },
  max_uses: { name: 'Max Charges', icon: 'icon.maxuse' },
  uses_remaining: { name: 'Charges Remaining', icon: 'icon.remaininguses' },
  never_unlimited: {
    name: 'Not Affected by Unlimited Spells',
    icon: 'icon.neverunlimited',
  },
  recursive: { name: 'Recursive', icon: 'icon.recursion' },
  iterative: { name: 'Iterative', icon: 'icon.iteration' },
  spawn_requires_flag: { name: 'Unlock Condition', icon: 'icon.unlock' },
  spawn_level: { name: 'Spell Tier' },
  spawn_probability: { name: 'Spawn Probability' },
  price: { name: 'Base Cost' },
  ai_never_uses: { name: 'AI Never Uses' },
} as const;

export type SpellFieldInfoRecord = Record<SpellField, SpellFieldInfo>;

const spellFieldInfoRecord = spellFieldInfoDefinition as SpellFieldInfoRecord;

export const spellFieldInfoMap = new Map<SpellField, SpellFieldInfo>([
  ...objectEntries(spellFieldInfoRecord),
]);

export const getInfoForSpellField = (field: SpellField) => spellFieldInfoMap.get(field);
