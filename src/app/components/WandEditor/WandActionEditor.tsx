import { useState } from 'react';
import styled from 'styled-components/macro';
import { useHotkeys } from 'react-hotkeys-hook';
import { useAppDispatch } from '../../redux/hooks';
import {
  useSpells,
  setSpellAtIndex,
  useCursor,
  moveCursor,
  removeSpellAfterCursor,
  removeSpellBeforeCursor,
  moveSelection,
} from '../../redux/wandSlice';
import { Spell } from '../../calc/spell';
import { getSpellById } from '../../calc/spells';
import { isKnownSpell } from '../../types';
import {
  ChargesRemainingAnnotation,
  DeckIndexAnnotation,
  DeleteSpellAnnotation,
  FriendlyFireAnnotation,
  NoManaAnnotation,
} from '../Annotations/';
import {
  WandAction,
  WandActionBorder,
  WandActionDropTarget,
  WandSelection,
  WandActionDragSource,
} from '../Spells/WandAction';

const StyledList = styled.ul`
  --grid-layout-gap: 0px;
  --grid-max-column-count: 9;
  --grid-item-width: 62px;

  margin: 0;
  padding: 0 16px;
  background-color: var(--color-wand-editor-bg);

  @media screen and (max-width: 500px) {
    padding: 12px 4px;
  }

  --gap-count: calc(var(--grid-max-column-count) - 1);
  --total-gap-width: calc(var(--grid-layout-gap) * var(--gap-count));
  display: grid;
  grid-template-columns: repeat(
    auto-fill,
    minmax(var(--grid-item-width), var(--grid-item-width))
  );
  grid-gap: 4px 0;
  justify-content: center;
  align-items: center;
`;

const StyledListItem = styled.li`
  display: flex;
  flex: 0 1 auto;
  list-style-type: none;
  padding: 0 var(--grid-layout-gap);
`;

function ActionComponent({
  spellAction,
  wandIndex,
  deckIndex,
  cursorIndex,
  selection,
}: {
  spellAction?: Spell;
  wandIndex: number;
  cursorIndex: number;
  deckIndex?: number;
  selection?: WandSelection;
}) {
  const dispatch = useAppDispatch();
  const [mouseOver, setMouseOver] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleDeleteSpell = (wandIndex: number) => {
    dispatch(setSpellAtIndex({ spell: null, index: wandIndex }));
  };

  const cursor =
    cursorIndex === wandIndex
      ? 'before'
      : cursorIndex === wandIndex + 1
      ? 'after'
      : 'none';

  return (
    <WandActionDropTarget
      wandIndex={wandIndex}
      onDragChange={(dragOver: boolean) => setDragOver(dragOver)}
      cursor={cursor}
      selection={selection}
    >
      <WandActionBorder
        highlight={dragOver}
        onMouseEnter={() => setMouseOver(true)}
        onMouseLeave={() => setMouseOver(false)}
      >
        {spellAction && (
          <>
            <WandActionDragSource
              actionId={spellAction.id}
              sourceWandIndex={wandIndex}
            >
              <WandAction
                spellType={spellAction.type}
                spellSprite={spellAction.sprite}
                onDeleteSpell={() => handleDeleteSpell(wandIndex)}
              />
              <DeleteSpellAnnotation
                visible={mouseOver}
                deleteSpell={() => handleDeleteSpell(wandIndex)}
              />
            </WandActionDragSource>
            <DeckIndexAnnotation deckIndex={deckIndex} />
            <ChargesRemainingAnnotation
              charges={spellAction.uses_remaining}
              nounlimited={spellAction.never_unlimited}
            />
            <NoManaAnnotation />
            <FriendlyFireAnnotation />
          </>
        )}
      </WandActionBorder>
    </WandActionDropTarget>
  );
}

export function WandActionEditor() {
  const dispatch = useAppDispatch();

  const spellIds = useSpells();
  const { position: cursorPosition, selectFrom, selectTo } = useCursor();

  /* Move cursor */
  /* isSelecting && end selection
   *   visual change from in-progress selection, to active selection */
  useHotkeys('w', () => {
    dispatch(moveCursor({ by: -10 }));
  });
  useHotkeys('a', () => {
    dispatch(moveCursor({ by: -1 }));
  });
  useHotkeys('s', () => {
    dispatch(moveCursor({ by: 10 }));
  });
  useHotkeys('d', () => {
    dispatch(moveCursor({ by: 1 }));
  });

  /* Delete spells */
  /* isSelecting ? delete selected, clear selection : delete single
   *   visual change from in-progress/active selection to none */
  useHotkeys('Backspace, r', () => {
    dispatch(removeSpellBeforeCursor({ shift: 'left' }));
    dispatch(moveCursor({ by: -1 }));
  });
  useHotkeys('ctrl+Backspace, ctrl+r', () => {
    dispatch(removeSpellBeforeCursor({ shift: 'right' }));
  });
  useHotkeys('shift+Backspace, shift+r', () => {
    dispatch(removeSpellAfterCursor({ shift: 'left' }));
  });
  useHotkeys('ctrl+shift+Backspace, ctrl+shift+r', () => {
    dispatch(removeSpellAfterCursor({ shift: 'right' }));
    dispatch(moveCursor({ by: 1 }));
  });

  /* Modify selection */
  /* isSelecting ? extend : clear previous, begin new
   *   visual change to indicate change of active selection */
  useHotkeys('shift+w', () => {
    dispatch(moveCursor({ by: -10, select: true }));
  });
  useHotkeys('shift+a', () => {
    dispatch(moveCursor({ by: -1, select: true }));
  });
  useHotkeys('shift+s', () => {
    dispatch(moveCursor({ by: 10, select: true }));
  });
  useHotkeys('shift+d', () => {
    dispatch(moveCursor({ by: 1, select: true }));
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

  /* Cut selection to new wand/storage */
  /* Duplicate selection */

  const spellActions = spellIds.map((spellId) =>
    isKnownSpell(spellId) ? getSpellById(spellId) : undefined,
  );
  let deckIndex = 0;

  const getSelection = (
    idx: number,
    from: number | null,
    to: number | null,
  ): WandSelection => {
    if (from === null || to === null) {
      return 'none';
    }
    if (from === to && from === idx) {
      return 'single';
    }
    if ((idx >= from && idx <= to) || (idx >= to && idx <= from)) {
      if (idx === from) {
        return 'start';
      }
      if (idx === to) {
        return 'end';
      }
      return 'thru';
    }
    return 'none';
  };

  return (
    <StyledList>
      {spellActions.map((spellAction, wandIndex) => (
        <StyledListItem key={wandIndex}>
          <ActionComponent
            spellAction={spellAction}
            wandIndex={wandIndex}
            deckIndex={spellAction !== undefined ? deckIndex++ : undefined}
            cursorIndex={cursorPosition}
            selection={getSelection(wandIndex, selectFrom, selectTo)}
          />
        </StyledListItem>
      ))}
    </StyledList>
  );
}
