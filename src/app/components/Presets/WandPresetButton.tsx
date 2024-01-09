import { useAppDispatch, usePresets } from '../../redux/hooks';
import { setWand } from '../../redux/wandSlice';
import { useCallback, useState } from 'react';
import { WandPresetMenu } from './WandPresetMenu';
import { Button, Modal } from '../generic';
import { Preset } from '../../redux/Wand/preset';

export const WandPresetButton = () => {
  const presets = usePresets();
  const dispatch = useAppDispatch();

  const [menuVisible, setMenuVisible] = useState(false);

  const handleSelect = useCallback(
    (preset: Preset) => {
      setMenuVisible(false);
      dispatch(setWand({ wand: preset.wand, spells: preset.spells }));
    },
    [dispatch],
  );

  const handleClose = () => {
    setMenuVisible(false);
  };

  return (
    <>
      <Button
        hotkeys={'o'}
        imgUrl={'data/ui_gfx/gun_actions/heavy_bullet_unidentified.png'}
        onClick={() => setMenuVisible(!menuVisible)}
      >
        Load
      </Button>
      <Modal visible={menuVisible} onClose={handleClose} title="Presets">
        <WandPresetMenu presets={presets} onSelect={handleSelect} />
      </Modal>
    </>
  );
};
