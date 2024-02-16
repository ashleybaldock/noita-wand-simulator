import styled from 'styled-components';
import { useRef } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useAlwaysCastLayout, useAppDispatch } from '../../redux/hooks';
import { moveCursor } from '../../redux/editorThunks';
import { deleteSelection, clearSelection } from '../../redux/editorSlice';
import { getSpellById } from '../../calc/spells';
import { isKnownSpell } from '../../redux/Wand/spellId';
import { SlottedSpell } from './SlottedSpell';

const SpellSlots = styled.ul`
  --grid-layout-gap: 0px;
  --bsize-spell: 32px;

  margin: 0;
  padding: 0 16px;
  background-color: var(--color-wand-editor-bg);

  @media screen and (max-width: 500px) {
    padding: 0 0;
  }

  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 2px 0;
  padding-left: 0;
  padding: 0 4px;
  width: min-content;

  justify-content: center;
  align-items: center;
  justify-self: center;
`;

const SpellSlot = styled.li`
  display: flex;
  flex: 0 1 auto;
  list-style-type: none;
  padding: 0 var(--grid-layout-gap);
`;

const StyledName = styled.div`
  flex: 0 1 auto;
  text-align: right;
  width: fit-content;
  margin-right: 0.6em;
  line-height: 1.3;
`;

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const WandAlwaysCastEditor = styled(
  ({ className = '' }: { className?: string }) => {
    const dispatch = useAppDispatch();

    const alwaysIds = useAlwaysCastLayout();
    const gridRef = useRef(null);

    /* Move cursor */
    useHotkeys('a, h', () => {
      /*
       */
      dispatch(moveCursor({ by: -1, always: true }));
    });
    useHotkeys('d, l', () => {
      dispatch(moveCursor({ by: 1, always: true }));
    });

    useHotkeys('Backspace, r, shift+x', () => {
      dispatch(deleteSelection({ shift: 'left' }));
      dispatch(clearSelection());
    });

    const alwaysActions = alwaysIds.map((alwaysId) =>
      isKnownSpell(alwaysId) ? getSpellById(alwaysId) : undefined,
    );
    let deckIndex = 0;

    return (
      <Container className={className}>
        <StyledName>{'Always casts'}</StyledName>
        <SpellSlots ref={gridRef}>
          {alwaysActions.map((alwaysAction, wandIndex) => (
            <SpellSlot key={wandIndex}>
              <SlottedSpell
                spellAction={alwaysAction}
                wandIndex={wandIndex}
                deckIndex={alwaysAction !== undefined ? deckIndex++ : undefined}
              />
            </SpellSlot>
          ))}
        </SpellSlots>
      </Container>
    );
  },
)``;
