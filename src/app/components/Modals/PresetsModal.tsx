import { Modal } from '../generic';
import { WandPresetMenu } from '../Presets/WandPresetMenu';
import { useUIToggle } from '../../redux';

export const PresetsModal = () => {
  const [modalVisible, setModalVisible] = useUIToggle('showWandPresets');

  return (
    <Modal
      visible={modalVisible}
      onClose={() => setModalVisible(false)}
      title="Presets"
    >
      <WandPresetMenu />
    </Modal>
  );
};
