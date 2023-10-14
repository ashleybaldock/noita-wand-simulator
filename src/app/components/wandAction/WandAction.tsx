import styled from 'styled-components/macro';
import { SpellType, getBackgroundUrlForSpellType } from '../../calc/spellTypes';

type Props = {
  onDeleteSpell?: () => void;
  className?: string;
  spellType?: SpellType;
  spellSprite?: string;
};

function _WandAction({ spellType, spellSprite, className }: Props) {
  // const [mouseOver, setMouseOver] = useState(false);

  return (
    <div
      className={className}
      style={{
        backgroundImage: `url('/${spellSprite}'), ${getBackgroundUrlForSpellType(
          spellType,
        )}`,
      }}
      // onMouseEnter={() => setMouseOver(true)}
      // onMouseLeave={() => setMouseOver(false)}
    />
  );
}

export const WandAction = styled(_WandAction)`
  --transition-in: var(--transition-hover-in);
  --transition-out: var(--transition-hover-out);
  --transition-props: transform;

  position: relative;
  min-width: var(--sizes-spell, var(--sizes-spell-base, 1em));
  width: var(--sizes-spell, var(--sizes-spell-base, 1em));
  height: var(--sizes-spell, var(--sizes-spell-base, 1em));
  background-size: cover;
  font-family: monospace;
  font-weight: bold;
  user-select: none;
  image-rendering: pixelated;
  transform-origin: center;

  transition-duration: 150ms;
  transition-property: var(--transition-props);
  transition-timing-function: var(--transition-out, ease-out);

  &:hover {
    transform: scale(109%);

    transition-timing-function: var(--transition-out, ease-out);
    transition-property: var(--transition-props);
    cursor: move;
  }
`;
