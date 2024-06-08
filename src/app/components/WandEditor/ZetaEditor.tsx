import styled from 'styled-components';
import { SlottedSpell } from './SlottedSpell';
import { useZeta } from '../../redux';
import { isKnownSpell } from '../../redux/Wand/spellId';
import { getSpellById } from '../../calc/spells';

const SpellSlot = styled.li`
  --grid-layout-gap: 0px;
  --bsize-spell: 38px;

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

  background-image: var(--sprite-action-zeta);
  background-position: 0.6em 50%;
  background-size: 1.2em;
  background-repeat: no-repeat;
  image-rendering: pixelated;
`;

export const ZetaEditor = styled(
  ({ className = '' }: { className?: string }) => {
    const [showZetaSlot, zetaSpellId] = useZeta();
    return showZetaSlot ? (
      <Container className={className}>
        <StyledName>{'Zeta will copy'}</StyledName>
        <SpellSlot>
          <SlottedSpell
            wandIndex={'ZTA'}
            spell={
              isKnownSpell(zetaSpellId) ? getSpellById(zetaSpellId) : undefined
            }
          />
        </SpellSlot>
      </Container>
    ) : null;
  },
)``;
