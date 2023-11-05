import styled from 'styled-components/macro';
import { useDrag } from 'react-dnd';
import { BaseAnnotation } from './BaseAnnotation';

const DeleteDiv = styled(BaseAnnotation)`
  --transition-in: var(--transition-hover-in);
  --transition-out: var(--transition-hover-out);
  --transition-props: transform;

  top: 2px;
  right: 4px;
  left: unset;
  color: black;
  border: 1px solid #cb3c3c;
  border-radius: 2px;
  background-color: black;
  font-size: 10px;
  text-align: center;
  font-family: var(--font-family-noita-default);
  cursor: pointer;

  image-rendering: pixelated;

  padding: 2px;
  width: 12px;
  height: 12px;
  background-image: url('/data/warnings/neutralized.png');
  background-repeat: no-repeat;
  background-size: 12px 12px;
  background-position: center center;

  &:hover {
    transform: scale(109%);

    transition-timing-function: var(--transition-out, ease-out);
    transition-property: var(--transition-props);
  }
`;

type Props = {
  visible: boolean;
  deleteSpell?: () => void;
};

export function DeleteSpellAnnotation(props: Props) {
  const { visible, deleteSpell } = props;
  const [{ isDragging }] = useDrag(() => ({
    type: 'action',
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));
  if (isDragging || !visible || !deleteSpell) {
    return null;
  }

  return <DeleteDiv onClick={deleteSpell}></DeleteDiv>;
}
