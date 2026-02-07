import styled from 'styled-components';
import type { ActionId } from '../../../calc/actionId';
import type { SpellType } from '../../../calc/spellTypes';
import { getSpriteForSpellType } from '../../../calc/spellTypes';
import type { TooltipId } from '../../Tooltips/tooltipId';
import type { CSSProperties } from 'react';
import type { MergableRef } from '../../../util/mergeRefs';
import { useIcon } from '../../../calc/sprite';
import { getSpellByActionId } from '../../../calc/spells';
import { isNotNullOrUndefined } from '../../../util';

const _WandAction = ({
  spellType,
  spellId,
  className,
  style,
  tooltipId = 'tooltip-spellinfo',
  tooltip = true,
  ref,
  locked = false,
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
  locked?: boolean;
}) => {
  const spellTypeSpriteName = getSpriteForSpellType(spellType);
  const spellTypeSpritePath = useIcon(spellTypeSpriteName);

  const spellSpritePath = isNotNullOrUndefined(spellId)
    ? getSpellByActionId(spellId).sprite
    : useIcon('icon.spell.unidentified');

  return (
    <div
      ref={ref}
      data-name="WandAction"
      {...(tooltip && isNotNullOrUndefined(spellId)
        ? {
            'data-tooltip-id': `${tooltipId}`,
            'data-tooltip-content': `${locked ? 'lockedspell' : spellId}`,
          }
        : {})}
      className={className}
      style={{
        ...style,
        '--data-spell-sprite': spellSpritePath,
        '--data-spelltype-sprite': spellTypeSpritePath,
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
  background-image: var(--data-spell-sprite), var(--data-spelltype-sprite);
  font-family: monospace;
  font-weight: bold;
  user-select: none;
  image-rendering: pixelated;
`;

export const LockedWandAction = styled(_WandAction).attrs({
  tooltip: true,
  tooltipId: 'tooltip-actionhint',
})`
  --size-spell: var(--bsize-spell, 48px);

  position: relative;
  min-width: var(--size-spell);
  width: var(--size-spell);
  height: var(--size-spell);

  background-position: center, center;
  background-size: 80%, 100%;
  background-repeat: no-repeat;
  background-image:
    var(--sprite-unidentified-spell), var(--data-spelltype-sprite);
  font-family: monospace;
  font-weight: bold;
  user-select: none;
  image-rendering: pixelated;
  background-size: 100%, 100%, 50%;
  background-repeat: no-repeat;
  background-image:
    linear-gradient(145deg, #000a 20%, #0002 30% 50%, #000a 70%),
    var(--data-spelltype-sprite), var(--sprite-unidentified-spell);
  font-family: monospace;
  font-weight: bold;
  user-select: none;
  image-rendering: pixelated;
  background-blend-mode: hue, saturation;
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
