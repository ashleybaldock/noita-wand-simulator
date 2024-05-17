import { useUIToggle } from '../../redux';
import { Button } from '../generic';

export const ConfigButton = ({ className = '' }: { className?: string }) => {
  const [, setModalVisible] = useUIToggle('showModalConfigEditor');
  return (
    <Button
      hotkeys={'p'}
      imgUrl={'data/sampo-config.png'}
      imgOnly={'600px'}
      onClick={() => setModalVisible(true)}
      className={className}
    >
      Config
    </Button>
  );
};
