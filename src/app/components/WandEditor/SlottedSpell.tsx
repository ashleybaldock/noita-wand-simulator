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
  WandIndexAnnotation,
} from '../Annotations';
import { isMainWandIndex, type WandIndex } from '../../redux/WandIndex';
import {
  DraggableWandAction,
  StyledWandActionBorder,
  WandActionDragSource,
  WandActionDropTargets,
} from '../Spells/WandAction';
import { isDraggedSpell } from '../Spells/WandAction/DragItems';

export const SlottedSpell = ({
  spell,
  wandIndex,
  deckIndex,
  lastIndex,
  droppable = true,
}: {
  spell?: Spell;
  wandIndex: WandIndex;
  deckIndex?: number | string;
  lastIndex?: WandIndex;
  selection?: WandSelection;
  droppable?: boolean;
}) => {
  const dispatch = useAppDispatch();

  const { isDraggingSpell } = useDragLayer((monitor) => ({
    isDragging: monitor.isDragging(),
    isDraggingSpell: isDraggedSpell(monitor.getItem()),
  }));

  const handleDeleteSpell = (wandIndex: WandIndex) => {
    dispatch(setSpellAtIndex({ spellId: null, wandIndex }));
  };

  return (
    <>
      {droppable ? (
        <WandActionDropTargets wandIndex={wandIndex} lastIndex={lastIndex}>
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
              {isMainWandIndex(wandIndex) && (
                <ChargesRemainingAnnotation
                  charges={spell.uses_remaining}
                  shouldBeZero={true}
                  shouldNotDeplete={false}
                  neverUnlimited={spell.never_unlimited}
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
                  {isMainWandIndex(wandIndex) && <NoManaAnnotation />}
                  <FriendlyFireAnnotation />
                </>
              )}
            </>
          )}
          <WandIndexAnnotation wandIndex={wandIndex} />
        </WandActionDropTargets>
      ) : (
        <StyledWandActionBorder droppable={droppable}></StyledWandActionBorder>
      )}
    </>
  );
};
