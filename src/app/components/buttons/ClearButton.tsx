import { useAppDispatch } from '../../redux/hooks';
import { clearSpells } from '../../redux/wandSlice';
import { Button } from '../generic';

export function ClearButton() {
  const dispatch = useAppDispatch();
  const handleClick = () => {
    dispatch(clearSpells());
  };
  return (
    <Button
      imgUrl={'data/ui_gfx/gun_actions/heavy_bullet_unidentified.png'}
      onClick={handleClick}
    >
      Clear
    </Button>
  );
}
