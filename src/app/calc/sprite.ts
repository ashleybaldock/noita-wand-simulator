import { concat, isNotNullOrUndefined, iterOne } from '../util';
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
const missingSprite = {
  name: 'missing',
  path: 'var(--sprite-missing)',
} as const;
export type MissingSprite = (typeof missingSprite)['name'];
export type MissingSpritePath = (typeof missingSprite)['path'];

export type SpriteName =
  | SpellSpriteName
  | SpellTypeSpriteName
  | UiSpriteName
  | Perk
  | MissingSprite
  | 'none';
export type SpritePath =
  | UiSpritePath
  | PerkSprite
  | SpellSpritePath
  | MissingSpritePath
  | '';

export type Sprite = {
  name: SpriteName;
  path: SpritePath;
};

/* Explicitly no sprite, rather than a missing one */
const noSprite: Sprite = { name: 'none', path: '' } as const;

export type IconUrl =
  | UiSpritePath
  | PerkSprite
  | SpellSpritePath
  | GenSprite
  | MissingSprite;

const spriteMap = new Map<SpriteName, Sprite>(
  concat(
    uiSprites(),
    perkSprites(),
    spellSprites(),
    iterOne([noSprite.name, noSprite]),
  ),
);
export const useSprite = (spriteName: SpriteName | undefined): Sprite =>
  (isNotNullOrUndefined(spriteName) && spriteMap.get(spriteName)) ||
  missingSprite;

export const useSpritePath = (spriteName: SpriteName | undefined): SpritePath =>
  (isNotNullOrUndefined(spriteName) && spriteMap.get(spriteName)?.path) ||
  missingSprite.path;
