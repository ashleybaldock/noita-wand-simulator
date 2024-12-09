import styled from 'styled-components';
import { useRef } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import {
  useAppDispatch,
  useSelecting,
  useSpellLayout,
} from '../../redux/hooks';
import { setSpellAtIndex } from '../../redux/wandSlice';
import {
  moveCursor,
  removeSelectedSpells,
  removeSpellAfterCursor,
  removeSpellBeforeCursor,
} from '../../redux/editorThunks';
import { moveSelection, clearSelection } from '../../redux/editorSlice';
import type { Spell } from '../../calc/spell';
import { getSpellByActionId } from '../../calc/spells';
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
  StyledWandActionBorder,
} from '../Spells/WandAction';
import { useDragLayer } from 'react-dnd';
import { getComputedColumns } from './hooks';
import type { WandSelection } from '../../redux/Wand/wandSelection';
import { isKnownSpell } from '../../redux/Wand/spellId';
import { END } from '../../redux/WandIndex';
import type { WandIndex } from '../../redux/WandIndex';
import { WandIndexAnnotation } from '../Annotations/WandIndexAnnotation';
import { OverSpellDropTarget } from '../Spells/WandAction/OverSpellDropTarget';
import { BetweenSpellsDropTarget } from '../Spells/WandAction/BetweenSpellsDropTarget';

const PlaceHolder = styled(StyledWandActionBorder)`
  background-image: none;
`;
const EndOfWand = ({ wandIndex }: { wandIndex: WandIndex }) => {
  return (
    <OverSpellDropTarget data-name={'EndOfWandDropTarget'} wandIndex={END}>
      <PlaceHolder></PlaceHolder>
      <BetweenSpellsDropTarget
        indexOfSpellBefore={wandIndex}
        indexOfSpellAfter={END}
      />
      <WandIndexAnnotation wandIndex={END} />
    </OverSpellDropTarget>
  );
};
const ActionComponent = ({
  spellAction,
  wandIndex,
  deckIndex,
  lastIndex,
}: {
  spellAction?: Spell;
  wandIndex: WandIndex;
  deckIndex?: number;
  lastIndex?: WandIndex;
  selection?: WandSelection;
}) => {
  const dispatch = useAppDispatch();

  const { isDraggingAction } = useDragLayer((monitor) => ({
    isDragging: monitor.isDragging(),
    isDraggingAction:
      monitor.isDragging() && monitor.getItemType() === 'action',
    isDraggingSelect:
      monitor.isDragging() && monitor.getItemType() === 'select',
  }));
  const handleDeleteSpell = (wandIndex: WandIndex) => {
    dispatch(setSpellAtIndex({ spellId: null, wandIndex }));
  };

  return (
    <WandActionDropTargets wandIndex={wandIndex} lastIndex={lastIndex}>
      {spellAction && (
        <>
          <WandActionDragSource
            actionId={spellAction.id}
            sourceWandIndex={wandIndex}
          >
            <DraggableWandAction
              spellId={spellAction.id}
              spellType={spellAction.type}
              onDeleteSpell={() => handleDeleteSpell(wandIndex)}
            />
          </WandActionDragSource>
          <ChargesRemainingAnnotation
            charges={spellAction.uses_remaining}
            nounlimited={spellAction.never_unlimited}
          />
          <DeckIndexAnnotation
            deckIndex={deckIndex}
            wandIndex={spellAction.always_cast_index}
          />
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
      <WandIndexAnnotation wandIndex={wandIndex} />
    </WandActionDropTargets>
  );
};

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

  @media screen and (max-width: 800px) {
    & {
      margin: 0.8em -0.5em 0.4em -0.5em;
    }
  }
  column-span: all;

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

  const spellIds = useSpellLayout();
  const isSelecting = useSelecting();
  const gridRef = useRef(null);
  const currentRowLength = () => getComputedColumns(gridRef);

  /* Move cursor */
  /* isSelecting && end selection
   *   visual change from in-progress selection, to active selection */
  useHotkeys('w, k', () => {
    dispatch(moveCursor({ by: -1 * currentRowLength() }));
  });
  useHotkeys('a, h', () => {
    dispatch(moveCursor({ by: -1 }));
  });
  useHotkeys('s, j', () => {
    dispatch(moveCursor({ by: currentRowLength() }));
  });
  useHotkeys('d, l', () => {
    dispatch(moveCursor({ by: 1 }));
  });

  /* Delete spells */
  /* isSelecting ? delete selected, clear selection : delete single
   *   visual change from in-progress/active selection to none */
  useHotkeys('Backspace, r, shift+x', () => {
    if (isSelecting) {
      dispatch(removeSelectedSpells({ shift: 'left' }));
      dispatch(clearSelection());
    } else {
      dispatch(removeSpellBeforeCursor({ shift: 'left' }));
      dispatch(moveCursor({ by: -1 }));
    }
  });
  useHotkeys('ctrl+Backspace, ctrl+r', () => {
    if (isSelecting) {
      dispatch(removeSelectedSpells({ shift: 'right' }));
      dispatch(clearSelection());
    } else {
      dispatch(removeSpellBeforeCursor({ shift: 'right' }));
    }
  });
  useHotkeys('shift+Backspace, shift+r, x', () => {
    if (isSelecting) {
      dispatch(removeSelectedSpells({}));
      dispatch(clearSelection());
    } else {
      dispatch(removeSpellAfterCursor({ shift: 'left' }));
    }
  });
  useHotkeys('ctrl+shift+Backspace, ctrl+shift+r', () => {
    if (isSelecting) {
      dispatch(removeSelectedSpells({}));
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
  /* Select spells in current cast state
   * mouseover spell to highlight related spells
   * e.g. green border for multicast group
   *      yellow for trigger payload
   *      white for grouping divides
   *      etc.
   *
   * */

  const lastSpellIndex = spellIds.length - 1;
  const extraSpellIndex = spellIds.length;
  const spellActions = spellIds.map((spellId) =>
    isKnownSpell(spellId) ? getSpellByActionId(spellId) : undefined,
  );
  let deckIndex = 0;

  return (
    <SpellSlots ref={gridRef} data-name="WandActionEditor">
      {spellActions.map((spellAction, wandIndex) => (
        <SpellSlot key={wandIndex}>
          <ActionComponent
            spellAction={spellAction}
            wandIndex={wandIndex}
            deckIndex={spellAction !== undefined ? deckIndex++ : undefined}
            lastIndex={lastSpellIndex}
          />
        </SpellSlot>
      ))}
      <SpellSlot key={'endslot'}>
        <EndOfWand wandIndex={extraSpellIndex} />
      </SpellSlot>
    </SpellSlots>
  );
};
