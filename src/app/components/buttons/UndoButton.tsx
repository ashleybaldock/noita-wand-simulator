import { useAppDispatch } from '../../redux/hooks';
import { ActionCreators } from 'redux-undo';
import { Button } from '../generic';

export const UndoButton = () => {
  const dispatch = useAppDispatch();

  const undo = () => dispatch(ActionCreators.undo());

  return (
    <Button
      data-name="UndoButton"
      hotkeys={'u, ctrl+z, mod+z'}
      onHotkey={undo}
      tip={{ kind: 'uihint', id: 'undo' }}
      icon={'icon.undo'}
      imgOnly={'500px'}
      onClick={undo}
    >
      Undo
    </Button>
  );
};
