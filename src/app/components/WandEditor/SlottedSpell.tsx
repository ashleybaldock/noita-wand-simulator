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
  StyledWandActionBorder,
  WandActionDragSource,
  WandActionDropTargets,
} from '../Spells/WandAction';

export const SlottedSpell = ({
  spell,
  wandIndex,
  deckIndex,
  alwaysCast = false,
  droppable = true,
}: {
  spell?: Spell;
  wandIndex: WandIndex;
  deckIndex?: number | string;
  selection?: WandSelection;
  alwaysCast?: boolean;
  droppable?: boolean;
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
    <>
      {droppable ? (
        <WandActionDropTargets wandIndex={wandIndex}>
          {spell && (
            <>
              <WandActionDragSource
                actionId={spell.id}
                sourceWandIndex={wandIndex}
              >
                <DraggableWandAction
                  spellId={spell.id}
                  spellType={spell.type}
                  onDeleteSpell={() => handleDeleteSpell(wandIndex)}
                />
              </WandActionDragSource>
              {!alwaysCast && (
                <ChargesRemainingAnnotation
                  charges={spell.uses_remaining}
                  nounlimited={spell.never_unlimited}
                />
              )}
              <DeckIndexAnnotation
                deckIndex={deckIndex}
                wandIndex={wandIndex}
              />
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
      ) : (
        <StyledWandActionBorder droppable={droppable}></StyledWandActionBorder>
      )}
    </>
  );
};
