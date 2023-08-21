import styled from 'styled-components/macro';
import { WandAction } from './WandAction';
import { NextActionArrow } from '../shotResult/TreeArrows';
import {
  DEFAULT_SIZE,
  GroupedObject,
  isArrayObject,
  isMultipleObject,
  isRawObject,
  simplifyMultipleObject,
} from '../../util';
import {
  ActionProxyAnnotation,
  ActionSourceAnnotation,
  DeckIndexAnnotation,
  DontDrawAnnotation,
  FriendlyFireAnnotation,
  RecursionAnnotation,
} from '../Annotations/';
import WandActionBorder from './WandActionBorder';
import { ActionCall, GroupedProjectile } from '../../calc';

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

  const group = simplifyMultipleObject(props.group);

  if (isRawObject(group)) {
    return (
      <WandActionGroupWandActionBorder size={size}>
        <NextActionArrow />
        <WandAction {...group} size={size} />
        <RecursionAnnotation size={size} {...group} />
        <ActionSourceAnnotation
          size={size}
          {...group} /*source={props.source}*/
        />
        <ActionProxyAnnotation size={size} {...group} /*proxy={props.proxy}*/ />
        <DontDrawAnnotation
          size={size}
          {...group}
          // dontDrawActions={props.dont_draw_actions}
        />
        <DeckIndexAnnotation
          size={size}
          {...group}
          // deckIndex={props.deckIndex}
        />
        <FriendlyFireAnnotation size={size} />
      </WandActionGroupWandActionBorder>
    );
  } else if (isArrayObject(group)) {
    return (
      <GroupDiv>
        {group.map((g, i) => (
          <WandActionGroup group={g} key={i} size={size} />
        ))}
      </GroupDiv>
    );
  } else if (isMultipleObject(group)) {
    return (
      <MainDiv>
        <GroupDiv>
          <WandActionGroup group={group.first} size={size} />
        </GroupDiv>
        <CountParentDiv>
          <SpacerDiv size={size} />
          <CountDiv size={size}>x {group.count}</CountDiv>
          <SpacerDiv size={size} />
        </CountParentDiv>
      </MainDiv>
    );
  } else {
    return null;
  }
}
