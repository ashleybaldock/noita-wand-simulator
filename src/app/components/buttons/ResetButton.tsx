import { useAppDispatch } from '../../redux/hooks';
import { clearSpells, resetWand } from '../../redux/wandSlice';
import { Button } from '../generic';

export const ResetButton = () => {
  const dispatch = useAppDispatch();

  // const { shift } = useKeyState();

  return (
    <>
      <Button
        imgOnly="500px"
        hotkeys={'shift+t'}
        tip={{ kind: 'uihint', id: 'clear' }}
        icon={'icon.clear'}
        onClick={() => dispatch(clearSpells())}
      >
        Clear
      </Button>
      <Button
        imgOnly="500px"
        hotkeys={'t'}
        tip={{ kind: 'uihint', id: 'reset' }}
        icon={'icon.reset'}
        onClick={() => dispatch(resetWand())}
      >
        Reset
      </Button>
    </>
  );
};
