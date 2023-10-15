import { useDrop } from 'react-dnd';
import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { WandActionDragItem } from '../../types';
import styled from 'styled-components/macro';
import { moveSpell, setSpellAtIndex } from '../../redux/wandSlice';
import { selectConfig } from '../../redux/configSlice';

const TargetDiv = styled.div`
  position: relative;
`;

const MarkerDiv = styled.div<{ isOver: boolean }>`
  border: ${(props) => (props.isOver ? '2px' : '0px')} dashed #ff6;
  width: 100%;
  height: 100%;
  position: absolute;
  top: -2px;
  left: -2px;
  z-index: 1;
  pointer-events: none;
`;

type Props = {
  wandIndex: number;
  marker?: boolean;
  onDragChange: (isDrag: boolean) => void;
};

export function WandActionDropTarget(props: React.PropsWithChildren<Props>) {
  const { onDragChange, wandIndex, marker = false } = props;
  const dispatch = useAppDispatch();
  const { config } = useAppSelector(selectConfig);

  const handleDrop = useCallback(
    (item: WandActionDragItem) => {
      if (item.actionId && item.sourceWandIndex !== undefined) {
        dispatch(
          moveSpell({
            fromIndex: item.sourceWandIndex,
            toIndex: wandIndex,
            mode: config.swapOnMove ? 'swap' : 'overwrite',
          }),
        );
      } else if (item.actionId) {
        dispatch(setSpellAtIndex({ spell: item.actionId, index: wandIndex }));
      } else {
        throw Error(`invalid drag item ${item}`);
      }
    },
    [config.swapOnMove, dispatch, wandIndex],
  );
  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: 'action',
      drop: (item: WandActionDragItem, monitor) => handleDrop(item),
      canDrop: (item: WandActionDragItem) => item.sourceWandIndex !== wandIndex,
      collect: (monitor) => ({
        isOver: monitor.isOver() && monitor.canDrop(),
      }),
    }),
    [handleDrop],
  );

  useEffect(() => onDragChange(isOver), [isOver, onDragChange]);

  return (
    <TargetDiv ref={drop}>
      {marker && <MarkerDiv isOver={isOver} />}
      {props.children}
    </TargetDiv>
  );
}
