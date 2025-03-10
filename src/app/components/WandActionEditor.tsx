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
import { WandActionBorder } from './wandAction/WandActionBorder';
import { ReleaseInfo } from './ReleaseInfo';

const StyledList = styled.ul`
  --grid-layout-gap: 8;
  --grid-max-column-count: 8;
  --grid-item-width: 88;
  --unit-dim: 0.04em;

  margin: 0;
  padding: 0;
  padding: 12px 16px;
  background-color: var(--color-wand-editor-bg);

  @media screen and (max-width: 500px) {
    padding: 12px 4px;
  }

  --gap-count: calc(var(--grid-max-column-count) - 1);
  --total-gap-width: calc(
    var(--gap-count) * var(--grid-layout-gap) * var(--unit-dim, 1px)
  );
  display: grid;
  grid-template-columns: repeat(
    auto-fill,
    minmax(
      calc(var(--grid-item-width) * var(--unit-dim, 1px)),
      calc(var(--grid-item-width) * var(--unit-dim, 1px))
    )
  );
  grid-gap: calc(var(--grid-layout-gap) * var(--unit-dim, 1px));
  justify-content: center;
  align-items: center;
`;

const StyledListItem = styled.li`
  display: block;
  flex: 0 1 auto;
  list-style-type: none;
`;

type Props = {
  spellAction?: Spell;
  wandIndex: number;
  deckIndex?: number;
};

function ActionComponent(props: Props) {
  const { spellAction, wandIndex, deckIndex } = props;
  const dispatch = useAppDispatch();
  const [mouseOver, setMouseOver] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleDeleteSpell = (wandIndex: number) => {
    dispatch(setSpellAtIndex({ spell: null, index: wandIndex }));
  };

  return (
    <WandActionDropTarget
      wandIndex={wandIndex}
      onDragChange={(dragOver: boolean) => setDragOver(dragOver)}
    >
      <WandActionBorder
        highlight={dragOver}
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
                spellType={spellAction.type}
                spellSprite={spellAction.sprite}
                onDeleteSpell={() => handleDeleteSpell(wandIndex)}
              />
              <DeleteSpellAnnotation
                visible={mouseOver}
                deleteSpell={() => handleDeleteSpell(wandIndex)}
              />
            </WandActionDragSource>
            <DeckIndexAnnotation deckIndex={deckIndex} />
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
  console.log(spellIds);

  const spellActions = spellIds.map((spellId) =>
    isKnownSpell(spellId) ? getSpellById(spellId) : undefined,
  );
  console.log(spellActions);
  let deckIndex = 0;

  return (
    <StyledList>
      {spellActions.map((spellAction, wandIndex) => (
        <StyledListItem key={wandIndex}>
          <ActionComponent
            spellAction={spellAction}
            wandIndex={wandIndex}
            deckIndex={spellAction !== undefined ? deckIndex++ : undefined}
          />
        </StyledListItem>
      ))}
      <ReleaseInfo />
    </StyledList>
  );
}
