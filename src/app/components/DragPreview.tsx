import { SpellDragPreview } from './Spells/WandAction/SpellDragPreview';
import { SelectionDragPreview } from './Spells/WandAction/SelectionDragPreview';

export const DragPreview = () => {
  return (
    <>
      <SpellDragPreview></SpellDragPreview>
      <SelectionDragPreview></SelectionDragPreview>
    </>
  );
};
