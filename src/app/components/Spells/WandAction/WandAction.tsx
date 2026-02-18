import styled from 'styled-components';
import type { ActionId } from '../../../calc/actionId';
import type { SpellType } from '../../../calc/spellTypes';
import type { TooltipId } from '../../Tooltips/tooltipId';
import type { CSSProperties } from 'react';
import type { MergableRef } from '../../../util/mergeRefs';
import { useIcon } from '../../../calc/sprite';
import { getSpellByActionId } from '../../../calc/spells';
import { isNotNullOrUndefined } from '../../../util';
import { SpellTypeBorder } from '../SpellTypeBorder';

const GridStack = styled.div`
  display: grid;
  grid-template: 1fr/1fr;
  place-content: center;
  place-items: center;

  & > * {
    grid-row: 1/-1;
    grid-column: 1/-1;
    width: 100%;
    height: 100%;
  }
`;

const SpellSprite = styled.div`
  --size-spell: var(--bsize-spell, 48px);

  position: relative;
  min-width: var(--size-spell);
  width: var(--size-spell);
  height: var(--size-spell);

  background-position: center;
  background-size: 100%;
  background-image: var(--data-spell-sprite);
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
  const spellSpritePath = isNotNullOrUndefined(spellId)
    ? getSpellByActionId(spellId).sprite
    : useIcon('icon.spell.unidentified');

  return (
    <GridStack
      className={className}
      ref={ref}
      data-name="WandAction"
      {...(tooltip && isNotNullOrUndefined(spellId)
        ? {
            'data-tooltip-id': `${tooltipId}`,
            'data-tooltip-content': `${locked ? 'lockedspell' : spellId}`,
          }
        : {})}
    >
      <SpellTypeBorder spellType={spellType}></SpellTypeBorder>
      <SpellSprite
        style={{
          ...style,
          '--data-spell-sprite': spellSpritePath,
        }}
      ></SpellSprite>
    </GridStack>
  );
};

export const WandAction = styled(_WandAction)`
  --size-spell: var(--bsize-spell, 48px);

  position: relative;
  min-width: var(--size-spell);
  width: var(--size-spell);
  height: var(--size-spell);

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
  --transition-props: transform;

  transition-duration: 150ms;
  transition-property: var(--transition-props);
  transition-timing-function: var(--transition-out, ease-out);
  cursor: grab;

  filter: drop-shadow(0.2ch 0.2ch 1px #000a) drop-shadow(0 0 1px #fff1);

  transform: scale(1);

  &:hover {
    transform: scale(1.09);

    transition-timing-function: var(--transition-out, ease-out);
    transition-property: var(--transition-props);
  }

  &:active {
    cursor: grabbing;
  }
`;
