import styled from 'styled-components/macro';
import { ActionCall, GroupedProjectile } from '../../calc/eval/types';
import { Spell } from '../../calc/spell';
import { spellTypeInfoMap } from '../../calc/spellTypes';

const ImageBackgroundDiv = styled.div`
  position: relative;
  min-width: var(--sizes-spell-base);
  width: var(--sizes-spell-base);
  height: var(--sizes-spell-base);
  background-size: cover;
  font-family: monospace;
  font-weight: bold;
  user-select: none;
  image-rendering: pixelated;

  &:hover {
    transform-origin: center;
    transform: scale(109%);
    transition: transform var(--anim-basic-in);
    cursor: move;
  }
`;

type Props = {
  onDeleteSpell?: () => void;
  spell?: Readonly<Spell>;
} & Partial<ActionCall> &
  Partial<GroupedProjectile>;

export function WandAction(props: Props) {
  const { spell } = props;
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
    <ImageBackgroundDiv
      style={style}
      // onMouseEnter={() => setMouseOver(true)}
      // onMouseLeave={() => setMouseOver(false)}
    />
  );
}
