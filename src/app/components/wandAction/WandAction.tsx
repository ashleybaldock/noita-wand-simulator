import styled from 'styled-components/macro';
import { SpellType, getBackgroundUrlForSpellType } from '../../calc/spellTypes';

type Props = {
  onDeleteSpell?: () => void;
  className?: string;
  spellType?: SpellType;
  spellSprite?: string;
  keyHint?: string;
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

  --size-spell: var(--bsize-spell, 1em);

  position: relative;
  min-width: var(--size-spell);
  width: var(--size-spell);
  height: var(--size-spell);

  background-size: cover;
  font-family: monospace;
  font-weight: bold;
  user-select: none;
  image-rendering: pixelated;
  transform-origin: center;

  transition-duration: 150ms;
  transition-property: var(--transition-props);
  transition-timing-function: var(--transition-out, ease-out);
  cursor: grab;

  &:hover {
    transform: scale(109%);

    transition-timing-function: var(--transition-out, ease-out);
    transition-property: var(--transition-props);
  }

  &:active {
    cursor: grabbing;
    border: 1px solid red;
  }
`;
