import styled from 'styled-components';
import type { ActionId } from '../../../calc/actionId';
import type { SpellType } from '../../../calc/spellTypes';
import { getSpriteForSpellType } from '../../../calc/spellTypes';
import type { TooltipId } from '../../Tooltips/tooltipId';
import type { CSSProperties } from 'react';
import type { MergableRef } from '../../../util/mergeRefs';
import { useIcon } from '../../../calc/sprite';
import { getSpellById } from '../../../calc/spells';
import { isNotNullOrUndefined } from '../../../util';

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
  spellId,
  className,
  style,
  tooltipId,
  tooltip = true,
  ref,
}: {
  onDeleteSpell?: () => void;
  className?: string;
  style?: CSSProperties;
  spellId?: ActionId;
  spellType?: SpellType;
  keyHint?: string;
  tooltipId?: TooltipId;
  tooltip?: boolean;
  ref?: MergableRef<HTMLDivElement>;
}) => {
  const spellTypeSpriteName = getSpriteForSpellType(spellType);
  const spellTypeSpritePath = useIcon(spellTypeSpriteName);

  const spellSpritePath = isNotNullOrUndefined(spellId)
    ? getSpellById(spellId).sprite
    : useIcon('icon.spell.unidentified');

  return (
    <div
      ref={ref}
      data-name="WandAction"
      {...(tooltip && isNotNullOrUndefined(spellId)
        ? {
            'data-tooltip-id': 'tooltip-spellinfo',
            'data-tooltip-content': `${spellId}`,
          }
        : {})}
      className={className}
      style={{
        ...style,
        backgroundImage: `${spellSpritePath as string}, ${
          spellTypeSpritePath as string
        }`,
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

  background-position: center, center;
  background-size: 100%, 100%;
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
  --transition-props: background;

  transition-duration: 150ms;
  transition-property: var(--transition-props);
  transition-timing-function: var(--transition-out, ease-out);
  cursor: grab;

  &:hover {
    background-size: 109%, 100%;

    transition-timing-function: var(--transition-out, ease-out);
    transition-property: var(--transition-props);
  }

  &:active {
    cursor: grabbing;
  }
`;
