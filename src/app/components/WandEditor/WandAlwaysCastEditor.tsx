import styled from 'styled-components';
import { useRef } from 'react';
import { useAlwaysCastLayout } from '../../redux/hooks';
import { getSpellById } from '../../calc/spells';
import { isKnownSpell } from '../../redux/Wand/spellId';
import { SlottedSpell } from './SlottedSpell';
import { AlwaysCastIndicies } from '../../redux/WandIndex';

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
  flex: 1 1 auto;
  display: flex;
  text-align: left;
  width: fit-content;
  margin-right: 0.6em;
  line-height: 1.3;
  white-space: normal;
  color: var(--color-button);

  &::after {
    content: '';
    border-bottom: 3px dotted #222222;
    height: 0.7em;
    display: inline-block;
    flex: 1 1 auto;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0.3em 0.6em 0.2em 2.2em;

  background-image: url('/data/wand/icon_gun_permanent_actions.png');
  background-position: 0.6em 50%;
  background-size: 1em;
  background-repeat: no-repeat;
  image-rendering: pixelated;
`;

export const WandAlwaysCastEditor = styled(
  ({ className = '' }: { className?: string }) => {
    // const dispatch = useAppDispatch();

    const alwaysIds = useAlwaysCastLayout();
    const gridRef = useRef(null);

    /* Move cursor */
    // useHotkeys('a, h', () => {
    //   dispatch(moveCursor({ by: -1, always: true }));
    // });
    // useHotkeys('d, l', () => {
    //   dispatch(moveCursor({ by: 1, always: true }));
    // });

    // useHotkeys('Backspace, r, shift+x', () => {
    //   dispatch(deleteSelection({ shift: 'left' }));
    //   dispatch(clearSelection());
    // });

    const alwaysActions = alwaysIds.map((alwaysId) =>
      isKnownSpell(alwaysId) ? getSpellById(alwaysId) : undefined,
    );
    let deckIndex = 0;

    return (
      <Container className={className}>
        <StyledName>{'Always casts'}</StyledName>
        <SpellSlots ref={gridRef}>
          {alwaysActions.map((alwaysAction, i) => (
            <SpellSlot key={AlwaysCastIndicies[i]}>
              <SlottedSpell
                spell={alwaysAction}
                alwaysCast={true}
                wandIndex={AlwaysCastIndicies[i]}
                deckIndex={alwaysAction !== undefined ? deckIndex++ : undefined}
              />
            </SpellSlot>
          ))}
        </SpellSlots>
      </Container>
    );
  },
)``;
