// import { useAppDispatch } from '../../redux/hooks';
import { Button } from '../generic';

export const SaveButton = () => {
  // const dispatch = useAppDispatch();

  const save = () => console.log('todo:saveAction');

  return (
    <Button
      hotkeys={'s, mod+s'}
      tip={{ kind: 'uihint', id: 'save' }}
      icon={'icon.save'}
      onClick={() => save()}
    >
      Save
    </Button>
  );
};
