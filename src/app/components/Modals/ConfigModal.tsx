import { Modal } from '../generic';
import { ConfigEditor } from '../ConfigEditor';
import { useUIToggle } from '../../redux';

export const ConfigModal = () => {
  const [modalVisible, setModalVisible] = useUIToggle('showModalConfigEditor');

  return (
    <Modal
      visible={modalVisible}
      onClose={() => setModalVisible(false)}
      title="Config"
    >
      <ConfigEditor />
    </Modal>
  );
};
