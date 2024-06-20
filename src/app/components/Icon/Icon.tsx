import styled from 'styled-components';
import type { Perk } from '../../calc/perks';
import { getSpriteForPerk } from '../../calc/perks';
import type { IconUrl} from '../../calc/sprite';
import { missingSprite } from '../../calc/sprite';

export const Icon = styled.span.attrs<{
  $src?: IconUrl;
}>(({ $src = missingSprite }) => ({
  style: {
    backgroundImage: $src,
  },
}))``;

export const InlineIcon = styled(Icon).attrs<{
  $perk?: Perk;
}>(({ $perk }) => ({
  $src: getSpriteForPerk($perk),
}))`
  display: inline-block;
  background-position: center center;
  background-repeat: no-repeat;
  background-size: 1em;
  image-rendering: pixelated;
  width: 1em;
  height: 1em;
`;
