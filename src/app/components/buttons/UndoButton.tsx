import { useAppDispatch } from '../../redux/hooks';
import { ActionCreators } from 'redux-undo';
import { Button } from '../generic';

export const UndoButton = () => {
  const dispatch = useAppDispatch();

  const undo = () => dispatch(ActionCreators.undo());

  return (
    <Button
      hotkeys={'u, ctrl+z'}
      imgUrl={'data/undo.png'}
      imgOnly={'mobile'}
      onClick={() => undo()}
    >
      Undo
    </Button>
  );
};
