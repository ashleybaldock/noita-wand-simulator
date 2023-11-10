import styled from 'styled-components/macro';
import { useDrag } from 'react-dnd';
import { WandActionBorder } from '../Spells/WandAction';
import { BaseAnnotation } from './BaseAnnotation';
import { noop } from '../../util';

const DeleteDiv = styled(BaseAnnotation)`
  --transition-in: var(--transition-hover-in);
  --transition-out: var(--transition-hover-out);
  --transition-props: transform;

  top: 2px;
  right: 4px;
  left: unset;
  color: black;

  border-radius: 5px;
  border: 1px solid #cb3c3c;
  background-color: black;

  font-size: 10px;
  text-align: center;
  font-family: var(--font-family-noita-default);
  cursor: pointer;

  image-rendering: pixelated;

  z-index: var(--zindex-note-delete);
  padding: 2px;
  width: 13px;
  height: 13px;
  background-image: url('/data/warnings/neutralized.png');
  background-repeat: no-repeat;
  background-size: 11px 11px;
  background-size: 13px 13px;
  background-position: center center;

  transform: scale(100%);
  transition: var(--transition-in);
  transition-property: var(--transition-props);

  display: none;
  ${WandActionBorder}:hover && {
    display: block;
  }

  &:hover {
    transform: scale(109%);

    transition: var(--transition-out);
    transition-property: var(--transition-props);
  }
`;

export const DeleteSpellAnnotation = ({
  deleteSpell = noop,
}: {
  deleteSpell?: () => void;
}) => {
  const [{ isDragging }] = useDrag(() => ({
    type: 'action',
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return <DeleteDiv onClick={deleteSpell}></DeleteDiv>;
};
