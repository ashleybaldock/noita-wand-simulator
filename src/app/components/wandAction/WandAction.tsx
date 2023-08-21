import styled from 'styled-components/macro';
import { DEFAULT_SIZE } from '../../util';
import {
  actionTypeInfoMap,
  Action,
  ActionCall,
  GroupedProjectile,
} from '../../calc';

const ImageBackgroundDiv = styled.div<{
  size: number;
}>`
  position: relative;
  min-width: ${({ size }) => size}px;
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
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
  size?: number;
  onDeleteSpell?: () => void;
} & Partial<ActionCall> &
  Partial<GroupedProjectile>;

export function WandAction(props: Props) {
  const { size = DEFAULT_SIZE, action } = props;
  // const [mouseOver, setMouseOver] = useState(false);

  const actionToBackgroundImage = (action?: Action) => {
    if (!action) {
      return '';
    }
    const typeImgUrl = actionTypeInfoMap[action.type]?.src ?? '';
    return `url("/${action.sprite}"), ${typeImgUrl && `url("/${typeImgUrl}")`}`;
  };

  const style = { backgroundImage: actionToBackgroundImage(action) };
  console.log(style);

  return (
    <ImageBackgroundDiv
      style={style}
      size={size}
      // onMouseEnter={() => setMouseOver(true)}
      // onMouseLeave={() => setMouseOver(false)}
    />
  );
}
