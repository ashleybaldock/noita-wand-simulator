import { useUIToggle } from '../../redux';
import { Button } from '../generic';

export const ConfigButton = ({ className = '' }: { className?: string }) => {
  const [, setModalVisible] = useUIToggle('showModalConfigEditor');
  return (
    <Button
      hotkeys={'m'}
      icon={'icon.config'}
      imgOnly={'600px'}
      onClick={() => setModalVisible(true)}
      className={className}
    >
      Config
    </Button>
  );
};
