import styled from 'styled-components/macro';
import { useDrag } from 'react-dnd';
import { BaseAnnotation } from './BaseAnnotation';

const DeleteDiv = styled(BaseAnnotation)`
  top: 0;
  right: 0;
  border: 1px solid #999;
  color: black;
  background-color: #a33;
  font-size: 10px;
  text-align: center;
  font-family: var(--font-family-noita-default);
  cursor: pointer;
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

  return <DeleteDiv onClick={deleteSpell}>X</DeleteDiv>;
}
