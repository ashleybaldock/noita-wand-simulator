import { useAppDispatch } from '../../redux/hooks';
import { useHotkeys } from 'react-hotkeys-hook';
import { Button, Modal } from '../generic';
import { useState } from 'react';

export function ExportButton() {
  const [modalVisible, setModalVisible] = useState(false);
  const dispatch = useAppDispatch();

  const handleClose = () => {
    setModalVisible(false);
  };

  const openExportDialog = () => {
    console.log('todo:exportAction');
  };

  useHotkeys('e', openExportDialog);

  return (
    <>
      <Button
        imgUrl={'data/ui_gfx/gun_actions/heavy_bullet_unidentified.png'}
        onClick={() => openExportDialog()}
      >
        Export
      </Button>
      <Modal
        visible={modalVisible}
        onClose={handleClose}
        title="Configuration"
      ></Modal>
    </>
  );
}
