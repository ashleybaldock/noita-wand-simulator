import { usePreview } from 'react-dnd-multi-backend';
import type { DragItemSelect } from './DragItems';
import { cursorBackgrounds } from './Cursor';
import styled from 'styled-components';
import { useMergedBackgrounds } from './useMergeBackgrounds';
import { DynamicBackground } from './DynamicBackground';

const Cursor = styled(DynamicBackground)`
  background-image: var(--bg-image);
  background-repeat: var(--bg-repeat);
  background-size: var(--bg-size);
  background-position: var(--bg-position);
  cursor: var(--cursor);
  height: var(--size-spell);
`;

export const SelectionDragPreview = () => {
  const preview = usePreview<DragItemSelect>();
  const background = useMergedBackgrounds(
    cursorBackgrounds['caret-select']['before'],
  );

  if (!preview.display) {
    return null;
  }
  const {
    item: { dragStartIndex },
    style,
  } = preview;
  if (!dragStartIndex) {
    return null;
  }

  const merged = {
    ...style,
    ...background,
  };
  return <Cursor style={merged}></Cursor>;
};
