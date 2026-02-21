import styled from 'styled-components';
import type { SpellType } from '../../calc/spellTypes';
import { getSpriteForSpellType } from '../../calc/spellTypes';
import { useSpritePath } from '../../calc/sprite';

export const SpellTypeBorder = styled.div.attrs<{
  spellType?: SpellType;
}>(({ spellType }) => ({
  style: {
    borderImageSource: getSpriteForSpellType(spellType),
    backgroundImage: getSpriteForSpellType(spellType),
    '--data-spelltype-sprite': useSpritePath(getSpriteForSpellType(spellType)),
  },
}))`
  display: block;

  background-size: cover;
  image-rendering: pixelated;
  border-image-width: 0.54em;
  border-image-slice: 3 3;
  border-image-outset: 0.2em;

  position: relative;
  min-width: var(--size-spell);
  width: var(--size-spell);
  height: var(--size-spell);

  background-position: center;
  background-size: 100%;
  background-image: var(--data-spelltype-sprite);
  background-origin: content-box;
  background-repeat: no-repeat;
  font-family: monospace;
  font-weight: bold;
  user-select: none;
  image-rendering: pixelated;
`;
