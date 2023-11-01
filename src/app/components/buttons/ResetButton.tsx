import { useContext } from 'react';
import { KeyStateContext } from '../../context/KeyStateContext';
import { useAppDispatch } from '../../redux/hooks';
import { clearSpells, resetWand } from '../../redux/wandSlice';
import { Button } from '../generic';

export function ResetButton() {
  const dispatch = useAppDispatch();

  const { shift } = useContext(KeyStateContext);

  return shift ? (
    <Button
      imgUrl={'data/ui_gfx/gun_actions/heavy_bullet_unidentified.png'}
      onClick={() => dispatch(clearSpells())}
    >
      Clear
    </Button>
  ) : (
    <Button
      imgUrl={'data/ui_gfx/gun_actions/heavy_bullet_unidentified.png'}
      onClick={() => dispatch(resetWand())}
    >
      Reset
    </Button>
  );
}
