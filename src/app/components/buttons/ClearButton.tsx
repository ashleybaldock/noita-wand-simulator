import styled from 'styled-components';
import { useAppDispatch } from '../../redux/hooks';
import { clearSpells } from '../../redux/wandSlice';
import { Button } from '../generic';

const _ClearButton = ({ className }: { className?: string }) => {
  const dispatch = useAppDispatch();
  return (
    <Button
      className={className}
      imgOnly="500px"
      hotkeys={'shift+t'}
      tip={{ kind: 'uihint', id: 'clear' }}
      icon={'icon.clear'}
      onClick={() => dispatch(clearSpells())}
    >
      Clear
    </Button>
  );
};
export const ClearButton = styled(_ClearButton)``;
