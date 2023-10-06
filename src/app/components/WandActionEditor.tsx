import { useState } from 'react';
import styled from 'styled-components/macro';
import { Spell } from '../calc/spell';
import { getSpellById } from '../calc/spells';
import { useAppDispatch } from '../redux/hooks';
import { useSpells, setSpellAtIndex } from '../redux/wandSlice';
import { isKnownSpell } from '../types';
import {
  DeckIndexAnnotation,
  DeleteSpellAnnotation,
  FriendlyFireAnnotation,
  NoManaAnnotation,
} from './Annotations/';
import { WandActionDropTarget } from './wandAction/WandActionDropTarget';
import { WandAction } from './wandAction/WandAction';
import { WandActionDragSource } from './wandAction/WandActionDragSource';
import WandActionBorder from './wandAction/WandActionBorder';

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
  spellAction?: Spell;
  wandIndex: number;
};

function ActionComponent(props: Props) {
  const { spellAction, wandIndex } = props;
  const dispatch = useAppDispatch();
  const [mouseOver, setMouseOver] = useState(false);

  const handleDeleteSpell = (wandIndex: number) => {
    dispatch(setSpellAtIndex({ spell: null, index: wandIndex }));
  };

  return (
    <WandActionDropTarget wandIndex={wandIndex}>
      <WandActionBorder
        onMouseEnter={() => setMouseOver(true)}
        onMouseLeave={() => setMouseOver(false)}
      >
        {spellAction && (
          <>
            <WandActionDragSource
              actionId={spellAction.id}
              sourceWandIndex={wandIndex}
            >
              <WandAction
                spell={spellAction}
                onDeleteSpell={() => handleDeleteSpell(wandIndex)}
              />
              <DeleteSpellAnnotation
                visible={mouseOver}
                deleteSpell={() => handleDeleteSpell(wandIndex)}
              />
            </WandActionDragSource>
            <DeckIndexAnnotation deckIndex={spellAction.deck_index} />
            <NoManaAnnotation />
            <FriendlyFireAnnotation />
          </>
        )}
      </WandActionBorder>
    </WandActionDropTarget>
  );
}

export function WandActionEditor() {
  const spellIds = useSpells();

  const spellActions = spellIds.map((spellId) => {
    if (isKnownSpell(spellId)) {
      return getSpellById(spellId);
    }
    return undefined;
  });

  return (
    <StyledList>
      {spellActions.map((spellAction, wandIndex) => (
        <StyledListItem key={wandIndex}>
          <ActionComponent spellAction={spellAction} wandIndex={wandIndex} />
        </StyledListItem>
      ))}
    </StyledList>
  );
}
