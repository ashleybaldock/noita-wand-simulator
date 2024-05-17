import styled from 'styled-components';
import type { ActionId } from '../../../calc/actionId';
import type { SpellType } from '../../../calc/spellTypes';
import { getBackgroundUrlForSpellType } from '../../../calc/spellTypes';
import type { TooltipId } from '../../Tooltips/tooltipId';
import type { CSSProperties } from 'react';

const SpellTypeBorder = styled.div`
  --size-spell: var(--bsize-spell, 48px);

  position: relative;
  min-width: var(--size-spell);
  width: var(--size-spell);
  height: var(--size-spell);

  background-size: cover;
  font-family: monospace;
  font-weight: bold;
  user-select: none;
  image-rendering: pixelated;
`;

const _WandAction = ({
  spellType,
  spellSprite,
  spellId,
  className,
  style,
  tooltipId,
}: {
  onDeleteSpell?: () => void;
  className?: string;
  style?: CSSProperties;
  spellId?: ActionId;
  spellType?: SpellType;
  spellSprite?: string;
  keyHint?: string;
  tooltipId?: TooltipId;
}) => {
  return (
    <div
      {...(tooltipId ?? false
        ? {
            'data-tooltip-id': tooltipId,
            'data-tooltip-content': `${spellId}`,
          }
        : {})}
      className={className}
      style={{
        ...style,
        backgroundImage: `url('/${spellSprite}'), ${getBackgroundUrlForSpellType(
          spellType,
        )}`,
      }}
    />
  );
};

export const WandAction = styled(_WandAction)`
  --size-spell: var(--bsize-spell, 48px);

  position: relative;
  min-width: var(--size-spell);
  width: var(--size-spell);
  height: var(--size-spell);

  background-size: cover;
  font-family: monospace;
  font-weight: bold;
  user-select: none;
  image-rendering: pixelated;
`;

export const DraggableWandAction = styled(WandAction).attrs({
  tooltipId: 'tooltip-spellinfo',
})`
  --transition-in: var(--transition-hover-in);
  --transition-out: var(--transition-hover-out);
  --transition-props: transform;

  transform-origin: center;
  transition-duration: 150ms;
  transition-property: var(--transition-props);
  transition-timing-function: var(--transition-out, ease-out);
  cursor: grab;

  &:hover {
    transform: scale(109%);

    transition-timing-function: var(--transition-out, ease-out);
    transition-property: var(--transition-props);
  }

  &:active {
    cursor: grabbing;
  }
`;
