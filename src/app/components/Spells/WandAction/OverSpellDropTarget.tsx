import styled from 'styled-components';
import type { WandSelection } from '../../../redux/Wand/wandSelection';
import { useCallback } from 'react';
import type { DragItem, DragItemSelect } from './DragItems';
import {
  isDragItemSelect,
  isDragItemSpell,
  type DragItemSpell,
} from './DragItems';
import {
  moveSpell,
  setSpellAtIndex,
  useAppDispatch,
  useConfig,
  useSelecting,
} from '../../../redux';
import { useDrop } from 'react-dnd';
import { moveCursorTo, setSelection } from '../../../redux/editorSlice';
import { isMainWandIndex, type WandIndex } from '../../../redux/WandIndex';
import type { CursorStyle } from './Cursor';
import { emptyBackgroundPart, type BackgroundPart } from './BackgroundPart';
import type { DropHint, DropHints } from './DropHint';
import { useMergedBackgrounds } from './useMergeBackgrounds';
import type { MergableRef } from '../../../util/mergeRefs';
import { noop } from '../../../util';

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
    shiftleft: emptyBackgroundPart,
    shiftright: emptyBackgroundPart,
    swap: emptyBackgroundPart,
    replace: emptyBackgroundPart,
  },
  over: {
    none: emptyBackgroundPart,
    shiftleft: emptyBackgroundPart,
    shiftright: emptyBackgroundPart,
    forbidden: {
      'background-image': ['linear-gradient(45deg, white, red, white)'],
      'background-repeat': [`no-repeat`],
      'background-size': [`100%`],
      'background-position': [`center`],
      'cursor': [],
    },
    swap: {
      'background-image': [
        'linear-gradient(45deg, transparent, green 50%, transparent 60%)',
        'linear-gradient(315deg, transparent, yellow 50%, transparent 60%)',
      ],
      'background-repeat': [`no-repeat`, `no-repeat`],
      'background-size': [`100%`, `100%`],
      'background-position': [`center`, `center`],
      'cursor': [],
    },
    replace: {
      'background-image': [
        'linear-gradient(45deg, transparent, red 50%, transparent 60%)',
        'linear-gradient(315deg, transparent, blue 50%, transparent 60%)',
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
  start: emptyBackgroundPart,
  end: emptyBackgroundPart,
  thru: {
    'background-image': [
      `linear-gradient(to right, var(--color-selection-bg), var(--color-selection-bg))`,
    ],
    'background-repeat': [`no-repeat`],
    'background-size': [`100%`],
    'background-position': [`center`],
    'cursor': ['ew-resize'],
  },
  single: {
    'background-image': [
      `linear-gradient(to right, var(--color-selection-bg), var(--color-selection-bg))`,
    ],
    'background-repeat': [`no-repeat`],
    'background-size': [`100%`],
    'background-position': [`center`],
    'cursor': ['ew-resize'],
  },
};
const DropTargetOver = styled.div`
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
`;

export const OverSpellDropTarget = ({
  wandIndex,
  className = '',
  onClick = noop,
  children,
  cursor = 'none',
  overHint = 'none',
  selection = 'none',
}: React.PropsWithChildren<{
  wandIndex: WandIndex;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLElement>;

  cursor?: CursorStyle;
  overHint?: DropHint;
  selection?: WandSelection;
}>) => {
  const dispatch = useAppDispatch();
  const { swapOnMove } = useConfig();

  const onDropSpell = useCallback(
    (item: DragItemSpell) => {
      if (item.sourceWandIndex === undefined) {
        if (isMainWandIndex(wandIndex)) {
          dispatch(setSpellAtIndex({ spellId: item.actionId, wandIndex }));
        }
      } else {
        dispatch(
          moveSpell({
            fromIndex: item.sourceWandIndex,
            toIndex: wandIndex,
            mode: swapOnMove ? 'swap' : 'overwrite',
          }),
        );
      }
    },
    [swapOnMove, dispatch, wandIndex],
  );

  const onEndSelect = useCallback(
    (item: DragItemSelect) => {
      if (isMainWandIndex(item.dragStartIndex) && isMainWandIndex(wandIndex)) {
        dispatch(setSelection({ from: item.dragStartIndex, to: wandIndex }));
      }
    },
    [dispatch, wandIndex],
  );

  const [{ isOver, isDraggingSpell, isDraggingSelect }, dropRef] = useDrop(
    () => ({
      accept: ['spell', 'select'],
      drop: (item: DragItem, monitor) => {
        !monitor.didDrop() &&
          ((isDragItemSpell(item) && onDropSpell(item)) ||
            (isDragItemSelect(item) && onEndSelect(item)));
      },
      canDrop: (item: DragItem) =>
        (isDragItemSpell(item) &&
          item.sourceWandIndex !== wandIndex &&
          isMainWandIndex(wandIndex) &&
          isMainWandIndex(item.sourceWandIndex) &&
          item.sourceWandIndex !== wandIndex + 1) ||
        (isDragItemSelect(item) && isMainWandIndex(wandIndex)),
      collect: (monitor) => ({
        isDraggingSpell: monitor.getItemType() === 'spell',
        isDraggingSelect: monitor.getItemType() === 'select',
        isOver: monitor.isOver() && monitor.canDrop(),
      }),
    }),
    [wandIndex, onDropSpell, onEndSelect],
  );

  const isSelecting = useSelecting();

  const style = useMergedBackgrounds({
    cursorParts: cursors[cursor],
    dropHintParts: isDraggingSpell
      ? isOver
        ? dropHints.over[overHint]
        : dropHints.dragging[overHint]
      : dropHints.none,
    selectionParts: selections[selection],
  });

  return (
    <DropTargetOver
      style={style}
      onClick={() => dispatch(moveCursorTo({ to: wandIndex }))}
      className={className}
      ref={dropRef}
    >
      {children}
    </DropTargetOver>
  );
};
