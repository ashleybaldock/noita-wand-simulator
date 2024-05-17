import { useUIToggle } from '../../redux/hooks';
import { Button } from '../generic';

export const WandPresetButton = ({
  className = '',
}: {
  className?: string;
}) => {
  const [, setMenuVisible] = useUIToggle('showWandPresets');

  return (
    <Button
      hotkeys={'o'}
      imgUrl={'data/ui_gfx/gun_actions/heavy_bullet_unidentified.png'}
      imgOnly={'600px'}
      onClick={() => setMenuVisible(true)}
      className={className}
    >
      Load
    </Button>
  );
};
