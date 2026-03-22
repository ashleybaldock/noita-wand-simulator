import styled from 'styled-components';
import { useRef } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import {
  useAppDispatch,
  useSelecting,
  useSpellLayout,
} from '../../redux/hooks';
import {
  moveCursor,
  removeSelectedSpells,
  removeSpellAfterCursor,
  removeSpellBeforeCursor,
} from '../../redux/editorThunks';
import { clearSelection } from '../../redux/editorSlice';
import { getSpellByActionId } from '../../calc/spells';
import { getComputedColumns } from './hooks';
import { isKnownSpell } from '../../redux/Wand/spellId';
import { END } from '../../redux/WandIndex';
import type { WandIndex } from '../../redux/WandIndex';
import { WandIndexAnnotation } from '../Annotations/WandIndexAnnotation';
import { OverSpellDropTarget } from '../Spells/WandAction/OverSpellDropTarget';
import { BetweenSpellsDropTarget } from '../Spells/WandAction/BetweenSpellsDropTarget';
import { SlottedSpell } from './SlottedSpell';
import { SpellSlot } from '../Spells/SpellSlot';

const PlaceHolder = styled(SpellSlot)`
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

const SpellSlots = styled.ul`
  --grid-layout-gap: 0px;
  --grid-max-column-count: 7;
  --grid-item-width: 62px;

  margin: 0;
  background-color: var(--color-wand-editor-bg);

  @media screen and (max-width: 500px) {
    padding: 0;
  }

  @media screen and (max-width: 800px) {
    margin: 0.8em auto 0.4em auto;
  }

  column-span: all;

  --gap-count: calc(var(--grid-max-column-count) - 1);
  --total-gap-width: calc(var(--grid-layout-gap) * var(--gap-count));
  display: grid;
  grid-gap: 2px 0;

  justify-content: center;
  align-items: center;
  --grid-max-column-count: 10;
  grid-template-columns: repeat(auto-fit, var(--grid-item-width));

  --usedw: calc(var(--pad) * 2 + var(--bdw) * 2);
  --pad: 1ch;
  --bdw: 3px;
  border: var(--bdw) solid transparent;

  width: auto;
  --available: calc(100vw - var(--usedw));
  width: round(down, var(--available), var(--grid-item-width));
  margin: 0;
  padding: 0;
`;

const SpellSlotListItem = styled.li`
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
      dispatch(removeSelectedSpells({ deleteStrategy: 'shift' }));
    } else {
      dispatch(removeSpellBeforeCursor());
    }
  });
  useHotkeys('ctrl+Backspace, ctrl+r', () => {
    if (isSelecting) {
      dispatch(removeSelectedSpells({ shiftDirection: 'right' }));
    } else {
      dispatch(removeSpellBeforeCursor({ shift: 'right' }));
    }
  });
  useHotkeys('shift+Backspace, shift+r, x', () => {
    if (isSelecting) {
      dispatch(removeSelectedSpells({}));
    } else {
      dispatch(removeSpellAfterCursor());
    }
  });
  useHotkeys('ctrl+shift+Backspace, ctrl+shift+r', () => {
    if (isSelecting) {
      dispatch(removeSelectedSpells({}));
    } else {
      dispatch(removeSpellAfterCursor({ shift: 'right' }));
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
    // dispatch(moveSelection({ by: -1 })); TODO
  });
  useHotkeys('ctrl+shift+d', () => {
    // dispatch(moveSelection({ by: 1 })); TODO
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
        <SpellSlotListItem key={wandIndex}>
          <SlottedSpell
            spell={spellAction}
            wandIndex={wandIndex}
            deckIndex={spellAction !== undefined ? deckIndex++ : undefined}
            lastIndex={lastSpellIndex}
          />
        </SpellSlotListItem>
      ))}
      <SpellSlotListItem key={'endslot'}>
        <EndOfWand wandIndex={extraSpellIndex} />
      </SpellSlotListItem>
    </SpellSlots>
  );
};
