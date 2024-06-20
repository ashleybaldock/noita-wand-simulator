import { isNotNullOrUndefined } from '../util';
import { missingSprite } from './sprite';

export const uiSprites = {
  'icon.copy': 'var(--icon-copy)',
} as const;

export type UiSprite = keyof typeof uiSprites;

export const unknownUiSprite = '/data/ui_gfx/perk_icons/unknown_perk.png';

export const getUiSvgSprite = (sprite?: UiSprite) =>
  isNotNullOrUndefined(sprite) ? uiSprites[sprite] : missingSprite;
