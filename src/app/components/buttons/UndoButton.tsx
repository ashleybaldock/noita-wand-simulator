import { useAppDispatch } from '../../redux/hooks';
import { useHotkeys } from 'react-hotkeys-hook';
import { ActionCreators } from 'redux-undo';
import { Button } from '../generic';

export function UndoButton() {
  const dispatch = useAppDispatch();

  const undo = () => dispatch(ActionCreators.undo());
  useHotkeys('mod+z, u', undo);

  return (
    <Button
      imgUrl={'data/ui_gfx/gun_actions/heavy_bullet_unidentified.png'}
      onClick={() => undo()}
    >
      Undo
    </Button>
  );
}
