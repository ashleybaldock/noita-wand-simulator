import { useDragLayer } from 'react-dnd';
import type { Spell } from '../../calc/spell';
import type { WandSelection } from '../../redux/Wand/wandSelection';
import { useAppDispatch } from '../../redux/hooks';
import { setSpellAtIndex } from '../../redux/wandSlice';
import {
  DraggableWandAction,
  WandActionDragSource,
  WandActionDropTargets,
} from '../Spells/WandAction';
import {
  ChargesRemainingAnnotation,
  DeckIndexAnnotation,
  DeleteSpellAnnotation,
  FriendlyFireAnnotation,
  NoManaAnnotation,
} from '../Annotations';

export const SlottedSpell = ({
  spellAction,
  wandIndex,
  deckIndex,
  selection,
  alwaysCast = false,
}: {
  spellAction?: Spell;
  wandIndex: number;
  deckIndex?: number;
  selection?: WandSelection;
  alwaysCast?: boolean;
}) => {
  const dispatch = useAppDispatch();

  const { isDraggingAction } = useDragLayer((monitor) => ({
    isDragging: monitor.isDragging(),
    isDraggingAction: monitor.getItemType() === 'action',
    isDraggingSelect: monitor.getItemType() === 'select',
  }));
  const handleDeleteSpell = (wandIndex: number) => {
    dispatch(setSpellAtIndex({ spell: null, index: wandIndex }));
  };

  return (
    <WandActionDropTargets
      alwaysCast={alwaysCast}
      wandIndex={wandIndex}
      selection={selection}
    >
      {spellAction && (
        <>
          <WandActionDragSource
            actionId={spellAction.id}
            sourceWandIndex={wandIndex}
          >
            <DraggableWandAction
              spellId={spellAction.id}
              spellType={spellAction.type}
              spellSprite={spellAction.sprite}
              onDeleteSpell={() => handleDeleteSpell(wandIndex)}
            />
          </WandActionDragSource>
          {!alwaysCast && (
            <ChargesRemainingAnnotation
              charges={spellAction.uses_remaining}
              nounlimited={spellAction.never_unlimited}
            />
          )}
          {!alwaysCast && <DeckIndexAnnotation deckIndex={deckIndex} />}
          {!isDraggingAction && (
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
