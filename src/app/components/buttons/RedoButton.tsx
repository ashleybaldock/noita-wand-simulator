import { useAppDispatch } from '../../redux/hooks';
import { useHotkeys } from 'react-hotkeys-hook';
import { ActionCreators } from 'redux-undo';
import { Button } from '../generic';

export function RedoButton() {
  const dispatch = useAppDispatch();

  const redo = () => dispatch(ActionCreators.redo());
  useHotkeys('shift+mod+z, ctrl+r', redo);

  return (
    <Button imgUrl={'data/redo.png'} onClick={() => redo()}>
      Redo
    </Button>
  );
}
