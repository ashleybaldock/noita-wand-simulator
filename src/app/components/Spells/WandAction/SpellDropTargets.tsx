import styled from 'styled-components';
import type { WandSelection } from '../../../redux/Wand/wandSelection';
import { WithDebugHints } from '../../Debug';

export const DropTargetMain = styled.div<{
  selection: WandSelection;
}>`
  --selection-bdcolor: #00dbff;
  --selection-bgcolor: #0000ff78;
  --selection-bdradius: 3px;
  --selection-bdwidth: 1px;
  --selection-bdstyle: dashed;

  position: relative;
  height: 100%;
  padding: calc(var(--bsize-spell) * 0.04) calc(var(--bsize-spell) * 0.08);

  border-style: dashed hidden;
  border-width: var(--selection-bdwidth);
  border-color: transparent;

  ${({ selection }) =>
    selection !== 'none'
      ? `
  background-color: var(--selection-bgcolor);
  border-top-color: var(--selection-bdcolor);
  border-bottom-color: var(--selection-bdcolor);
    `
      : ''}
  ${({ selection }) =>
    selection === 'start'
      ? `
  border-radius: var(--selection-bdradius) 0 0 var(--selection-bdradius);
    `
      : ''}
  ${({ selection }) =>
    selection === 'end'
      ? `
  border-radius: 0 var(--selection-bdradius) var(--selection-bdradius) 0;
    `
      : ''}
  ${({ selection }) =>
    selection === 'single'
      ? `
  border-radius: var(--selection-bdradius);
    `
      : ''}
`;

const DragDropTarget = styled.div<{
  enabled: boolean;
  hint?: boolean;
  isBeingDragged: boolean;
  isDraggingAction: boolean;
  isDraggingOver: boolean;
  isDraggingSelect: boolean;
  selection: WandSelection;
  $cursor?: 'none' | 'caret';
  onClick: React.MouseEventHandler<HTMLElement>;
}>`
  background-color: transparent;
  position: absolute;
  height: 100%;
  box-sizing: border-box;

  cursor: e-resize;

  pointer-events: ${({ isDraggingAction, isDraggingSelect }) =>
    isDraggingAction || isDraggingSelect ? 'auto' : 'none'};

  &::before {
    z-index: var(--zindex-cursor-current);
    --cursor-container-width: calc(var(--bsize-spell) / 4);
    content: '';
    position: absolute;
    height: calc(var(--bsize-spell) * 1.22);
    width: var(--cursor-container-width);
    top: calc(var(--bsize-spell) * -0.03);
    left: calc(50% - (var(--cursor-container-width) / 2));

    image-rendering: pixelated;
    background-repeat: no-repeat, repeat-y;
    background-size: 100%;
    background-position: top center, center center;

    ${({ $cursor = 'none' }) => `
      ${
        $cursor === 'caret'
          ? `
    background-image: url('/data/inventory/cursor-top.png'),
      url('/data/inventory/cursor-mid.png');
      `
          : ``
      }
        ${
          $cursor === 'none'
            ? `
      opacity: 0;
      `
            : ``
        }
    `}
  }

  &::after {
    --cursor-container-width: calc(var(--bsize-spell) / 4);

    content: '';
    display: block;
    position: absolute;
    height: calc(var(--bsize-spell) * 1.22);
    width: var(--cursor-container-width);
    top: calc(var(--bsize-spell) * -0.03);
    left: calc(50% - (var(--cursor-container-width) / 2));

    border: none;
    padding: 0;

    image-rendering: pixelated;

    background-repeat: no-repeat;
    background-size: 100%;
    background-position: center center;

    pointer-events: ${({ isDraggingAction, isDraggingSelect }) =>
      isDraggingAction || isDraggingSelect ? 'none' : 'auto'};
  }

  ${WithDebugHints} && {
    background-color: ${({ isDraggingAction, isDraggingSelect }) =>
      isDraggingAction || isDraggingSelect ? 'green' : 'transparent'};
  }
  ${WithDebugHints} &&::after {
    ${({ isDraggingOver }) =>
      isDraggingOver
        ? `
        background-color: yellow;
        `
        : `
        background-color: transparent;
        `}
  }
`;
export const DragDropTargetBefore = styled(DragDropTarget)`
  top: 0;
  width: calc(var(--bsize-spell) * 0.625);
  left: calc(var(--bsize-spell) * -0.3125);
  z-index: var(--zindex-insert-before);

  &&::after {
    ${({ isDraggingOver }) =>
      isDraggingOver
        ? `
    cursor: e-resize;
          `
        : `
    cursor: text;
      `}
    ${({ selection }) =>
      selection === 'start' || selection === 'single'
        ? `
    cursor: ew-resize;
    background-image: url('/data/inventory/cursor-select-mid.png');
          `
        : ``}
  }

  ${WithDebugHints} && {
    background-color: rgba(255, 255, 0, 0.2);
  }
`;
export const DragDropTargetAfter = styled(DragDropTarget)`
  top: 0;
  width: calc(var(--bsize-spell) * 0.625);
  right: calc(var(--bsize-spell) * -0.3125);
  z-index: var(--zindex-insert-after);

  &&::after {
    ${({ isDraggingOver, isDraggingAction, isDraggingSelect }) => `
    cursor: text;

      ${
        isDraggingOver &&
        `
    cursor: w-resize;
        `
      }

      ${
        isDraggingOver &&
        isDraggingSelect &&
        `
        `
      }

      ${
        isDraggingOver &&
        isDraggingAction &&
        `
        `
      }
      `}

    ${({ selection }) =>
      selection === 'end' || selection === 'single'
        ? `
    cursor: ew-resize;
    background-image: url('/data/inventory/cursor-select-mid.png');
          `
        : ``}
  }

  ${WithDebugHints} && {
    background-color: rgba(255, 0, 0, 0.2);
  }
`;
