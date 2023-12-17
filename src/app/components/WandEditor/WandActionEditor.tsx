import styled from 'styled-components';
import { useRef } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useAppDispatch } from '../../redux/hooks';
import {
  useSpells,
  setSpellAtIndex,
  moveCursor,
  removeSpellAfterCursor,
  removeSpellBeforeCursor,
  moveSelection,
  deleteSelection,
  clearSelection,
  useSelecting,
} from '../../redux/wandSlice';
import { Spell } from '../../calc/spell';
import { getSpellById } from '../../calc/spells';
import {
  ChargesRemainingAnnotation,
  DeckIndexAnnotation,
  DeleteSpellAnnotation,
  FriendlyFireAnnotation,
  NoManaAnnotation,
} from '../Annotations/';
import {
  DraggableWandAction,
  WandActionDropTargets,
  WandActionDragSource,
} from '../Spells/WandAction';
import { useDragLayer } from 'react-dnd';
import { getComputedColumns } from './hooks';
import { WandSelection } from '../../redux/Wand/wandSelection';
import { isKnownSpell } from '../../redux/Wand/spellId';

function ActionComponent({
  spellAction,
  wandIndex,
  deckIndex,
  selection,
}: {
  spellAction?: Spell;
  wandIndex: number;
  deckIndex?: number;
  selection?: WandSelection;
}) {
  const dispatch = useAppDispatch();

  const { isDragging, isDraggingAction, isDraggingSelect } = useDragLayer(
    (monitor) => ({
      isDragging: monitor.isDragging(),
      isDraggingAction: monitor.getItemType() === 'action',
      isDraggingSelect: monitor.getItemType() === 'select',
    }),
  );
  const handleDeleteSpell = (wandIndex: number) => {
    dispatch(setSpellAtIndex({ spell: null, index: wandIndex }));
  };

  return (
    <WandActionDropTargets wandIndex={wandIndex} selection={selection}>
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
          <ChargesRemainingAnnotation
            charges={spellAction.uses_remaining}
            nounlimited={spellAction.never_unlimited}
          />
          <DeckIndexAnnotation deckIndex={deckIndex} />
          {!isDraggingAction && (
            <>
              <DeleteSpellAnnotation
                deleteSpell={() => handleDeleteSpell(wandIndex)}
              />
              <NoManaAnnotation />
              <FriendlyFireAnnotation />
            </>
          )}
        </>
      )}
    </WandActionDropTargets>
  );
}

const SpellSlots = styled.ul`
  --grid-layout-gap: 0px;
  --grid-max-column-count: 7;
  --grid-item-width: 62px;

  margin: 0;
  padding: 0 16px;
  background-color: var(--color-wand-editor-bg);

  @media screen and (max-width: 500px) {
    padding: 0 0;
  }

  --gap-count: calc(var(--grid-max-column-count) - 1);
  --total-gap-width: calc(var(--grid-layout-gap) * var(--gap-count));
  display: grid;
  grid-template-columns: repeat(
    auto-fill,
    minmax(var(--grid-item-width), var(--grid-item-width))
  );
  grid-gap: 2px 0;
  padding-left: 0;
  padding: 0 4px;

  justify-content: center;
  align-items: center;
`;

const SpellSlot = styled.li`
  display: flex;
  flex: 0 1 auto;
  list-style-type: none;
  padding: 0 var(--grid-layout-gap);
`;
export const WandActionEditor = () => {
  const dispatch = useAppDispatch();

  const spellIds = useSpells();
  const isSelecting = useSelecting();
  const gridRef = useRef(null);
  const currentRowLength = () => getComputedColumns(gridRef);
  // const currentRowLength = () => 10; // TODO calc from current layout

  /* Move cursor */
  /* isSelecting && end selection
   *   visual change from in-progress selection, to active selection */
  useHotkeys('w', () => {
    dispatch(moveCursor({ by: -1 * currentRowLength() }));
  });
  useHotkeys('a', () => {
    dispatch(moveCursor({ by: -1 }));
  });
  useHotkeys('s', () => {
    dispatch(moveCursor({ by: currentRowLength() }));
  });
  useHotkeys('d', () => {
    dispatch(moveCursor({ by: 1 }));
  });

  /* Delete spells */
  /* isSelecting ? delete selected, clear selection : delete single
   *   visual change from in-progress/active selection to none */
  useHotkeys('Backspace, r', () => {
    if (isSelecting) {
      dispatch(deleteSelection({ shift: 'left' }));
      dispatch(clearSelection());
    } else {
      dispatch(removeSpellBeforeCursor({ shift: 'left' }));
      dispatch(moveCursor({ by: -1 }));
    }
  });
  useHotkeys('ctrl+Backspace, ctrl+r', () => {
    if (isSelecting) {
      dispatch(deleteSelection({ shift: 'right' }));
      dispatch(clearSelection());
    } else {
      dispatch(removeSpellBeforeCursor({ shift: 'right' }));
    }
  });
  useHotkeys('shift+Backspace, shift+r', () => {
    if (isSelecting) {
      dispatch(deleteSelection({}));
      dispatch(clearSelection());
    } else {
      dispatch(removeSpellAfterCursor({ shift: 'left' }));
    }
  });
  useHotkeys('ctrl+shift+Backspace, ctrl+shift+r', () => {
    if (isSelecting) {
      dispatch(deleteSelection({}));
      dispatch(clearSelection());
    } else {
      dispatch(removeSpellAfterCursor({ shift: 'right' }));
      dispatch(moveCursor({ by: 1 }));
    }
  });

  /* Modify selection */
  /* isSelecting ? extend : clear previous, begin new
   *   visual change to indicate change of active selection */
  useHotkeys('shift+w', () => {
    dispatch(moveCursor({ by: -1 * currentRowLength(), select: 'left' }));
  });
  useHotkeys('shift+a', () => {
    dispatch(moveCursor({ by: -1, select: 'left' }));
  });
  useHotkeys('shift+s', () => {
    dispatch(moveCursor({ by: currentRowLength(), select: 'right' }));
  });
  useHotkeys('shift+d', () => {
    dispatch(moveCursor({ by: 1, select: 'right' }));
  });
  useHotkeys('c', () => {
    dispatch(clearSelection());
  });

  /* Move selection */
  /* isSelecting ? end selection,shift selection : new single selection,shift
   *   visual change to indicate selection commmited, and shift of spells */
  useHotkeys('ctrl+shift+a', () => {
    dispatch(moveSelection({ by: -1 }));
  });
  useHotkeys('ctrl+shift+d', () => {
    dispatch(moveSelection({ by: 1 }));
  });

  /* Add spaces to front/end w/ + button or drag */
  /* Selection needs control nodes to grab for drag and drop */
  /* Cut selection to new wand/storage */
  /* Duplicate selection */
  /* Select spells in current cast state */

  const spellActions = spellIds.map((spellId) =>
    isKnownSpell(spellId) ? getSpellById(spellId) : undefined,
  );
  let deckIndex = 0;

  return (
    <SpellSlots ref={gridRef}>
      {spellActions.map((spellAction, wandIndex) => (
        <SpellSlot key={wandIndex}>
          <ActionComponent
            spellAction={spellAction}
            wandIndex={wandIndex}
            deckIndex={spellAction !== undefined ? deckIndex++ : undefined}
          />
        </SpellSlot>
      ))}
    </SpellSlots>
  );
};
