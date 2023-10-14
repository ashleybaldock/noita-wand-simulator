import styled from 'styled-components/macro';
import { getBackgroundUrlForSpellType, SpellType } from '../../calc/spellTypes';

type SpellTypeBorderProps = {
  spellType?: SpellType;
};

export const SpellTypeBorder = styled.div.attrs(
  ({ spellType }: SpellTypeBorderProps) => ({
    style: {
      borderImageSource: getBackgroundUrlForSpellType(spellType),
    },
  }),
)<SpellTypeBorderProps>`
  display: flex;
  flex-direction: row;
  padding: 0.2em;

  height: auto;
  width: auto;

  background-size: cover;
  image-rendering: pixelated;
  border-image-width: 0.54em;
  border-image-slice: 3 3;
  border-image-outset: 0.2em;
`;
