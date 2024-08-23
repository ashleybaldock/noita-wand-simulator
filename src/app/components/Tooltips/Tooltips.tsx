import { UiHintTooltip } from './UiHintTooltip';
import { KeyHintIndicator } from './HotkeyHint';
import { SpellInfoTooltip } from './SpellInfoTooltip';

export const Tooltips = () => {
  return (
    <>
      <KeyHintIndicator />
      <SpellInfoTooltip />
      <UiHintTooltip />
    </>
  );
};
