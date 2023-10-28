import { useContext } from 'react';
import { KeyStateContext } from '../../context/KeyStateContext';
import { useAppDispatch } from '../../redux/hooks';
import { resetWand } from '../../redux/wandSlice';
import { Button } from '../generic';

export function ResetButton() {
  const dispatch = useAppDispatch();
  const handleClick = () => {
    dispatch(resetWand());
  };

  const { shift } = useContext(KeyStateContext);

  return shift ? (
    <Button
      imgUrl={'data/ui_gfx/gun_actions/heavy_bullet_unidentified.png'}
      onClick={handleClick}
    >
      Clear
    </Button>
  ) : (
    <Button
      imgUrl={'data/ui_gfx/gun_actions/heavy_bullet_unidentified.png'}
      onClick={handleClick}
    >
      Reset
    </Button>
  );
}
