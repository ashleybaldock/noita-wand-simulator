import { useContext } from 'react';
import { KeyStateContext } from '../../context/KeyStateContext';
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

  const { shift } = useContext(KeyStateContext);

  return (
    <>
      <Button
        imgOnly="600px"
        hotkeys={'shift+t'}
        imgUrl={'data/ui_gfx/gun_actions/heavy_bullet_unidentified.png'}
        onClick={() => dispatch(clearSpells())}
      >
        Clear
      </Button>
      <Button
        imgOnly="600px"
        hotkeys={'t'}
        imgUrl={'data/ui_gfx/gun_actions/heavy_bullet_unidentified.png'}
        onClick={() => dispatch(resetWand())}
      >
        Reset
      </Button>
    </>
  );
};
