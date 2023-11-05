import styled from 'styled-components/macro';
import { WandActionGroup } from '../WandActionGroup';
import {
  ActionCall,
  GroupedWandShot,
  TreeNode,
} from '../../../calc/eval/types';

export const ActionTreeShotResultMainDiv = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  margin: 1px;
`;

export const ActionTreeShotResultNodeDiv = styled.div<{
  childCount: number;
}>`
  position: relative;
  display: flex;
  flex-direction: row;
  border-left: 4px solid #777;
  border-width: 0px;
`;

const ChildrenDiv = styled.div`
  display: flex;
  flex-direction: column;
  border-top: 0;
  border-bottom: 0;
`;

const ActionTreeComponent = ({ node }: { node: TreeNode<ActionCall> }) => {
  const childCount = node.children.length;
  const hasChildren = childCount > 0;

  return (
    <ActionTreeShotResultNodeDiv childCount={childCount}>
      <WandActionGroup group={node.value} />
      {hasChildren && (
        <ChildrenDiv>
          {node.children.map((node, index) => (
            <ActionTreeComponent node={node} key={index} />
          ))}
        </ChildrenDiv>
      )}
    </ActionTreeShotResultNodeDiv>
  );
};

export const ActionTreeShotResult = ({ shot }: { shot: GroupedWandShot }) => {
  return (
    <ActionTreeShotResultMainDiv>
      {shot.actionTree.map((n, index) => (
        <ActionTreeComponent node={n} key={index} />
      ))}
    </ActionTreeShotResultMainDiv>
  );
};
