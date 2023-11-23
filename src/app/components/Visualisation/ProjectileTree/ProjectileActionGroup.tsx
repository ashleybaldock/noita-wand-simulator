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
  align-items: center;
  font-family: monospace;
  font-weight: bold;
  font-size: 12px;
  grid-row: heading;
  margin: 0;
  align-items: end;
  align-self: start;
  text-align: center;
  border: 1px dashed blue;
  ${MultiGroupDiv} && {
    border-top: 1px dashed orange;
    border-right: 1px dashed orange;
  }
  ${ArrayGroupDiv} && {
    border-bottom: 1px dashed red;
    border-left: 1px dashed red;
  }
  padding-top: calc(
    var(--sizes-nesting-offset) * ${({ nestingLevel }) => nestingLevel}
  );
`;
const CountDiv = styled.div`
  --size-spell: var(--bsize-spell, 48px);
  position: absolute;
  top: -2px;
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
  border-radius: 8px;
  line-height: calc(var(--size-spell) / 3);
  font-family: var(--font-family-noita-default);
  white-space: nowrap;
  font-weight: normal;
  border: 1px solid #656565;
  border-radius: 5px;
  padding: 0 2px;
  line-height: 1.5em;
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
  top: 6px;
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
            nestingLevel={nestingLevel + 1}
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
            nestingLevel={nestingLevel + 1}
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