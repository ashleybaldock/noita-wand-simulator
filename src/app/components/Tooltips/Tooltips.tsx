import { ActionHintTooltip } from './ActionHintTooltip';
import { KeyHintIndicator } from './HotkeyHint';
import { SpellInfoTooltip } from './SpellInfoTooltip';

export const Tooltips = () => {
  return (
    <>
      <KeyHintIndicator />
      <SpellInfoTooltip />
      <ActionHintTooltip />
    </>
  );
};
