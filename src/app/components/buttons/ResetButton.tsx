import { useKeyState } from '../../context/KeyStateContext';
import { useAppDispatch } from '../../redux/hooks';
import { clearSpells, resetWand } from '../../redux/wandSlice';
import { Button } from '../generic';
import styled from 'styled-components';

const StyledStack = styled.div`
  position: relative;
  display: grid;

  place-items: center end;

  @media screen and (max-width: 500px) {
    display: content;
  }
`;

const Stack = ({ children }: React.PropsWithChildren) => {
  return <StyledStack>{children}</StyledStack>;
};

export const ResetButton = () => {
  const dispatch = useAppDispatch();

  const { shift } = useKeyState();

  return (
    <>
      <Button
        imgOnly="600px"
        hotkeys={'shift+t'}
        tip={{ kind: 'uihint', id: 'clear' }}
        icon={'icon.clear'}
        onClick={() => dispatch(clearSpells())}
      >
        Clear
      </Button>
      <Button
        imgOnly="600px"
        hotkeys={'t'}
        tip={{ kind: 'uihint', id: 'reset' }}
        icon={'icon.reset'}
        onClick={() => dispatch(resetWand())}
      >
        Reset
      </Button>
    </>
  );
};
