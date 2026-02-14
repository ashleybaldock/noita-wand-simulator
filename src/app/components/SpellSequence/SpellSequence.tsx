import styled from 'styled-components';
import type { CSSProperties } from 'react';
import { useSpellSequence } from '../../redux';
import { WandAction } from '../Spells/WandAction';

const StyledDiv = styled.div`
  display: flex;
  padding: 4px 0.5ch;
  column-gap: 2px;
  --size-spell: 24px;
  --offset-spellsequence: var(--size-spell);
  height: var(--offset-spellsequence);
  background-color: var(--color-base-background);
  inset: var(--top-banner-height) auto auto auto;
  z-index: var(--zindex-spellsequence);
  margin: 0 0 calc(var(--offset-spellsequence) * -1) 0;
  padding: 0 0.2ch 0 0.2ch;
  box-shadow:
    0 0 0 2px var(--color-base-background),
    0 0 0 3px var(--color-tab-border-inactive);
`;

const SpellSequenceAction = styled(WandAction)`
  --size-spell: 24px;
`;

export const SpellSequence = ({
  style,
  className,
}: {
  style?: CSSProperties;
  className?: string;
}) => {
  const spells = useSpellSequence();

  return (
    <StyledDiv style={style} className={className} data-name={'SpellSequence'}>
      {spells.map(({ id, type }, i) => (
        <SpellSequenceAction spellId={id} spellType={type} key={`${i}-${id}`} />
      ))}
    </StyledDiv>
  );
};
