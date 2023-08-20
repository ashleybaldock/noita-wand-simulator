import styled from 'styled-components/macro';
import { useDrag } from 'react-dnd';

const DEFAULT_SIZE = 48;

const DeleteDiv = styled.div<{
  size: number;
}>`
  position: absolute;
  top: 0;
  right: 0;
  width: ${({ size }) => size / 4}px;
  height: ${({ size }) => size / 4}px;
  border: 1px solid #999;
  color: black;
  background-color: #a33;
  font-size: 10px;
  line-height: ${({ size }) => size / 3 - 2}px;
  text-align: center;
  font-family: var(--font-family-noita-default);
`;

type Props = {
  size?: number;
  visible: boolean;
  deleteSpell?: () => void;
};

export function DeleteSpellAnnotation(props: Props) {
  const { visible, deleteSpell } = props;
  const size = props.size ?? DEFAULT_SIZE;
  const [{ isDragging }] = useDrag(() => ({
    type: 'action',
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));
  if (isDragging || !visible || !deleteSpell) {
    return null;
  }

  return (
    <DeleteDiv size={size} onClick={deleteSpell}>
      X
    </DeleteDiv>
  );
}
