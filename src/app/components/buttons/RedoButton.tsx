import { useAppDispatch } from '../../redux/hooks';
import { ActionCreators } from 'redux-undo';
import { Button } from '../generic';

export const RedoButton = () => {
  const dispatch = useAppDispatch();

  const redo = () => dispatch(ActionCreators.redo());

  return (
    <Button
      hotkeys={'r, ctrl+r, shift+mod+z'}
      tip={{ kind: 'uihint', id: 'redo' }}
      icon={'icon.redo'}
      imgOnly={'600px'}
      onClick={() => redo()}
    >
      Redo
    </Button>
  );
};
