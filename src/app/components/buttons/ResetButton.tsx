import { useAppDispatch } from '../../redux/hooks';
import { resetWand } from '../../redux/wandSlice';
import { Button } from '../generic';

export function ResetButton() {
  const dispatch = useAppDispatch();
  const handleClick = () => {
    dispatch(resetWand());
  };
  return (
    <Button
      imgUrl={'data/ui_gfx/gun_actions/heavy_bullet_unidentified.png'}
      onClick={handleClick}
    >
      Reset
    </Button>
  );
}
