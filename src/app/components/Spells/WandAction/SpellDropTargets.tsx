import styled from 'styled-components';
import { WandSelection } from '../../../redux/Wand/wandSelection';
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
  padding: 2px 4px 2px 4px;

  border-style: dashed hidden;
  border-width: var(--selection-bdwidth);
  border-color: transparent;

  ${({ selection }) =>
    selection !== 'none'
      ? `
  padding: 2px 4px 2px 4px;
  background-color: var(--selection-bgcolor);
  border-top-color: var(--selection-bdcolor);
  border-bottom-color: var(--selection-bdcolor);
    `
      : ''}
  ${({ selection }) =>
    selection === 'start'
      ? `
  padding: 2px 4px 2px 4px;
  border-radius: var(--selection-bdradius) 0 0 var(--selection-bdradius);
    `
      : ''}
  ${({ selection }) =>
    selection === 'end'
      ? `
  padding: 2px 4px 2px 4px;
  border-radius: 0 var(--selection-bdradius) var(--selection-bdradius) 0;
    `
      : ''}
  ${({ selection }) =>
    selection === 'single'
      ? `
  padding: 2px 4px 2px 4px;
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
  onClick: React.MouseEventHandler<HTMLElement>;
}>`
  background-color: transparent;
  position: absolute;
  height: 100%;
  box-sizing: border-box;

  cursor: e-resize;

  pointer-events: ${({ isDraggingAction, isDraggingSelect }) =>
    isDraggingAction || isDraggingSelect ? 'auto' : 'none'};

  &&::after {
    content: '';
    display: block;
    position: absolute;
    height: 58px;
    --width: 12px;
    width: var(--width);
    top: 0;
    left: calc(50% - var(--width) / 2);

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
  width: var(--sizes-before-droptarget-width);
  left: -15px;
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
  width: var(--sizes-after-droptarget-width);
  right: -15px;
  z-index: var(--zindex-insert-after);

  &&::after {
    ${({ isDraggingOver }) =>
      isDraggingOver
        ? `
    cursor: w-resize;
          `
        : `
    cursor: text;
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
