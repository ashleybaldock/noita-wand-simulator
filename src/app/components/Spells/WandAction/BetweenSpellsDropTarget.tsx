import styled from 'styled-components';
import type { WandSelection } from '../../../redux/Wand/wandSelection';
import type { CursorStyle } from './Cursor';
import { mergeRefs, type MergableRef } from '../../../util/mergeRefs';
import { emptyBackgroundPart, type BackgroundPart } from './BackgroundPart';
import { useDrag, useDrop } from 'react-dnd';
import {
  isDragItemSelect,
  isDragItemSpell,
  type DragItem,
  type DragItemSelect,
  type DragItemSpell,
} from './DragItems';
import type { WandIndex } from '../../../redux/WandIndex';
import { isMainWandIndex } from '../../../redux/WandIndex';
import type { DropHint, DropHints } from './DropHint';
import { useMergedBackgrounds } from './useMergeBackgrounds';
import { useSelecting } from '../../../redux';

const cursors: Record<CursorStyle, BackgroundPart> = {
  caret: {
    'background-image': [
      `url('/data/inventory/cursor-top.png')`,
      `url('/data/inventory/cursor-mid.png')`,
    ],
    'background-repeat': [`no-repeat`, `repeat-y`],
    'background-size': [
      `var(--cursor-container-width)`,
      `var(--cursor-container-width) `,
    ],
    'background-position': [`center top`, `center center`],
    'cursor': [],
  },
  none: {
    'background-image': [],
    'background-repeat': [],
    'background-size': [],
    'background-position': [],
    'cursor': [],
  },
};
const dropHints: DropHints = {
  none: emptyBackgroundPart,
  dragging: {
    none: emptyBackgroundPart,
    forbidden: emptyBackgroundPart,
    swap: emptyBackgroundPart,
    replace: emptyBackgroundPart,
    shiftleft: {
      'background-image': [
        'linear-gradient(135deg, transparent, yellow 50%, transparent 60%)',
        'linear-gradient(225deg, transparent, yellow 50%, transparent 60%)',
      ],
      'background-repeat': [`no-repeat`, `no-repeat`],
      'background-size': [`100%`, `100%`],
      'background-position': [`center`, `center`],
      'cursor': [],
    },
    shiftright: {
      'background-image': [
        'linear-gradient(45deg, transparent, orange 50%, transparent 60%)',
        'linear-gradient(315deg, transparent, orange 50%, transparent 60%)',
      ],
      'background-repeat': [`no-repeat`, `no-repeat`],
      'background-size': [`100%`, `100%`],
      'background-position': [`center`, `center`],
      'cursor': [],
    },
  },
  overCanDrop: {
    none: emptyBackgroundPart,
    swap: emptyBackgroundPart,
    replace: emptyBackgroundPart,
    forbidden: {
      'background-image': ['linear-gradient(45deg, white, red, white)'],
      'background-repeat': [`no-repeat`],
      'background-size': [`100%`],
      'background-position': [`center`],
      'cursor': [],
    },
    shiftleft: {
      'background-image': [
        'linear-gradient(135deg, transparent, yellow 50%, transparent 60%)',
        'linear-gradient(225deg, transparent, yellow 50%, transparent 60%)',
      ],
      'background-repeat': [`no-repeat`, `no-repeat`],
      'background-size': [`100%`, `100%`],
      'background-position': [`center`, `center`],
      'cursor': [],
    },
    shiftright: {
      'background-image': [
        'linear-gradient(45deg, transparent, orange 50%, transparent 60%)',
        'linear-gradient(315deg, transparent, orange 50%, transparent 60%)',
      ],
      'background-repeat': [`no-repeat`, `no-repeat`],
      'background-size': [`100%`, `100%`],
      'background-position': [`center`, `center`],
      'cursor': [],
    },
  },
  over: {
    none: emptyBackgroundPart,
    swap: emptyBackgroundPart,
    replace: emptyBackgroundPart,
    forbidden: {
      'background-image': ['linear-gradient(45deg, white, red, white)'],
      'background-repeat': [`no-repeat`],
      'background-size': [`100%`],
      'background-position': [`center`],
      'cursor': [],
    },
    shiftleft: {
      'background-image': [
        'linear-gradient(135deg, transparent, yellow 50%, transparent 60%)',
        'linear-gradient(225deg, transparent, yellow 50%, transparent 60%)',
      ],
      'background-repeat': [`no-repeat`, `no-repeat`],
      'background-size': [`100%`, `100%`],
      'background-position': [`center`, `center`],
      'cursor': [],
    },
    shiftright: {
      'background-image': [
        'linear-gradient(45deg, transparent, orange 50%, transparent 60%)',
        'linear-gradient(315deg, transparent, orange 50%, transparent 60%)',
      ],
      'background-repeat': [`no-repeat`, `no-repeat`],
      'background-size': [`100%`, `100%`],
      'background-position': [`center`, `center`],
      'cursor': [],
    },
  },
};
const selectHints: DropHints = {
  none: emptyBackgroundPart,
  dragging: {
    none: emptyBackgroundPart,
    forbidden: emptyBackgroundPart,
    swap: emptyBackgroundPart,
    replace: emptyBackgroundPart,
    shiftleft: {
      'background-image': [
        'linear-gradient(135deg, transparent, yellow 50%, transparent 60%)',
        'linear-gradient(225deg, transparent, yellow 50%, transparent 60%)',
      ],
      'background-repeat': [`no-repeat`, `no-repeat`],
      'background-size': [`100%`, `100%`],
      'background-position': [`center`, `center`],
      'cursor': [],
    },
    shiftright: {
      'background-image': [
        'linear-gradient(45deg, transparent, orange 50%, transparent 60%)',
        'linear-gradient(315deg, transparent, orange 50%, transparent 60%)',
      ],
      'background-repeat': [`no-repeat`, `no-repeat`],
      'background-size': [`100%`, `100%`],
      'background-position': [`center`, `center`],
      'cursor': [],
    },
  },
  overCanDrop: {
    none: emptyBackgroundPart,
    swap: emptyBackgroundPart,
    replace: emptyBackgroundPart,
    forbidden: {
      'background-image': ['linear-gradient(45deg, white, red, white)'],
      'background-repeat': [`no-repeat`],
      'background-size': [`100%`],
      'background-position': [`center`],
      'cursor': [],
    },
    shiftleft: {
      'background-image': [
        'linear-gradient(135deg, transparent, yellow 50%, transparent 60%)',
        'linear-gradient(225deg, transparent, yellow 50%, transparent 60%)',
      ],
      'background-repeat': [`no-repeat`, `no-repeat`],
      'background-size': [`100%`, `100%`],
      'background-position': [`center`, `center`],
      'cursor': [],
    },
    shiftright: {
      'background-image': [
        'linear-gradient(45deg, transparent, orange 50%, transparent 60%)',
        'linear-gradient(315deg, transparent, orange 50%, transparent 60%)',
      ],
      'background-repeat': [`no-repeat`, `no-repeat`],
      'background-size': [`100%`, `100%`],
      'background-position': [`center`, `center`],
      'cursor': [],
    },
  },
  over: {
    none: emptyBackgroundPart,
    swap: emptyBackgroundPart,
    replace: emptyBackgroundPart,
    forbidden: {
      'background-image': ['linear-gradient(45deg, white, red, white)'],
      'background-repeat': [`no-repeat`],
      'background-size': [`100%`],
      'background-position': [`center`],
      'cursor': [],
    },
    shiftleft: {
      'background-image': [
        'linear-gradient(135deg, transparent, yellow 50%, transparent 60%)',
        'linear-gradient(225deg, transparent, yellow 50%, transparent 60%)',
      ],
      'background-repeat': [`no-repeat`, `no-repeat`],
      'background-size': [`100%`, `100%`],
      'background-position': [`center`, `center`],
      'cursor': [],
    },
    shiftright: {
      'background-image': [
        'linear-gradient(45deg, transparent, orange 50%, transparent 60%)',
        'linear-gradient(315deg, transparent, orange 50%, transparent 60%)',
      ],
      'background-repeat': [`no-repeat`, `no-repeat`],
      'background-size': [`100%`, `100%`],
      'background-position': [`center`, `center`],
      'cursor': [],
    },
  },
};
const selections: Record<WandSelection, BackgroundPart> = {
  none: emptyBackgroundPart,
  start: {
    'background-image': [
      `cursor-select-top-start.png`,
      `url('/data/inventory/cursor-select-mid.png')`,
      `cursor-select-bottom-start.png`,
      `linear-gradient(to right, transparent, var(--color-selection-bg) 30%)`,
    ],
    'background-repeat': [`no-repeat`, `repeat-y`, `no-repeat`, `no-repeat`],
    'background-size': [
      `var(--cursor-container-width)`,
      `var(--cursor-container-width)`,
      `var(--cursor-container-width)`,
      `100%`,
    ],
    'background-position': [
      `center top`,
      `center center`,
      `center bottom`,
      `center`,
    ],
    'cursor': ['ew-resize'],
  },
  thru: {
    'background-image': [
      `linear-gradient(to right, var(--color-selection-bg), var(--color-selection-bg))`,
    ],
    'background-repeat': [`no-repeat`],
    'background-size': [`100%`],
    'background-position': [`center`],
    'cursor': [''],
  },
  end: {
    'background-image': [
      `cursor-select-top-end.png`,
      `url('/data/inventory/cursor-select-mid.png')`,
      `cursor-select-bottom-end.png`,
      `linear-gradient(to left, transparent, var(--color-selection-bg) 30%)`,
    ],
    'background-repeat': [`no-repeat`, `repeat-y`, `no-repeat`, `no-repeat`],
    'background-size': [
      `var(--cursor-container-width)`,
      `var(--cursor-container-width)`,
      `var(--cursor-container-width)`,
      `100%`,
    ],
    'background-position': [
      `center top`,
      `center center`,
      `center bottom`,
      `center`,
    ],
    'cursor': ['ew-resize'],
  },
  single: {
    'background-image': [
      `url('/data/inventory/cursor-select-mid.png')`,
      `linear-gradient(to right, transparent, var(--color-selection-bg) 20%, transparent 80%)`,
    ],
    'background-repeat': [`no-repeat`],
    'background-size': [`100%`],
    'background-position': [`center`],
    'cursor': ['ew-resize'],
  },
};

const StyledBetweenSpellsDropTarget = styled.div<{
  onClick: React.MouseEventHandler<HTMLElement>;

  $pointerEvents: boolean;
}>`
  background-color: transparent;
  position: absolute;
  height: 100%;
  box-sizing: border-box;
  image-rendering: pixelated;

  cursor: e-resize;
  --cursor-container-width: calc(var(--bsize-spell) / 4);

  pointer-events: ${({ $pointerEvents }) => ($pointerEvents ? 'auto' : 'none')};

  &&:hover::before {
    background-color: #f00c;
  }
  &::before {
    content: '';

    position: absolute;
    top: calc(var(--bsize-spell) * -0.03);
    left: calc(50% - (var(--cursor-container-width) / 2));
    height: calc(var(--bsize-spell) * 1.22);
    width: var(--cursor-container-width);

    z-index: var(--zindex-cursor-current);

    image-rendering: pixelated;
  }

  /* Source for selection drag */
  &::after {
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

    pointer-events: ${({ $pointerEvents }) =>
      $pointerEvents ? 'none' : 'auto'};
  }
`;
// ${WithDebugHints} && {
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

// ${({ $cursor, $dropHint }) => `
//   ${
//     $dropHint === 'shiftleft' || $dropHint === 'shiftright'
//       ? `filter: brightness(2);`
//       : `filter: brightness(0.5);`
//   }

//   ${
//     $cursor === 'caret'
//       ? `
// background-image: url('/data/inventory/cursor-top.png'),
//   url('/data/inventory/cursor-mid.png');
//   `
//       : ``
//   }
//     ${
//       $cursor === 'none'
//         ? `
//   opacity: 0.6;
//   `
//         : ``
//     }
// `}
export const BetweenSpellsDropTarget = ({
  wandIndex,
  className = '',
  onClick,
  onDropSpell,
  onEndSelect,
  onDragSelect,
  ref,
  cursor = 'none',
  overHint = 'none',
  selection = 'none',
}: {
  wandIndex: WandIndex;
  className?: string;
  onClick: React.MouseEventHandler<HTMLElement>;
  onDropSpell: (item: DragItemSpell) => void;
  onEndSelect: (item: DragItemSelect) => void;
  onDragSelect: (item: DragItemSelect) => void;
  ref: MergableRef<HTMLDivElement>;

  cursor?: CursorStyle;
  overHint?: DropHint;
  selection?: WandSelection;
}) => {
  const [{ isOver, canDrop, isDraggingSpell, isDraggingSelect }, dropRef] =
    useDrop(
      () => ({
        accept: ['spell', 'select'],
        drop: (item: DragItem, monitor) => {
          !monitor.didDrop() &&
            ((isDragItemSpell(item) && onDropSpell(item)) ||
              (isDragItemSelect(item) && onEndSelect(item)));
        },
        hover: (item: DragItem) => {
          isDragItemSelect(item) && onDragSelect(item);
        },
        canDrop: (item: DragItem) =>
          (isDragItemSpell(item) && item.sourceWandIndex !== wandIndex) ||
          (isDragItemSelect(item) && isMainWandIndex(wandIndex)),
        collect: (monitor) => ({
          isDraggingSpell: monitor.getItemType() === 'spell',
          isDraggingSelect: monitor.getItemType() === 'select',
          isOver: monitor.isOver(),
          canDrop: monitor.canDrop(),
        }),
      }),
      [wandIndex, onDropSpell, onEndSelect, onDragSelect],
    );
  const [, dragRef] = useDrag<DragItemSelect, DragItemSelect, unknown>(() => ({
    type: 'select',
    item: { disc: 'select', dragStartIndex: wandIndex },
  }));

  const isSelecting = useSelecting();

  const pointerEvents = isDraggingSpell || isDraggingSelect;

  const style = useMergedBackgrounds({
    cursorParts: cursors[cursor],
    dropHintParts:
      (isDraggingSpell &&
        isOver &&
        canDrop &&
        dropHints.overCanDrop[overHint]) ||
      (isDraggingSpell && isOver && dropHints.over[overHint]) ||
      (isDraggingSpell && dropHints.dragging[overHint]) ||
      (isDraggingSelect &&
        isOver &&
        canDrop &&
        selectHints.overCanDrop[overHint]) ||
      (isDraggingSelect && isOver && selectHints.over[overHint]) ||
      (isDraggingSelect && selectHints.dragging[overHint]) ||
      dropHints.none,
    selectionParts: selections[selection],
  });

  return (
    <StyledBetweenSpellsDropTarget
      className={className}
      style={style}
      onClick={onClick}
      ref={mergeRefs(ref, dropRef, dragRef)}
      $pointerEvents={pointerEvents}
    ></StyledBetweenSpellsDropTarget>
  );
};
