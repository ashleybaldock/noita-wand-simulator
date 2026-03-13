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

/* Explicitly no sprite, rather than a missing one */
const noSprite = { name: 'none', path: 'linear-gradient(#0000 0 0)' } as const;
export type NoSprite = (typeof noSprite)['name'];
export type NoSpritePath = (typeof noSprite)['path'];

export type SpriteName =
  | SpellSpriteName
  | SpellTypeSpriteName
  | UiSpriteName
  | Perk
  | MissingSprite
  | NoSprite;
export type SpritePath =
  | UiSpritePath
  | PerkSprite
  | SpellSpritePath
  | MissingSpritePath
  | NoSpritePath;

export type Sprite = {
  name: SpriteName;
  path: SpritePath;
};

export type IconUrl =
  | UiSpritePath
  | PerkSprite
  | SpellSpritePath
  | GenSprite
  | MissingSprite
  | NoSpritePath;

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
  useSprite(spriteName).path;
