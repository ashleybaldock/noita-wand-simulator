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
  display: block;
  padding: 0.2em;

  background-size: cover;
  image-rendering: pixelated;
  border-image-width: 0.54em;
  border-image-slice: 3 3;
  border-image-outset: 0.2em;

  ::first-letter {
    font-size: 34px;
    color: white;
    border-image-source: url('/data/spelltypes/item_bg_utility.png');
    background-size: cover;
    image-rendering: pixelated;
    border-image-width: 0.54em;
    border-image-slice: 2 2 2 2;
    border-image-outset: 0.2em;
    border-image-width: 0.2em 0.2em 0.2em 0.2em;
  }
`;
