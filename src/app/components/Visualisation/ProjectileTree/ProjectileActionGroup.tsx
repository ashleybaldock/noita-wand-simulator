import styled from 'styled-components/macro';
import { WandAction, WandActionBorder } from '../../Spells/WandAction';
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
import { SIGN_MULTIPLY } from '../../../util';
import { WithDebugHints } from '../../Debug';

const ArrayGroupDiv = styled.div`
  display: flex;
  flex-direction: row;
  align-self: end;
`;
const MultiGroupDiv = styled.div`
  display: flex;
  flex-direction: row;
  align-self: end;
`;

const MainDiv = styled.div<{ nestingLevel: number }>`
  position: relative;
  display: flex;
  flex-direction: column;
  width: min-content;
  width: auto;
  align-items: center;
  font-weight: bold;
  font-size: 12px;
  grid-row: heading;
  margin: 0;
  align-items: center;
  text-align: center;

  ${WithDebugHints} && {
    border: 1px dashed blue;
    ${MultiGroupDiv} && {
      border-top: 1px dashed orange;
      border-right: 1px dashed orange;
    }
    ${ArrayGroupDiv} && {
      border-bottom: 1px dashed red;
      border-left: 1px dashed red;
    }
  }
`;
const CountDiv = styled.div`
  --size-spell: var(--bsize-spell, 48px);

  position: absolute;
  top: -2px;
  height: calc(var(--size-spell) / 3);
  display: flex;
  flex: 1 1 auto;
  justify-content: center;

  font-weight: bold;
  font-size: 12px;
  line-height: 1.5em;
  white-space: nowrap;
  font-weight: normal;

  color: white;
  background-color: black;
  border: 1px solid #656565;
  border-radius: 5px;
  padding: 0 2px;
  &::after {
    content: '${SIGN_MULTIPLY}';
    padding: 0 0.1em;
  }
`;

/*
  background-image: url(/data/inventory/action_tree_box.png);
 */
const WandActionGroupWandActionBorder = styled(WandActionBorder)`
  position: relative;
  padding: 3px;
  border: 3px dotted #656565;
  border-radius: 12px;
  background-image: none;
  background-color: rgba(108, 76, 34, 0.1);
  margin: 0;
`;

export const ProjectileActionGroup = ({
  group,
  nestingLevel,
}: {
  group: GroupedObject<ActionCall | GroupedProjectile>;
  nestingLevel: number;
}) => {
  const simplified = simplifyMultipleObject(group);

  if (isRawObject(simplified)) {
    if (simplified._typeName === 'ActionCall') {
      return (
        <MainDiv nestingLevel={nestingLevel}>
          <WandActionGroupWandActionBorder>
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
        <MainDiv nestingLevel={nestingLevel}>
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
      <ArrayGroupDiv>
        {simplified.map((g, i) => (
          <ProjectileActionGroup
            nestingLevel={nestingLevel}
            group={g}
            key={i}
          />
        ))}
      </ArrayGroupDiv>
    );
  } else if (isMultipleObject(simplified)) {
    return (
      <MainDiv nestingLevel={nestingLevel}>
        <MultiGroupDiv>
          <ProjectileActionGroup
            nestingLevel={nestingLevel}
            group={simplified.first}
          />
        </MultiGroupDiv>
        <CountDiv>{simplified.count}</CountDiv>
      </MainDiv>
    );
  } else {
    return null;
  }
};
