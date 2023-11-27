import { useAppDispatch } from '../../redux/hooks';
import { ActionCreators } from 'redux-undo';
import { Button } from '../generic';

export function UndoButton() {
  const dispatch = useAppDispatch();

  const undo = () => dispatch(ActionCreators.undo());

  return (
    <Button
      hotkeys={'u, ctrl+z'}
      imgUrl={'data/undo.png'}
      onClick={() => undo()}
    >
      Undo
    </Button>
  );
}
