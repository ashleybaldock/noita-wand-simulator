import * as main from './__generated__/main/spellSprites';
import type {
  CustomSpellSpriteName,
  CustomSpellSpritePath,
} from './customSpellSprites';
import { customSpellSprites } from './customSpellSprites';
import type { Sprite, SpriteName } from './sprite';
export type SpellSpriteName = main.SpellSpriteName | CustomSpellSpriteName;
export type SpellSpritePath = main.SpellSpritePath | CustomSpellSpritePath;

export const spellSpriteMap: Map<SpellSpriteName, SpellSpritePath> = new Map([
  ...main.spellSprites,
  ...customSpellSprites,
]);

export function isValidSpellSpriteName(s: string): s is SpellSpriteName {
  return (spellSpriteMap as Map<string, SpellSpritePath>).has(s);
}

export function* spellSprites(): IterableIterator<
  readonly [SpriteName, Sprite]
> {
  for (const [spriteName, spritePath] of spellSpriteMap.entries()) {
    yield [spriteName, { name: spriteName, path: spritePath }];
  }
}
