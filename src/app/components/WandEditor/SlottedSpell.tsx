import { useDragLayer } from 'react-dnd';
import type { Spell } from '../../calc/spell';
import type { WandSelection } from '../../redux/Wand/wandSelection';
import { useAppDispatch } from '../../redux/hooks';
import { setSpellAtIndex } from '../../redux/wandSlice';
import {
  ChargesRemainingAnnotation,
  DeckIndexAnnotation,
  DeleteSpellAnnotation,
  FriendlyFireAnnotation,
  NoManaAnnotation,
} from '../Annotations';
import type { WandIndex } from '../../redux/WandIndex';
import {
  DraggableWandAction,
  WandActionDragSource,
  WandActionDropTargets,
} from '../Spells/WandAction';

export const SlottedSpell = ({
  spell,
  wandIndex,
  deckIndex,
  alwaysCast = false,
}: {
  spell?: Spell;
  wandIndex: WandIndex;
  deckIndex?: number;
  selection?: WandSelection;
  alwaysCast?: boolean;
}) => {
  const dispatch = useAppDispatch();

  const { isDraggingSpell } = useDragLayer((monitor) => ({
    isDragging: monitor.isDragging(),
    isDraggingSpell: monitor.getItemType() === 'spell',
    isDraggingSelect: monitor.getItemType() === 'select',
  }));
  const handleDeleteSpell = (wandIndex: WandIndex) => {
    dispatch(setSpellAtIndex({ spellId: null, wandIndex }));
  };

  return (
    <WandActionDropTargets wandIndex={wandIndex}>
      {spell && (
        <>
          <WandActionDragSource actionId={spell.id} sourceWandIndex={wandIndex}>
            <DraggableWandAction
              spellId={spell.id}
              spellType={spell.type}
              spellSprite={spell.sprite}
              onDeleteSpell={() => handleDeleteSpell(wandIndex)}
            />
          </WandActionDragSource>
          {!alwaysCast && (
            <ChargesRemainingAnnotation
              charges={spell.uses_remaining}
              nounlimited={spell.never_unlimited}
            />
          )}
          {!alwaysCast && <DeckIndexAnnotation deckIndex={deckIndex} />}
          {!isDraggingSpell && (
            <>
              <DeleteSpellAnnotation
                deleteSpell={() => handleDeleteSpell(wandIndex)}
              />
              {!alwaysCast && <NoManaAnnotation />}
              <FriendlyFireAnnotation />
            </>
          )}
        </>
      )}
    </WandActionDropTargets>
  );
};
