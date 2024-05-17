import styled from 'styled-components';
import type { WandSelection } from '../../../redux/Wand/wandSelection';
import type { CursorStyle } from './Cursor';

export type DropHint = 'none' | 'forbidden' | 'shiftleft' | 'shiftright';

type BackgroundPart = {
  'background-image': string[];
  'background-repeat': string[];
  'background-size': string[];
  'background-position': string[];
};

const cursors: Record<CursorStyle, Partial<BackgroundPart>> = {
  caret: {
    'background-image': [
      `url('/data/inventory/cursor-top.png')`,
      `
      url('/data/inventory/cursor-mid.png')`,
    ],
    'background-repeat': [`no-repeat`, `repeat-y`],
    'background-size': [`100%`, `100%`],
    'background-position': [`top center`, `center center`],
  },
  none: {
    'background-image': [],
    'background-repeat': [],
    'background-size': [],
    'background-position': [],
  },
};
const dropHints: Record<DropHint, Partial<BackgroundPart>> = {
  none: {},
  forbidden: {},
  shiftleft: {},
  shiftright: {},
};
const selections: Record<WandSelection, Partial<BackgroundPart>> = {
  none: {},
  start: {},
  thru: {},
  end: {},
  single: {},
};

export const BetweenSpellsDropTarget = styled.div<{
  onClick: React.MouseEventHandler<HTMLElement>;

  $enabled: boolean;
  $pointerEvents: boolean;
  $cursor: CursorStyle;

  $dropHint: DropHint;

  $selection: WandSelection;

  $isDraggingAction: boolean;
  $isDraggingOver: boolean;
  $isDraggingSelect: boolean;
}>`
  background-color: transparent;
  position: absolute;
  height: 100%;
  box-sizing: border-box;

  cursor: e-resize;

  pointer-events: ${({ $pointerEvents }) => ($pointerEvents ? 'auto' : 'none')};

  &:hover::before {
    background-color: #f00c;
  }
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

    ${({ $cursor, $dropHint }) => `
      ${
        $dropHint === 'shiftleft' || $dropHint === 'shiftright'
          ? `filter: brightness(2);`
          : `filter: brightness(0.5);`
      }

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

  /* Source for selection drag */
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

    pointer-events: ${({ $pointerEvents }) =>
      $pointerEvents ? 'none' : 'auto'};
  }
`;
// ${WithDebugHints} && {
//   background-color: ${({ $isDraggingAction, $isDraggingSelect }) =>
//     $isDraggingAction || $isDraggingSelect ? 'green' : 'transparent'};
// }
// ${WithDebugHints} &&::after {
//   ${({ $isDraggingOver }) =>
//     $isDraggingOver
//       ? `
//       background-color: yellow;
//       `
//       : `
//       background-color: transparent;
//       `}
// }
