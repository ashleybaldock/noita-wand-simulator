import { useHotkeys } from 'react-hotkeys-hook';
import { Button, Modal } from '../generic';
import { ExportAs } from '../Export';
import { useState } from 'react';

export function ExportButton() {
  const [modalVisible, setModalVisible] = useState(false);

  const handleClose = () => {
    setModalVisible(false);
  };

  const openExportDialog = () => {
    console.log('todo:exportAction');
    setModalVisible(!modalVisible);
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
      <Modal visible={modalVisible} onClose={handleClose} title="Export as...">
        <ExportAs />
      </Modal>
    </>
  );
}
