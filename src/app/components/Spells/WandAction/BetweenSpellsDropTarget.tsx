import styled from 'styled-components';
import type { WandSelection } from '../../../redux/Wand/wandSelection';
import type { CursorStyle } from './Cursor';
import { mergeRefs, type MergableRef } from '../../../util/mergeRefs';
import {
  BackgroundPartSet,
  emptyBackgroundPart,
  emptyBackgroundPartSet,
  type BackgroundPart,
} from './BackgroundPart';
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
import { emptyDropHintParts, type DropHint, type DropHints } from './DropHint';
import { useMergeBackgrounds } from './useMergeBackgrounds';
import { useSelecting } from '../../../redux';
import { mapIter, takeAll } from '../../../util';

const cursors: Record<CursorStyle, BackgroundPart> = {
  'caret-hover': {
    'background-image': [
      `var(--sprite-cursor-caret-hover-top)`,
      `var(--sprite-cursor-caret-hover-bottom)`,
      `var(--sprite-cursor-caret-hover-line)`,
    ],
    'background-repeat': [`no-repeat`, `no-repeat`, `repeat-y`],
    'background-size': [
      `var(--cursor-container-width)`,
      `var(--cursor-container-width)`,
      `var(--cursor-container-width)`,
    ],
    'background-position': [`center top`, `center bottom`, `center center`],
    'cursor': ['text'],
  },
  'caret': {
    'background-image': [
      `var(--sprite-cursor-caret-top)`,
      `var(--sprite-cursor-caret-line)`,
    ],
    'background-repeat': [`no-repeat`, `repeat-y`],
    'background-size': [
      `var(--cursor-container-width)`,
      `var(--cursor-container-width)`,
    ],
    'background-position': [`center top`, `center center`],
    'cursor': [],
  },
  'spell-over': {
    'background-image': [
      `var(--sprite-cursor-spell-over-top)`,
      `var(--sprite-cursor-spell-over-bottom)`,
      `var(--sprite-cursor-spell-over-line)`,
    ],
    'background-repeat': [`no-repeat`, `no-repeat`, `repeat-y`],
    'background-size': [
      `var(--cursor-container-width)`,
      `var(--cursor-container-width)`,
      `var(--cursor-container-width)`,
    ],
    'background-position': [`center top`, `center bottom`, `center center`],
    'cursor': [],
  },
  'none': {
    'background-image': [],
    'background-repeat': [],
    'background-size': [],
    'background-position': [],
    'cursor': [],
  },
};
const dropHints: DropHints = {
  none: emptyBackgroundPart,
  dragging: emptyDropHintParts,
  overCanDrop: {
    ...emptyDropHintParts,
    shiftleft: {
      'background-image': [
        `var(--sprite-cursor-spell-over-top)`,
        `var(--sprite-cursor-spell-over-bottom)`,
        `var(--sprite-cursor-spell-over-line)`,
        `var(--sprite-cursor-spell-middle-toleft)`,
      ],
      'background-repeat': [`no-repeat`, `no-repeat`, `repeat-y`, `no-repeat`],
      'background-size': [
        `var(--cursor-container-width)`,
        `var(--cursor-container-width)`,
        `var(--cursor-container-width)`,
        `var(--cursor-container-width)`,
      ],
      'background-position': [
        `center top`,
        `center bottom`,
        `center center`,
        `center`,
      ],
      'cursor': [],
    },
    shiftright: {
      'background-image': [
        `var(--sprite-cursor-spell-over-top)`,
        `var(--sprite-cursor-spell-over-bottom)`,
        `var(--sprite-cursor-spell-over-line)`,
        `var(--sprite-cursor-spell-middle-toright)`,
      ],
      'background-repeat': [`no-repeat`, `no-repeat`, `repeat-y`, `no-repeat`],
      'background-size': [
        `var(--cursor-container-width)`,
        `var(--cursor-container-width)`,
        `var(--cursor-container-width)`,
        `var(--cursor-container-width)`,
      ],
      'background-position': [
        `center top`,
        `center bottom`,
        `center center`,
        `center`,
      ],
      'cursor': [],
    },
  },
  over: emptyDropHintParts,
};

const selectHints: DropHints = {
  none: emptyBackgroundPart,
  dragging: emptyDropHintParts,
  overCanDrop: {
    ...emptyDropHintParts,
    forbidden: {
      'background-image': ['linear-gradient(45deg, white, red, white)'],
      'background-repeat': [`no-repeat`],
      'background-size': [`100%`],
      'background-position': [`center`],
      'cursor': [],
    },
    shiftleft: {
      'background-image': ['var(--sprite-cursor-select-middle-toleft)'],
      'background-repeat': [`no-repeat`],
      'background-size': [`var(--cursor-container-width)`],
      'background-position': [`center`],
      'cursor': [],
    },
    shiftright: {
      'background-image': ['var(--sprite-cursor-select-middle-toright)'],
      'background-repeat': [`no-repeat`],
      'background-size': [`var(--cursor-container-width)`],
      'background-position': [`center`],
      'cursor': [],
    },
  },
  over: {
    ...emptyDropHintParts,
    forbidden: {
      'background-image': ['linear-gradient(45deg, white, red, white)'],
      'background-repeat': [`no-repeat`],
      'background-size': [`100%`],
      'background-position': [`center`],
      'cursor': [],
    },
    shiftleft: {
      'background-image': ['var(--sprite-cursor-select-middle-toleft)'],
      'background-repeat': [`no-repeat`],
      'background-size': [`var(--cursor-container-width)`],
      'background-position': [`center`],
      'cursor': [],
    },
    shiftright: {
      'background-image': ['var(--sprite-cursor-select-middle-toright)'],
      'background-repeat': [`no-repeat`],
      'background-size': [`var(--cursor-container-width)`],
      'background-position': [`center`],
      'cursor': [],
    },
  },
};

const selections: Record<WandSelection, BackgroundPartSet> = {
  none: emptyBackgroundPartSet,
  start: {
    before: {
      'background-image': [
        'var(--sprite-cursor-select-start-top)',
        'var(--sprite-cursor-select-start-bottom)',
        'var(--sprite-cursor-select-over-line)',
      ],
      'background-repeat': [`no-repeat`, `no-repeat`, `repeat-y`],
      'background-size': [
        `var(--cursor-container-width)`,
        `var(--cursor-container-width)`,
        `var(--cursor-container-width)`,
      ],
      'background-position': [`center top`, `center bottom`, `center center`],
      'cursor': ['w-resize'],
    },
    after: emptyBackgroundPart,
  },
  thru: emptyBackgroundPartSet,
  end: {
    before: emptyBackgroundPart,
    after: {
      'background-image': [
        'var(--sprite-cursor-select-end-top)',
        'var(--sprite-cursor-select-end-bottom)',
        'var(--sprite-cursor-select-over-line)',
      ],
      'background-repeat': [`no-repeat`, `no-repeat`, `repeat-y`],
      'background-size': [
        `var(--cursor-container-width)`,
        `var(--cursor-container-width)`,
        `var(--cursor-container-width)`,
      ],
      'background-position': [`center top`, `center bottom`, `center center`],
      'cursor': ['e-resize'],
    },
  },
  single: {
    before: {
      'background-image': [
        'var(--sprite-cursor-select-start-top)',
        'var(--sprite-cursor-select-start-bottom)',
        'var(--sprite-cursor-select-over-line)',
      ],
      'background-repeat': [`no-repeat`, `no-repeat`, `repeat-y`],
      'background-size': [
        `var(--cursor-container-width)`,
        `var(--cursor-container-width)`,
        `var(--cursor-container-width)`,
      ],
      'background-position': [`center top`, `center bottom`, `center center`],
      'cursor': ['w-resize'],
    },
    after: {
      'background-image': [
        'var(--sprite-cursor-select-end-top)',
        'var(--sprite-cursor-select-end-bottom)',
        'var(--sprite-cursor-select-over-line)',
      ],
      'background-repeat': [`no-repeat`, `no-repeat`, `repeat-y`],
      'background-size': [
        `var(--cursor-container-width)`,
        `var(--cursor-container-width)`,
        `var(--cursor-container-width)`,
      ],
      'background-position': [`center top`, `center bottom`, `center center`],
      'cursor': ['e-resize'],
    },
  },
};

const StyledBetweenSpellsDropTarget = styled.div<{
  onClick: React.MouseEventHandler<HTMLElement>;
}>`
  position: absolute;
  height: 100%;
  box-sizing: border-box;
  image-rendering: pixelated;

  --cursor-container-width: calc(var(--bsize-spell) * 0.62);

  background-color: transparent;

  background-image: var(--bg-image);
  background-repeat: var(--bg-repeat);
  background-size: var(--bg-size);
  background-position: var(--bg-position);
  cursor: var(--cursor);

  &:hover {
    background-image: var(--bg-image-hover, --bg-image);
    background-repeat: var(--bg-repeat-hover, --bg-repeat);
    background-size: var(--bg-size-hover, --bg-size);
    background-position: var(--bg-position-hover, --bg-position);
    cursor: var(--cursor-hover, --cursor);
  }
`;

// --bg-image-hover: var();
// --bg-repeat-hover: ;
// --bg-size-hover: ;
// --bg-position-hover: ;

export type SpellTargetLocation = 'before' | 'after';

export const BetweenSpellsDropTarget = ({
  wandIndex,
  className = '',
  onClick,
  onDropSpell,
  onEndSelect,
  onDragSelect,
  ref,
  location = 'before',
  cursorCaret = 'none',
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

  location: SpellTargetLocation;
  cursorCaret?: CursorStyle;
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

  const merged = useMergeBackgrounds(
    cursors[cursorCaret],
    (isDraggingSpell && isOver && canDrop && dropHints.overCanDrop[overHint]) ||
      (isDraggingSpell && isOver && dropHints.over[overHint]) ||
      (isDraggingSpell && dropHints.dragging[overHint]) ||
      (isDraggingSelect &&
        isOver &&
        canDrop &&
        selectHints.overCanDrop[overHint]) ||
      (isDraggingSelect && isOver && selectHints.over[overHint]) ||
      (isDraggingSelect && selectHints.dragging[overHint]) ||
      dropHints.none,
    selections[selection][location],
  );

  const mapToVars = new Map([
    ['background-image', '--bg-image'],
    ['background-repeat', '--bg-repeat'],
    ['background-size', '--bg-size'],
    ['background-position', '--bg-position'],
    ['cursor', '--cursor'],
  ]);

  const mapToHoverVars = new Map([
    ['background-image', '--bg-image-hover'],
    ['background-repeat', '--bg-repeat-hover'],
    ['background-size', '--bg-size-hover'],
    ['background-position', '--bg-position-hover'],
    ['cursor', '--cursor-hover'],
  ]);

  const mergedHover = useMergeBackgrounds(cursors['caret-hover']);
  const style = Object.fromEntries([
    ...takeAll(mapIter(mapToVars.entries(), ([k, v]) => [v, merged[k]])),
    ...takeAll(
      mapIter(mapToHoverVars.entries(), ([k, v]) => [v, mergedHover[k]]),
    ),
  ]);

  return (
    <StyledBetweenSpellsDropTarget
      className={className}
      style={style}
      onClick={onClick}
      ref={mergeRefs(ref, dropRef, dragRef)}
    ></StyledBetweenSpellsDropTarget>
  );
};
