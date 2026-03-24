import styled from 'styled-components';
import type { SpellType } from '../../calc/spellTypes';
import { getSpriteForSpellType } from '../../calc/spellTypes';

export const SpellTypeBorder = styled.div.attrs<{
  spellType: SpellType;
}>(({ spellType }) => ({
  style: {
    '--sprite-spelltype': getSpriteForSpellType(spellType).path,
  },
}))`
  display: block;

  background-size: cover;
  image-rendering: pixelated;
  border-image-source: var(--sprite-spelltype);
  border-image-width: 0.54em;
  border-image-slice: 3 3;
  border-image-outset: 0.2em;

  position: relative;
  min-width: var(--size-spell);
  width: var(--size-spell);
  height: var(--size-spell);

  background-position: center;
  background-size: 100%;
  background-image: var(--sprite-spelltype);
  background-origin: content-box;
  background-repeat: no-repeat;
  font-family: monospace;
  font-weight: bold;
  user-select: none;
  image-rendering: pixelated;
`;
