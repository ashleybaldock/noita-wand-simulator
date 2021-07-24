import { useDrop } from 'react-dnd';
import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { WandActionDragItem } from '../../types';
import styled from 'styled-components';
import { moveSpell, setSpellAtIndex, swapSpells } from '../../redux/wandSlice';
import { selectConfig } from '../../redux/configSlice';

const TargetDiv = styled.div<{ isOver: boolean }>`
  outline: ${(props) => (props.isOver ? '1px' : '0px')} dashed #ff6;
`;

type Props = {
  wandIndex: number;
};

export function WandActionDropTarget(props: React.PropsWithChildren<Props>) {
  const { wandIndex } = props;
  const dispatch = useAppDispatch();
  const { config } = useAppSelector(selectConfig);

  const handleDrop = useCallback(
    (item: WandActionDragItem) => {
      if (item.actionId && item.sourceWandIndex !== undefined) {
        const moveFunction = config.swapOnMove ? swapSpells : moveSpell;
        dispatch(
          moveFunction({ fromIndex: item.sourceWandIndex, toIndex: wandIndex }),
        );
      } else if (item.actionId) {
        dispatch(setSpellAtIndex({ spell: item.actionId, index: wandIndex }));
      } else {
        throw Error(`invalid drag item ${item}`);
      }
    },
    [dispatch, wandIndex],
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

  return (
    <TargetDiv ref={drop} isOver={isOver}>
      {props.children}
    </TargetDiv>
  );
}
