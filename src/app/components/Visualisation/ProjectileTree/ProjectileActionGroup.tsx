import styled from 'styled-components/macro';
import { WandAction, WandActionBorder } from '../../Spells/WandAction';
import { NextActionArrow } from '../../Visualisation/Arrows';
import {
  GroupedObject,
  isArrayObject,
  isMultipleObject,
  isRawObject,
  simplifyMultipleObject,
} from '../../../calc/grouping/combineGroups';
import {
  ActionProxyAnnotation,
  ActionSourceAnnotation,
  DeckIndexAnnotation,
  DontDrawAnnotation,
  FriendlyFireAnnotation,
  RecursionAnnotation,
} from '../../Annotations/';
import { ActionCall, GroupedProjectile } from '../../../calc/eval/types';

const MainDiv = styled.div`
  display: flex;
  flex-direction: row;
  width: min-content;
  align-items: stretch;
  font-family: monospace;
  font-weight: bold;
  font-size: 12px;
  grid-row: heading;
`;

const GroupDiv = styled.div`
  display: flex;
  flex-direction: row;
`;

const CountParentDiv = styled.div`
  display: flex;
  flex-direction: row;
`;

const CountDiv = styled.div`
  --size-spell: var(--bsize-spell, 48px);
  display: flex;
  flex: 1 1 auto;
  justify-content: center;
  color: white;
  background-color: black;
  height: calc(var(--size-spell) / 3);
  font-family: monospace;
  font-weight: bold;
  font-size: 12px;
  border: 1px solid #aaa;
  line-height: calc(var(--size-spell) / 3);
  font-family: var(--font-family-noita-default);
`;

const SpacerDiv = styled.div`
  --size-spell: var(--bsize-spell, 48px);
  display: flex;
  flex: 1 1 auto;
  min-width: 5px;
  max-width: calc(var(--size-spell) / 4);
  height: calc(var(--size-spell) / 4);
`;
/*
  background-image: url(/data/inventory/action_tree_box.png);
 */
const WandActionGroupWandActionBorder = styled(WandActionBorder)`
  padding: 3px;
  border: 3px dotted #656565;
  border-radius: 12px;
  background-image: none;
  background-color: rgba(108, 76, 34, 0.1);
  margin: 4px 0 4px 0;
  position: relative;
`;

export const ProjectileActionGroup = ({
  group,
}: {
  group: GroupedObject<ActionCall | GroupedProjectile>;
}) => {
  const simplified = simplifyMultipleObject(group);

  if (isRawObject(simplified)) {
    if (simplified._typeName === 'ActionCall') {
      return (
        <MainDiv>
          <WandActionGroupWandActionBorder>
            <NextActionArrow />
            <WandAction
              spellType={simplified.spell.type}
              spellSprite={simplified.spell.sprite}
            />
            <RecursionAnnotation {...simplified} />
            <ActionSourceAnnotation {...simplified} />
            <DontDrawAnnotation
              {...simplified}
              dont_draw_actions={simplified.dont_draw_actions}
            />
            <DeckIndexAnnotation deckIndex={simplified.deckIndex} />
            <FriendlyFireAnnotation />
          </WandActionGroupWandActionBorder>
        </MainDiv>
      );
    } else {
      return (
        <MainDiv>
          <WandActionGroupWandActionBorder>
            <WandAction
              spellType={simplified.spell?.type ?? 'projectile'}
              spellSprite={simplified.spell?.sprite}
            />

            <ActionProxyAnnotation proxy={simplified.proxy} />
            <DeckIndexAnnotation deckIndex={simplified.deckIndex} />
            <FriendlyFireAnnotation />
          </WandActionGroupWandActionBorder>
        </MainDiv>
      );
    }
  } else if (isArrayObject(simplified)) {
    return (
      <GroupDiv>
        {simplified.map((g, i) => (
          <ProjectileActionGroup group={g} key={i} />
        ))}
      </GroupDiv>
    );
  } else if (isMultipleObject(simplified)) {
    return (
      <MainDiv>
        <GroupDiv>
          <ProjectileActionGroup group={simplified.first} />
        </GroupDiv>
        <CountParentDiv>
          <SpacerDiv />
          <CountDiv>x {simplified.count}</CountDiv>
          <SpacerDiv />
        </CountParentDiv>
      </MainDiv>
    );
  } else {
    return null;
  }
};
