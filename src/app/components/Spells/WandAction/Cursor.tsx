import styled from 'styled-components/macro';
import { WithDebugHints } from '../../Debug';

export const Cursor = styled.div<{
  position: CursorPosition;
  isDraggingSelect: boolean;
  isDraggingAction: boolean;
  isDraggingSelectOver: boolean;
}>`
  z-index: var(--zindex-cursor-current);

  position: absolute;
  height: 58px;
  width: 12px;
  top: -2px;
  ${({ position }) =>
    position === 'before'
      ? 'left: -6px;'
      : position === 'after'
      ? 'right: -6px;'
      : 'left: -6px;'}

  ${({ isDraggingSelect, isDraggingAction }) =>
    isDraggingSelect || !isDraggingAction
      ? `pointer-events: auto;`
      : `pointer-events: none;`}

  image-rendering: pixelated;
  background-image: url('/data/inventory/cursor-top.png'),
    url('/data/inventory/cursor-mid.png');
  background-repeat: no-repeat;
  background-size: 100%;
  background-position: top center, center center;

  ${WithDebugHints} && {
    ${({ isDraggingSelectOver }) =>
      isDraggingSelectOver
        ? `background-color: rgba(255, 0, 0, 0.4);`
        : `background-color: rgba(255, 0, 255, 0.4);`}
  }
`;

export type CursorPosition = 'none' | 'before' | 'after';
