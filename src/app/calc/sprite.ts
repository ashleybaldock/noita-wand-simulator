import type { Sprite as GenSprite } from './__generated__/main/sprites';
import type { PerkSprite } from './perks';
import type { SpellSprite } from './spellSprite';
import type { UiSprite } from './uiSprite';

/* This one is hard-coded in index.css */
export const missingSprite = 'var(--sprite-missing)';

export type Sprite = {
  'url': string;
  'background-image'?: string;
  'content'?: string;
};

export type MissingSprite = typeof missingSprite;

export type IconUrl =
  | MissingSprite
  | SpellSprite
  | PerkSprite
  | GenSprite
  | UiSprite;

export type IconSprite = MissingSprite | SpellSprite | PerkSprite | UiSprite;

export type IconSpriteId = keyof IconSprite[number];
