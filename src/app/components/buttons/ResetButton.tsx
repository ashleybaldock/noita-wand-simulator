import { useContext } from 'react';
import { KeyStateContext } from '../../context/KeyStateContext';
import { useAppDispatch } from '../../redux/hooks';
import { clearSpells, resetWand } from '../../redux/wandSlice';
import { Button } from '../generic';

export const ResetButton = () => {
  const dispatch = useAppDispatch();

  const { shift } = useContext(KeyStateContext);

  return shift ? (
    <Button
      hotkeys={'shift+t'}
      imgUrl={'data/ui_gfx/gun_actions/heavy_bullet_unidentified.png'}
      onClick={() => dispatch(clearSpells())}
    >
      Clear
    </Button>
  ) : (
    <Button
      hotkeys={'t'}
      imgUrl={'data/ui_gfx/gun_actions/heavy_bullet_unidentified.png'}
      onClick={() => dispatch(resetWand())}
    >
      Reset
    </Button>
  );
};
