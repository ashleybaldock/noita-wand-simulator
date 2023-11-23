import styled from 'styled-components/macro';
import { ActionId } from '../../../calc/actionId';
import {
  SpellType,
  getBackgroundUrlForSpellType,
} from '../../../calc/spellTypes';

const _WandAction = ({
  spellType,
  spellSprite,
  spellId,
  className,
}: {
  onDeleteSpell?: () => void;
  className?: string;
  spellId?: ActionId;
  spellType?: SpellType;
  spellSprite?: string;
  keyHint?: string;
}) => {
  return (
    <a
      data-tooltip-id={'tooltip-spellinfo'}
      data-tooltip-content={`${spellId}`}
    >
      <div
        className={className}
        style={{
          backgroundImage: `url('/${spellSprite}'), ${getBackgroundUrlForSpellType(
            spellType,
          )}`,
        }}
      />
    </a>
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

export const DraggableWandAction = styled(WandAction)`
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
