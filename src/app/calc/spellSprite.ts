import * as main from './__generated__/main/spellSprites';
import type { CustomSpellSprite } from './customSpellSprites';
import { customSpellSprites } from './customSpellSprites';
export type SpellSprite = main.SpellSprite | CustomSpellSprite;

export const spellSpriteSet: Set<SpellSprite> = new Set([
  ...main.spellSprites,
  ...customSpellSprites,
]);

export function isValidSpellSprite(s: string): s is SpellSprite {
  return (spellSpriteSet as Set<string>).has(s);
}
