import styled from 'styled-components';
import type { CSSProperties } from 'react';
import { useSpellSequence } from '../../redux';
import { WandAction } from '../Spells/WandAction';

const StyledDiv = styled.div`
  display: flex;
  padding: 4px 0.5ch;
  column-gap: 2px;
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
      {spells.map(({ id, type }) => (
        <SpellSequenceAction spellId={id} spellType={type} />
      ))}
    </StyledDiv>
  );
};
