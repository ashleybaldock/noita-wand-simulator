import styled from 'styled-components';
import { WandActionCall } from '../WandActionCall';
import type { ActionCall } from '../../../calc/eval/ActionCall';
import type { TreeNode } from '../../../util/TreeNode';
import { isNotNullOrUndefined } from '../../../util';
import { mappedTreeToTreeMap } from '../../../util/MapTree';
import type { WandShotResult } from '../../../calc/eval/WandShot';

export const ActionTreeRoot = styled.div`
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

export const ActionTreeShotResultNodeDiv = styled.div`
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

const ArrowColumn = styled.div``;

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
      data-leaf={isLeaf}
      data-twig={isTwig}
      data-level={level}
      data-childcount={childCount}
      data-trigger={isTriggerParent}
      data-triggerlevel={triggerLevel}
      data-wrap={causedWrap}
      data-deckindex={node?.value.deckIndex}
      data-seqid={node?.value.sequenceId}
      data-recursion={node?.value.recursion}
      data-iteration={node?.value.iteration}
      data-source={node?.value.source}
      data-dontdraw={node?.value.dont_draw_actions ?? false}
      style={{
        '--data-triggerlevel': triggerLevel,
        '--data-level': level,
        '--data-childcount': childCount,
      }}
    >
      <ArrowColumn data-name="Arrows" />
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
    <ActionTreeRoot data-name="ActionTreeRoot">
      {shot.actionCallTrees.map((n, index) => (
        <ActionTreeComponent
          node={mappedTreeToTreeMap(n)}
          key={index}
          level={level + 1}
          triggerLevel={triggerLevel}
        />
      ))}
    </ActionTreeRoot>
  );
};
