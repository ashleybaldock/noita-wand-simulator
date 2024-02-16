import { useUIToggle } from '../../redux';
import { Button } from '../generic';

export const ConfigButton = () => {
  const [, setModalVisible] = useUIToggle('showModalConfigEditor');
  return (
    <Button
      hotkeys={'p'}
      imgUrl={'data/sampo-config.png'}
      imgOnly={'mobile'}
      onClick={() => setModalVisible(true)}
    >
      Config
    </Button>
  );
};
