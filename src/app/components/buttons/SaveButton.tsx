// import { useAppDispatch } from '../../redux/hooks';
import { Button } from '../generic';

export const SaveButton = () => {
  // const dispatch = useAppDispatch();

  const save = () => console.log('todo:saveAction');

  return (
    <Button
      hotkeys={'s, mod+s'}
      imgUrl={'data/ui_gfx/gun_actions/heavy_bullet_unidentified.png'}
      onClick={() => save()}
    >
      Save
    </Button>
  );
};
