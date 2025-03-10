import styled from 'styled-components/macro';
import { WandAction } from './WandAction';
import { NextActionArrow } from '../shotResult/TreeArrows';
import { DEFAULT_SIZE } from '../../util/constants';
import {
  GroupedObject,
  isArrayObject,
  isMultipleObject,
  isRawObject,
  simplifyMultipleObject,
} from '../../calc/grouping/combineGroups';
import {
  ActionProxyAnnotation,
  ActionSourceAnnotation,
  DeckIndexAnnotation,
  DontDrawAnnotation,
  FriendlyFireAnnotation,
  RecursionAnnotation,
} from '../Annotations/';
import { WandActionBorder } from './WandActionBorder';
import { ActionCall, GroupedProjectile } from '../../calc/eval/types';

const MainDiv = styled.div.attrs({
  className: 'MainDiv',
})`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  font-family: monospace;
  font-weight: bold;
  font-size: 12px;
`;

const GroupDiv = styled.div.attrs({
  className: 'GroupDiv',
})`
  display: flex;
  flex-direction: row;
`;

const CountParentDiv = styled.div`
  display: flex;
  flex-direction: row;
`;

const CountDiv = styled.div<{
  size: number;
}>`
  display: flex;
  flex: 1 1 auto;
  justify-content: center;
  color: white;
  background-color: black;
  height: ${({ size }) => size / 3}px;
  font-family: monospace;
  font-weight: bold;
  font-size: 12px;
  border: 1px solid #aaa;
  line-height: ${({ size }) => size / 3}px;
  font-family: var(--font-family-noita-default);
`;

const SpacerDiv = styled.div<{
  size: number;
}>`
  display: flex;
  flex: 1 1 auto;
  min-width: 5px;
  max-width: ${({ size }) => size / 4}px;
  height: ${({ size }) => size / 4}px;
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
  margin: 4px 0 4px 48px;
  position: relative;
`;

type Props = {
  size?: number;
  group: GroupedObject<ActionCall | GroupedProjectile>;
};

export function WandActionGroup(props: Props) {
  const { size = DEFAULT_SIZE } = props;

  const simplified = simplifyMultipleObject(props.group);

  if (isRawObject(simplified)) {
    if (simplified._typeName === 'ActionCall') {
      return (
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
      );
    } else {
      return (
        <WandActionGroupWandActionBorder>
          <NextActionArrow />
          <WandAction
            spellType={simplified.spell?.type ?? 'projectile'}
            spellSprite={simplified.spell?.sprite}
          />

          <ActionProxyAnnotation proxy={simplified.proxy} />
          <DeckIndexAnnotation deckIndex={simplified.deckIndex} />
          <FriendlyFireAnnotation />
        </WandActionGroupWandActionBorder>
      );
    }
  } else if (isArrayObject(simplified)) {
    return (
      <GroupDiv>
        {simplified.map((g, i) => (
          <WandActionGroup group={g} key={i} size={size} />
        ))}
      </GroupDiv>
    );
  } else if (isMultipleObject(simplified)) {
    return (
      <MainDiv>
        <GroupDiv>
          <WandActionGroup group={simplified.first} size={size} />
        </GroupDiv>
        <CountParentDiv>
          <SpacerDiv size={size} />
          <CountDiv size={size}>x {simplified.count}</CountDiv>
          <SpacerDiv size={size} />
        </CountParentDiv>
      </MainDiv>
    );
  } else {
    return null;
  }
}
