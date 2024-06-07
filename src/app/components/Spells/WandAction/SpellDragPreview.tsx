import { usePreview } from 'react-dnd-multi-backend';
import { WandAction } from './';
import { isKnownSpell } from '../../../redux/Wand/spellId';
import { getSpellById } from '../../../calc/spells';
import type { DragItemSpell } from './DragItems';

export const SpellDragPreview = () => {
  const preview = usePreview<DragItemSpell>();
  if (!preview.display) {
    return null;
  }
  const {
    item: { actionId },
    style,
  } = preview;
  const spell = isKnownSpell(actionId) ? getSpellById(actionId) : undefined;
  if (!spell) {
    return null;
  }

  return (
    <WandAction
      spellId={spell.id}
      spellType={spell.type}
      spellSprite={spell.sprite}
      style={style}
    ></WandAction>
  );
};
