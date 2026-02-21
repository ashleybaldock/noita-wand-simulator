import { usePreview } from 'react-dnd-multi-backend';
import { DragPreviewWandAction } from './';
import type { DraggedSpell } from './DragItems';

export const SpellDragPreview = () => {
  const preview = usePreview<DraggedSpell>();
  if (!preview.display) {
    return null;
  }
  const {
    item: { actionId },
    style,
  } = preview;

  return (
    <DragPreviewWandAction
      spellId={actionId}
      style={style}
    ></DragPreviewWandAction>
  );
};
