import { useAppDispatch } from '../../redux/hooks';
import { ActionCreators } from 'redux-undo';
import { Button } from '../generic';

export function RedoButton() {
  const dispatch = useAppDispatch();

  const redo = () => dispatch(ActionCreators.redo());

  return (
    <Button
      hotkeys={'r, ctrl+r, shift+mod+z'}
      imgUrl={'data/redo.png'}
      onClick={() => redo()}
    >
      Redo
    </Button>
  );
}
