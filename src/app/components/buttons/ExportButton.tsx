import { Button, Modal } from '../generic';
import { ExportAs } from '../Export';
import { useState } from 'react';

export const ExportButton = () => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleClose = () => {
    setModalVisible(false);
  };

  const openExportDialog = () => {
    console.log('todo:exportAction');
    setModalVisible(!modalVisible);
  };

  return (
    <>
      <Button icon={'icon.export'} onClick={() => openExportDialog()}>
        Export
      </Button>
      <Modal visible={modalVisible} onClose={handleClose} title="Export as...">
        <ExportAs />
      </Modal>
    </>
  );
};
