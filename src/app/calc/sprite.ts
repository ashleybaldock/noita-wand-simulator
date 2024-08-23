import { concat, isNotNullOrUndefined } from '../util';
import type { Sprite as GenSprite } from './__generated__/main/sprites';
import { perkSprites, type Perk, type PerkSprite } from './perks';
import {
  spellSprites,
  type SpellSpriteName,
  type SpellSpritePath,
} from './spellSprite';
import type { SpellTypeSpriteName } from './spellTypes';
import { uiSprites } from './uiSprite';
import type { UiSpriteName, UiSpritePath } from './uiSprite';

/* This one is hard-coded in index.css */
const missingSprite = ['missing', 'var(--sprite-missing)'] as const;
export type MissingSprite = (typeof missingSprite)[0];
export type MissingSpritePath = (typeof missingSprite)[1];

export type SpriteName =
  | SpellSpriteName
  | SpellTypeSpriteName
  | UiSpriteName
  | Perk
  | MissingSprite;
export type SpritePath =
  | UiSpritePath
  | PerkSprite
  | SpellSpritePath
  | MissingSpritePath;

export type Sprite = {
  name: SpriteName;
  path: SpritePath;
};

export type IconUrl =
  | UiSpritePath
  | PerkSprite
  | SpellSpritePath
  | GenSprite
  | MissingSprite;

const spriteMap = new Map<SpriteName, Sprite>(
  concat(uiSprites(), perkSprites(), spellSprites()),
);
export const useIcon = (spriteName: SpriteName | undefined) =>
  (isNotNullOrUndefined(spriteName) && spriteMap.get(spriteName)?.path) ||
  missingSprite[1];
