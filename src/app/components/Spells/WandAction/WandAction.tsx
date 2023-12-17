import styled from 'styled-components';
import { ActionId } from '../../../calc/actionId';
import {
  SpellType,
  getBackgroundUrlForSpellType,
} from '../../../calc/spellTypes';
import { TooltipId } from '../../Tooltips';

const _WandAction = ({
  spellType,
  spellSprite,
  spellId,
  className,
  tooltipId,
}: {
  onDeleteSpell?: () => void;
  className?: string;
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
