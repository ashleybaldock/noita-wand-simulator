import styled from 'styled-components';
import { WandActionCall } from '../WandActionCall';
import type { ActionCall } from '../../../calc/eval/ActionCall';
import type { WandShotResult } from '../../../calc/eval/clickWand';
import type { TreeNode } from '../../../util/TreeNode';
import { isNotNullOrUndefined } from '../../../util';
import { mappedTreeToTreeMap } from '../../../util/MapTree';

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

const ActionTreeComponent = ({
  node,
  level,
  triggerLevel: currentTriggerLevel,
}: {
  node: TreeNode<ActionCall>;
  level: number;
  triggerLevel: number;
}) => {
  const childCount = node.children.length;
  const hasChildren = childCount > 0;
  const isLeaf = childCount === 0;
  const isTwig = node.children.every((child) => child.children.length === 0);
  const isTriggerParent = isNotNullOrUndefined(
    node.value.wasLastToBeCalledBeforeBeginTrigger,
  );
  const triggerLevel = currentTriggerLevel + (isTriggerParent ? 1 : 0);
  const causedWrap = isNotNullOrUndefined(
    node.value.wasLastToBeDrawnBeforeWrapNr,
  );

  return (
    <ActionTreeShotResultNodeDiv
      data-name="AcTreeNode"
      childCount={childCount}
      data-leaf={isLeaf}
      data-twig={isTwig}
      data-level={level}
      data-trigger={isTriggerParent}
      data-triggerlevel={triggerLevel}
      data-wrap={causedWrap}
      data-deckindex={node?.value.deckIndex}
      data-seqid={node?.value.sequenceId}
      data-recursion={node?.value.recursion}
      data-iteration={node?.value.iteration}
      data-source={node?.value.source}
      data-dontdraw={node?.value.dont_draw_actions ?? false}
      style={{ '--data-triggerlevel': triggerLevel, '--data-level': level }}
    >
      <WandActionCall data-name="AcTreeActionCall" actionCall={node.value} />
      {hasChildren && (
        <ChildrenDiv
          data-name="AcTreeChildren"
          data-twig={isTwig}
          data-trigger={isTriggerParent}
        >
          {node.children.map((childNode, index) => (
            <ActionTreeComponent
              node={childNode}
              key={index}
              level={level + 1}
              triggerLevel={triggerLevel}
            />
          ))}
        </ChildrenDiv>
      )}
    </ActionTreeShotResultNodeDiv>
  );
};

export const ActionTreeShotResult = ({ shot }: { shot: WandShotResult }) => {
  const level = 0;
  const triggerLevel = 0;
  return (
    <ActionTreeShotResultMainDiv data-name="ActionTreeShotResultMainDiv">
      {shot.actionCallTrees.map((n, index) => (
        <ActionTreeComponent
          node={mappedTreeToTreeMap(n)}
          key={index}
          level={level + 1}
          triggerLevel={triggerLevel}
        />
      ))}
    </ActionTreeShotResultMainDiv>
  );
};
