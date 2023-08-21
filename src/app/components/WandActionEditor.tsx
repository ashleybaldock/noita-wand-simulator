import { useState } from 'react';
import styled from 'styled-components/macro';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { selectWand, setSpellAtIndex } from '../redux/wandSlice';
import { getActionById } from '../calc/eval/util';
import { DEFAULT_SIZE } from '../util';
import { WandActionDropTarget } from './wandAction/WandActionDropTarget';
import {
  DeckIndexAnnotation,
  DeleteSpellAnnotation,
  FriendlyFireAnnotation,
  NoManaAnnotation,
} from './Annotations/';
import { WandAction } from './wandAction/WandAction';
import { WandActionDragSource } from './wandAction/WandActionDragSource';
import WandActionBorder from './wandAction/WandActionBorder';
import { Action } from '../calc';

const StyledList = styled.ul`
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  margin: 0;
  padding: 0;
  gap: 6px;
  padding: 12px 16px;
  background-color: #000;
`;

const StyledListItem = styled.li`
  display: block;
  flex: 0 1 auto;
  list-style-type: none;
`;

type Props = {
  spellAction: Action;
  wandIndex: number;
  deckIndex: number;
  size: number;
};

function ActionComponent(props: Props) {
  const { spellAction, wandIndex, deckIndex, size } = props;
  const dispatch = useAppDispatch();
  const [mouseOver, setMouseOver] = useState(false);

  const handleDeleteSpell = (wandIndex: number) => {
    dispatch(setSpellAtIndex({ spell: null, index: wandIndex }));
  };

  return (
    <WandActionDropTarget wandIndex={wandIndex}>
      <WandActionBorder
        size={size}
        onMouseEnter={() => setMouseOver(true)}
        onMouseLeave={() => setMouseOver(false)}
      >
        <WandActionDragSource
          actionId={spellAction.id}
          sourceWandIndex={wandIndex}
        >
          <WandAction
            action={spellAction}
            deckIndex={deckIndex}
            onDeleteSpell={() => handleDeleteSpell(wandIndex)}
          />
          <DeleteSpellAnnotation
            size={size}
            visible={mouseOver}
            deleteSpell={() => handleDeleteSpell(wandIndex)}
          />
        </WandActionDragSource>
        <DeckIndexAnnotation size={size} deckIndex={deckIndex} />
        <NoManaAnnotation size={size} />
        <FriendlyFireAnnotation size={size} />
      </WandActionBorder>
    </WandActionDropTarget>
  );
}

export function WandActionEditor() {
  const { spells } = useAppSelector(selectWand);

  const size = DEFAULT_SIZE;
  const spellActions = spells.map((s) => (s ? getActionById(s) : null));

  let deckIndex = 0;

  return (
    <StyledList>
      {spellActions.map((spellAction, wandIndex) => (
        <StyledListItem key={wandIndex}>
          {spellAction && (
            <ActionComponent
              size={size}
              spellAction={spellAction}
              wandIndex={wandIndex}
              deckIndex={++deckIndex}
            />
          )}
        </StyledListItem>
      ))}
    </StyledList>
  );
}
