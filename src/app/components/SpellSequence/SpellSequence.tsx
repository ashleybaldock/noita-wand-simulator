import styled from 'styled-components';
import type { CSSProperties } from 'react';
import { useSpellSequence } from '../../redux';
import { WandAction } from '../Spells/WandAction';
import { StickyGroup } from '../Sticky/StickyGroup';
import { StickyHeading } from '../Sticky/StickyHeading';

const StyledDiv = styled.div`
  display: flex;
  padding: 4px 0.5ch;
  column-gap: 2px;
  --size-spell: var(--spellsequence-height);
  --offset-spellsequence: var(--size-spell);
  height: var(--spellsequence-height);
  background-color: var(--color-base-background);
  inset: var(--top-banner-height) auto auto auto;
  margin: 0 0 calc(var(--spellsequence-height) * -1) 0;
  padding: 0 0.2ch 0 0.2ch;
  box-shadow:
    0 0 0 2px var(--color-base-background),
    0 0 0 3px var(--color-tab-border-inactive);

  inset: var(--top-banner-height) auto var(--footer-offset, 0) auto;
  position: sticky;
  /*   inset: auto auto var(--footer-offset, 0) 0; */
  padding: 0 0.5ch 0 0.5ch;
  display: flex;
  padding: 4px 0.5ch;
  column-gap: 2px;
  --size-spell: 24px;
  height: var(--spellsequence-height);
  background-color: var(--color-base-background);
  inset: var(--top-banner-height) auto auto auto;
  margin: 0;
  box-shadow:
    0 0 0 2px var(--color-base-background),
    0 0 0 3px var(--color-tab-border-inactive);
  z-index: var(--zindex-spellsequence);
  height: var(--spellsequence-height);
  margin: 0;

  & ~ ${StickyGroup}, & ~ ${StickyGroup} h2,
  & ~ ${StickyHeading}, & ~ ${StickyHeading} h2 {
    --sticky-top: calc(var(--top-banner-height) + var(--spellsequence-height));
    padding-bottom: 0;
    top: calc(var(--top-banner-height) + var(--spellsequence-height));
    position: sticky;
    padding-bottom: 0;
  }

  * :has(+ &) {
    z-index: calc(var(--zindex-spellsequence) + 1);
  }
`;

const SpellSequenceAction = styled(WandAction)`
  --size-spell: 24px;
`;

export const _SpellSequence = ({
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

export const SpellSequence = styled(_SpellSequence)``;
