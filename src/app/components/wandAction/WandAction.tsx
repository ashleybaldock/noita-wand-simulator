import styled from 'styled-components/macro';
import { Spell } from '../../calc/spell';
import { spellTypeInfoMap } from '../../calc/spellTypes';

type Props = {
  onDeleteSpell?: () => void;
  spell?: Readonly<Spell>;
  className?: string;
};

function _WandAction(props: Props) {
  const { spell, className } = props;
  // const [mouseOver, setMouseOver] = useState(false);

  const actionToBackgroundImage = (spell?: Spell) => {
    if (!spell) {
      return '';
    }
    const typeImgUrl = spellTypeInfoMap[spell.type]?.src ?? '';
    return `url("/${spell.sprite}"), ${typeImgUrl && `url("/${typeImgUrl}")`}`;
  };

  const style = { backgroundImage: actionToBackgroundImage(spell) };

  return (
    <div
      className={className}
      style={style}
      // onMouseEnter={() => setMouseOver(true)}
      // onMouseLeave={() => setMouseOver(false)}
    />
  );
}

export const WandAction = styled(_WandAction)`
  position: relative;
  min-width: var(--sizes-spell-base);
  width: var(--sizes-spell-base);
  height: var(--sizes-spell-base);
  background-size: cover;
  font-family: monospace;
  font-weight: bold;
  user-select: none;
  image-rendering: pixelated;
  transform-origin: center;
  transition: transform var(--transition-hover-out);

  &:hover {
    transform: scale(109%);
    transition: transform var(--transition-hover-in);
    cursor: move;
  }
`;
