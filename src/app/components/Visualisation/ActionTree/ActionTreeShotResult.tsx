import styled from 'styled-components';
import { WandActionGroup } from '../WandActionGroup';
import type { ActionCall } from '../../../calc/eval/ActionCall';
import type { WandShotResult } from '../../../calc/eval/clickWand';
import type { TreeNode } from '../../../util/TreeNode';
import { isNotNullOrUndefined } from '../../../util';

export const ActionTreeShotResultMainDiv = styled.div`
  --arrow-hz: 40px;
  --ahead-h: 16px;
  --row-h: 68px;
  --radius-arrow: 0 0 0 20px/0 0 0 23px;

  --col-spacing: 48px;

  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  margin: 1px;
`;

export const ActionTreeShotResultNodeDiv = styled.div<{
  childCount: number;
}>`
  --arrow-w: var(--size-arrow-w, 3px);
  position: relative;
  display: flex;
  flex-direction: row;
  border-left: 4px solid #777;
  border-width: 0px;

  &:nth-child(1)::before {
    position: absolute;
    border-left: var(--arrow-w) solid #ffbf00;
    content: '';
    display: block;
    height: calc(100% - (var(--row-h) / 2));
    top: calc(var(--row-h) / 2);
    width: 0;
    top: calc((var(--row-h) / 2) - var(--arrow-w) / 2);
    left: calc(var(--col-spacing) - var(--arrow-hz));
  }
  &:nth-child(1):only-child::before,
  &:last-child::before {
    content: '';
    display: block;
    top: 0;
    width: 0;
    height: 100%;
    border-left: var(--arrow-w) dotted #33ffaa11;
  }
  &:nth-child(1):last-child::before {
    border-left: none;
  }
  &:first-child {
    border-left: none;
    border-top: 0px solid transparent;
  }
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
  const isLeaf = childCount === 0;
  const isTwig = node.children.every((child) => child.children.length === 0);
  const isTriggerParent = isNotNullOrUndefined(
    node.value.wasLastToBeCalledBeforeBeginTrigger,
  );
  const causedWrap = isNotNullOrUndefined(
    node.value.wasLastToBeDrawnBeforeWrapNr,
  );

  return (
    <ActionTreeShotResultNodeDiv
      data-name="AcTreeNode"
      childCount={childCount}
      data-leaf={isLeaf}
      data-twig={isTwig}
      data-trigger={isTriggerParent}
      data-wrap={causedWrap}
    >
      <WandActionGroup data-name="AcTreeNodeAction" group={node.value} />
      {hasChildren && (
        <ChildrenDiv
          data-name="AcTreeChildren"
          data-twig={isTwig}
          data-trigger={isTriggerParent}
        >
          {node.children.map((childNode, index) => (
            <ActionTreeComponent node={childNode} key={index} />
          ))}
        </ChildrenDiv>
      )}
    </ActionTreeShotResultNodeDiv>
  );
};

export const ActionTreeShotResult = ({ shot }: { shot: WandShotResult }) => {
  return (
    <ActionTreeShotResultMainDiv data-name="ActionTreeShotResultMainDiv">
      {shot.actionCallTrees.map((n, index) => (
        <ActionTreeComponent node={n} key={index} />
      ))}
    </ActionTreeShotResultMainDiv>
  );
};
