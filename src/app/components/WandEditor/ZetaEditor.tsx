import styled from 'styled-components';
import { SlottedSpell } from './SlottedSpell';
import { useZeta } from '../../redux';
import { isKnownSpell } from '../../redux/Wand/spellId';
import { getSpellByActionId } from '../../calc/spells';
import { WandStatName } from './WandStatName';

const SpellSlot = styled.li`
  --grid-layout-gap: 0px;
  --bsize-spell: 38px;

  display: flex;
  flex: 0 1 auto;
  list-style-type: none;
  padding: 0 var(--grid-layout-gap);
`;

const StyledName = styled(WandStatName)`
  flex: 1 1 auto;
  margin-right: 0.6em;
  line-height: 1.3;
  color: var(--color-button);
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
              isKnownSpell(zetaSpellId)
                ? getSpellByActionId(zetaSpellId)
                : undefined
            }
          />
        </SpellSlot>
      </Container>
    ) : null;
  },
)``;
