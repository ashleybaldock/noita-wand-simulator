import { Modal } from '../generic';
import { WandPresetMenu } from '../Presets/WandPresetMenu';
import { setWand, useAppDispatch, usePresets, useUIToggle } from '../../redux';
import { useCallback } from 'react';
import type { Preset } from '../../redux/Wand/preset';

export const PresetsModal = () => {
  const presets = usePresets();
  const dispatch = useAppDispatch();

  const [modalVisible, setModalVisible] = useUIToggle('showWandPresets');

  const handleSelect = useCallback(
    (preset: Preset) => {
      setModalVisible(false);
      dispatch(setWand({ wand: preset.wand, spells: preset.spells }));
    },
    [dispatch],
  );

  return (
    <Modal
      visible={modalVisible}
      onClose={() => setModalVisible(false)}
      title="Presets"
    >
      <WandPresetMenu presets={presets} onSelect={handleSelect} />
    </Modal>
  );
};
