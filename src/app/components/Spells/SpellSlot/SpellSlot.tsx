import { useDrop } from 'react-dnd';
import { useDropRef } from '../../../hooks/useDropRef';
import styled, { type DataAttributes } from 'styled-components';

export const SpellSlot = styled.div<
  {
    highlight?: boolean;
    disabled?: boolean;
  } & DataAttributes
>`
  --size-spell: var(--bsize-spell, 1em);
  --xsize-spell-border: var(--bxsize-spell-border, 0.0625);
  --size-spell-border-width: var(
    --bsize-spell-border-width,
    calc(var(--size-spell) + (2 * var(--xsize-spell-border)))
  );

  width: var(--size-spell);
  height: var(--size-spell);
  padding: var(--size-spell-border-width);

  background-size: cover;
  image-rendering: pixelated;
`;

export const WandEditorSpellSlot = styled(SpellSlot).attrs<{
  key?: string;
  droppable?: boolean;
}>(({ key, droppable = true, ...rest }) => {
  const [{ isOver }, dropConnector] = useDrop(
    () => ({
      accept: 'spell',
      canDrop: () => false,
      collect: (monitor) => ({
        canDrop: monitor.canDrop(),
        isOver: monitor.isOver(),
      }),
    }),
    [],
  );
  const dropRef = useDropRef(dropConnector);
  return {
    ...rest,
    ref: dropRef,
    key,
    highlight: droppable && isOver,
    disabled: !droppable,
  };
})`
  background-image: var(--sprite-full-inventory-box);

  &:hover {
    background-image: var(--sprite-full-inventory-box);
  }

  ${({ highlight, disabled }) =>
    disabled
      ? `background-image: var(--sprite-inventory-box-inactive), var(--sprite-full-inventory-box);`
      : highlight
        ? `background-image: var(--sprite-full-inventory-box-highlight), var(--sprite-full-inventory-box);`
        : `background-image: var(--sprite-full-inventory-box);`}
`;
