import styled from 'styled-components';
import { useDrag, useDrop } from 'react-dnd';
import { useAppDispatch } from '../../../redux/hooks';
import { WithDebugHints } from '../../Debug';
import { setSelection, useCursor } from '../../../redux';
import { CursorPosition, CursorStyle, DragItemSelect } from './types';

export const StyledCursor = styled.div<{
  cursorIndex: CursorPosition;
  cursorStyle: CursorStyle;
  isDropTarget: boolean;
  isDragSource: boolean;
  isOver: boolean;
}>`
  z-index: var(--zindex-cursor-current);

  position: absolute;
  height: 58px;
  width: 12px;
  top: -2px;
  left: -6px;
  ${({ cursorIndex }) =>
    cursorIndex === 'before'
      ? `
      left: -6px;
  background-image: url('/data/inventory/cursor-top.png'),
    url('/data/inventory/cursor-mid.png');
      `
      : cursorIndex === 'after'
      ? `
      right: -6px;
      left: unset;
  background-image: url('/data/inventory/cursor-top.png'),
    url('/data/inventory/cursor-mid.png');
    `
      : `
    opacity: 0;
    `}

  ${({ isDropTarget, isDragSource }) =>
    isDropTarget || isDragSource
      ? `
      pointer-events: auto;
      `
      : `
      pointer-events: none;
      `}

  image-rendering: pixelated;
  background-repeat: no-repeat;
  background-size: 100%;
  background-position: top center, center center;

  ${WithDebugHints} && {
    ${({ isOver }) =>
      isOver
        ? `background-color: rgba(255, 0, 0, 0.4);`
        : `background-color: rgba(255, 0, 255, 0.4);`}
  }
`;

export const WandEditCursor = ({
  wandIndex,
  isDropTarget,
  isDragSource,
  className,
  children,
}: React.PropsWithChildren<{
  wandIndex: number;
  isDropTarget: boolean;
  isDragSource: boolean;
  className?: string;
}>) => {
  const dragDropAccept = 'select';
  const dispatch = useAppDispatch();
  const { position, style } = useCursor()[wandIndex];

  const [{ isOver }, dropRef] = useDrop(
    () => ({
      accept: dragDropAccept,
      hover: (item: DragItemSelect, monitor) =>
        !monitor.didDrop() &&
        monitor.canDrop() &&
        dispatch(setSelection({ from: item.dragStartIndex, to: wandIndex })),
      drop: (item: DragItemSelect, monitor) => {
        !monitor.didDrop() &&
          dispatch(setSelection({ from: item.dragStartIndex, to: wandIndex }));
      },
      canDrop: (item: DragItemSelect) => item.dragStartIndex !== wandIndex,
      collect: (monitor) => ({
        isOver: monitor.isOver({ shallow: true }) && monitor.canDrop(),
      }),
    }),
    [],
  );
  const [, dragRef] = useDrag((): { type: string; item: DragItemSelect } => ({
    type: dragDropAccept,
    item: { disc: dragDropAccept, dragStartIndex: wandIndex },
  }));

  return (
    <StyledCursor
      ref={(ref) => dropRef(dragRef(ref))}
      cursorIndex={position}
      cursorStyle={style}
      isOver={isOver}
      isDropTarget={isDropTarget}
      isDragSource={isDragSource}
    >
      {children}
    </StyledCursor>
  );
};
