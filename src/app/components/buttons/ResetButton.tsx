import styled from 'styled-components';
import { useAppDispatch } from '../../redux/hooks';
import { resetWand } from '../../redux/wandSlice';
import { Button } from '../generic';

const _ResetButton = ({ className }: { className?: string }) => {
  const dispatch = useAppDispatch();
  return (
    <Button
      className={className}
      imgOnly="500px"
      hotkeys={'t'}
      tip={{ kind: 'uihint', id: 'reset' }}
      icon={'icon.reset'}
      onClick={() => dispatch(resetWand())}
    >
      Reset
    </Button>
  );
};

export const ResetButton = styled(_ResetButton)``;
