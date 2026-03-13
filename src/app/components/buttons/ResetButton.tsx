import styled from 'styled-components';
import { useAppDispatch } from '../../redux/hooks';
import { resetWand } from '../../redux/wandSlice';
import { Button } from '../generic';

const _ResetButton = ({ className }: { className?: string }) => {
  const dispatch = useAppDispatch();
  return (
    <Button
      className={className}
      dataName="ResetButton"
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

export const ResetButton = styled(_ResetButton)`
  margin-left: 0;
  border-radius: var(--bdr-br);
  border-width: var(--ou) calc(var(--ou) * 0.5) var(--ou) calc(var(--ou) * 0.5);
  border-color: var(--color-button-border) var(--color-button-border)
    var(--color-button-border) var(--color-button-border);
  border-style: solid;
  grid-column: reset;
`;
