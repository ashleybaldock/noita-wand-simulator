import styled from 'styled-components';
import type { SpellType } from '../../../calc/spellTypes';
import type { TooltipId } from '../../Tooltips/tooltipId';
import type { CSSProperties } from 'react';
import type { MergableRef } from '../../../util/mergeRefs';
import { useSpritePath, type Sprite } from '../../../calc/sprite';
import { getSpellByActionId } from '../../../calc/spells';
import { isNotNullOrUndefined } from '../../../util';
import { SpellTypeBorder } from '../SpellTypeBorder';
import { isKnownSpell, type SpellId } from '../../../redux/Wand/spellId';

const GridStack = styled.div`
  display: grid;
  grid-template: 1fr/1fr;
  place-content: center;
  place-items: center;

  & > * {
    grid-row: 1/-1;
    grid-column: 1/-1;
  }
`;

const SpellSprite = styled.div`
  position: relative;
  min-width: var(--size-spell);
  width: var(--size-spell);
  height: var(--size-spell);

  background-position: center;
  background-size: 100%;
  background-image: var(--sprite-spell);
  font-family: monospace;
  font-weight: bold;
  user-select: none;
  image-rendering: pixelated;
`;

const _WandAction = ({
  spellId = null,
  spellType = 'other',
  spellTypeBorder = true,
  spellSprite,
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
  spellId: SpellId;
  spellType?: SpellType;
  spellTypeBorder?: boolean;
  spellSprite?: Sprite;
  keyHint?: string;
  tooltipId?: TooltipId;
  tooltip?: boolean;
  ref?: MergableRef<HTMLDivElement>;
  locked?: boolean;
}) => {
  const spell = isKnownSpell(spellId)
    ? getSpellByActionId(spellId)
    : {
        id: spellId,
        type: spellType,
        sprite: spellSprite?.path ?? useSpritePath('icon.spell.unidentified'),
      };

  return (
    <GridStack
      className={className}
      ref={ref}
      data-name="WandAction"
      {...(tooltip &&
        tooltipId === 'tooltip-spellinfo' &&
        isNotNullOrUndefined(spellId) && {
          'data-tooltip-id': 'tooltip-spellinfo',
          'data-tooltip-content': spellId,
        })}
      {...(tooltip &&
        tooltipId === 'tooltip-actionhint' && {
          'data-tooltip-id': 'tooltip-actionhint',
          'data-tooltip-content': 'lockedspell',
        })}
    >
      {spellTypeBorder && (
        <SpellTypeBorder spellType={spellType}></SpellTypeBorder>
      )}
      <SpellSprite
        style={{
          ...style,
          '--sprite-spell': spell.sprite,
        }}
      ></SpellSprite>
    </GridStack>
  );
};

export const WandAction = styled(_WandAction)`
  --size-spell: var(--bsize-spell, 48px);

  position: relative;

  font-family: monospace;
  font-weight: bold;
  user-select: none;
  image-rendering: pixelated;
`;

export const LockedWandAction = styled(WandAction).attrs({
  tooltip: true,
  tooltipId: 'tooltip-actionhint',
  locked: true,
})`
  & > ${SpellSprite} {
    background-position: center, center;
    background-repeat: no-repeat;
    background-size: 100%, 50%;
    background-image:
      linear-gradient(145deg, #000a 20%, #0002 30% 50%, #000a 70%),
      var(--sprite-unidentified-spell);
    background-blend-mode: hue, saturation;
  }
`;

export const DraggableWandAction = styled(WandAction).attrs({
  tooltip: true,
  tooltipId: 'tooltip-spellinfo',
})`
  --transition-in: var(--transition-hover-in);
  --transition-out: var(--transition-hover-out);
  --transition-props: transform;

  transition-property: var(--transition-props);
  transition-timing-function: var(--transition-out, ease-out);
  cursor: grab;

  filter: drop-shadow(0.2ch 0.2ch 1px #000a) drop-shadow(0 0 1px #fff1);

  & > ${SpellSprite} {
    transform: scale(1);

    transition-duration: 250ms;
    transition-timing-function: var(--transition-out, ease-out);
    transition-property: var(--transition-props);

    filter: drop-shadow(0 0 0.5px #0008) drop-shadow(1px 1px 0.25px #0008);
  }
  &:hover > ${SpellSprite} {
    transform: scale(1.09);

    transition-duration: 80ms;
    transition-timing-function: var(--transition-out, ease-in);
    transition-property: var(--transition-props);
  }

  &:active {
    cursor: grabbing;
  }
`;

export const DragPreviewWandAction = styled(WandAction).attrs({
  tooltip: false,
})`
  cursor: grabbing;

  filter: drop-shadow(0.5ch 0.5ch 3px #000a);

  & > ${SpellSprite} {
  }
  &:hover > ${SpellSprite} {
  }

  &:active {
    cursor: grabbing;
  }
`;
