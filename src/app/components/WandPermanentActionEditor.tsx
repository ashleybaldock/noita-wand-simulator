import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { selectWand, setSpellAtLocation } from '../redux/wandSlice';
import { getActionById } from '../calc/eval/util';
import { WandActionDropTarget } from './wandAction/WandActionDropTarget';
import { DEFAULT_SIZE, WandAction } from './wandAction/WandAction';
import { WandActionDragSource } from './wandAction/WandActionDragSource';
import WandActionBorder from './wandAction/WandActionBorder';
import { Action } from '../calc/extra/types';

const StyledList = styled.ul`
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  margin: 0;
  padding: 0;
`;

const StyledListItem = styled.li`
  display: block;
  flex: 0 1 auto;
  list-style-type: none;
`;

type Props = {};

export function WandPermanentActionEditor(props: Props) {
  const dispatch = useAppDispatch();
  const { permanentSpells } = useAppSelector(selectWand);

  const spellActions = permanentSpells.map((s) =>
    s ? getActionById(s) : null,
  );

  const size = DEFAULT_SIZE;
  const list = 'permanentSpells';

  const handleDeleteSpell = (wandIndex: number) => {
    dispatch(
      setSpellAtLocation({
        spell: null,
        location: { list, index: wandIndex },
      }),
    );
  };

  const createActionComponent = (
    spellAction: Action | null,
    wandIndex: number,
    deckIndex: number,
  ) => {
    if (spellAction) {
      return (
        <WandActionDropTarget wandIndex={wandIndex} list={list}>
          <WandActionDragSource
            actionId={spellAction.id}
            sourceWandIndex={wandIndex}
            sourceList={list}
          >
            <WandActionBorder size={size}>
              <WandAction
                action={spellAction}
                deckIndex={deckIndex}
                onDeleteSpell={() => handleDeleteSpell(wandIndex)}
              />
            </WandActionBorder>
          </WandActionDragSource>
        </WandActionDropTarget>
      );
    } else {
      return (
        <WandActionDropTarget wandIndex={wandIndex} list={list}>
          <WandActionBorder size={size} />
        </WandActionDropTarget>
      );
    }
  };

  let deckIndex = 0;
  let result: ReturnType<typeof createActionComponent>[] = [];

  spellActions.forEach((sa, index) => {
    result.push(
      <StyledListItem key={index}>
        {createActionComponent(sa, index, deckIndex)}
      </StyledListItem>,
    );
    if (sa) {
      deckIndex += 1;
    }
  });

  return <StyledList>{result}</StyledList>;
}
