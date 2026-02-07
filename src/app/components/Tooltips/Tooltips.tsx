import { UiHintTooltip } from './UiHintTooltip';
import { KeyHintIndicator } from './HotkeyHint';
import { SpellInfoTooltip } from './SpellInfoTooltip';
import { AnnotationTooltip } from './AnnotationTooltip';

export const Tooltips = () => {
  return (
    <>
      <KeyHintIndicator />
      <SpellInfoTooltip />
      <UiHintTooltip />
      <AnnotationTooltip />
    </>
  );
};
