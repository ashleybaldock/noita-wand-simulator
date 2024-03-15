import { usePreview } from 'react-dnd-multi-backend';
import { WandAction, type DraggedAction } from './Spells/WandAction';
import { isKnownSpell } from '../redux/Wand/spellId';
import { getSpellById } from '../calc/spells';

export const SpellDragPreview = () => {
  const preview = usePreview();
  if (!preview.display) {
    return null;
  }
  const { itemType, item, style } = preview;
  const { actionId } = item as DraggedAction;
  const spell = isKnownSpell(actionId) ? getSpellById(actionId) : undefined;
  if (!spell) {
    return null;
  }
  // render your preview
  return (
    <WandAction
      spellId={spell.id}
      spellType={spell.type}
      spellSprite={spell.sprite}
      style={style}
    ></WandAction>
  );
};
