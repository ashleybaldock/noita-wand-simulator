import type { ActionId } from './actionId';
import type { Action } from './action';
import type { SpellType } from './spellTypes';
import { getUnlockName, type UnlockCondition } from './unlocks';
import type { SpellSpritePath } from './spellSprite';
import type { AlwaysCastWandIndex, MainWandIndex } from '../redux/WandIndex';
import type { ExtraEntity } from './extraEntities';
import type { ProjectileId } from './projectile';
import type { SpriteName } from './sprite';
import { isNotUndefined, isObject, isUndefined } from '../util';

export type SpellDeckInfo = {
  id: ActionId;
  deck_index?: MainWandIndex;
  permanently_attached?: boolean;
  always_cast_index?: AlwaysCastWandIndex;
};

export type SpellExtraInfo = {
  id: ActionId;
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

export type FieldInfo<T extends object> = {
  readonly name: string;
  readonly tip?: string;
  readonly icon?: SpriteName;
  readonly render?: (thing: T) => string;
  readonly group?: string;
  readonly customYes?: string;
  readonly customNo?: string;
};
type InfoFor<T extends object> = {
  +readonly [Property in keyof T]-?: FieldInfo<T>;
};

export const spellFieldInfo: InfoFor<Spell> = {
  id: { name: 'Id' },
  name: { name: 'Name' },
  description: { name: 'Description' },
  sprite: { name: 'Sprite' },
  action: { name: 'Action' },
  type: { name: 'Type' },
  custom_xml_file: { name: 'Custom XML File', icon: 'icon.xmlfile' },
  related_projectiles: {
    name: 'Related Projectiles',
    render: ({ related_projectiles }) =>
      isNotUndefined(related_projectiles)
        ? [related_projectiles]
            .map(
              ([projectile, count = 1]) =>
                `${projectile.match(/[^/]*\.xml/)?.[0] ?? projectile} ×${count}`,
            )
            .join(', ')
        : '',
  },
  related_extra_entities: {
    name: 'Related Extra Entities',
    render: ({ related_extra_entities }) =>
      isNotUndefined(related_extra_entities)
        ? related_extra_entities
            .map((entity) => entity.match(/[^/]*\.xml/)?.[0] ?? entity)
            .join(', ')
        : '',
  },
  mana: { name: 'Mana Cost', icon: 'icon.manadrain' },
  max_uses: {
    name: 'Max. Uses',
    icon: 'icon.maxuse',
    render: ({ max_uses }) =>
      isUndefined(max_uses) ? 'Unlimited' : `${max_uses}`,
  },
  uses_remaining: { name: 'Charges Remaining', icon: 'icon.remaininguses' },
  never_unlimited: {
    name: 'Not Affected by Unlimited Spells',
    icon: 'icon.neverunlimited',
  },
  recursive: { name: 'Recursive', icon: 'icon.recursion' },
  iterative: { name: 'Iterative', icon: 'icon.iteration' },
  spawn_requires_flag: {
    name: 'Unlock Condition',
    icon: 'icon.unlock',
    render: ({ spawn_requires_flag }) =>
      isUndefined(spawn_requires_flag)
        ? 'No'
        : `${getUnlockName(spawn_requires_flag)}`,
  },
  spawn_level: { name: 'Spell Tier' },
  spawn_probability: { name: 'Spawn Probability' },
  price: { name: 'Base Cost' },
  ai_never_uses: { name: 'AI Never Uses' },
  deck_index: { name: 'Deck Index' },
  permanently_attached: { name: 'Always Cast' },
  always_cast_index: { name: 'Always Cast Index' },

  spawn_manual_unlock: { name: '' },
  is_dangerous_blast: { name: '' },
  sprite_unidentified: { name: '' },
  custom_uses_logic: { name: '' },
  is_identified: { name: '' },
  sound_loop_tag: { name: '' },
  inventoryitem_id: { name: '' },
} as const;

export const getInfoForSpellField = (field: keyof Spell) => ({
  render: (spell: Spell) =>
    isObject(spell[field]) ? JSON.stringify(spell[field]) : `${spell[field]}`,
  ...spellFieldInfo[field],
});
