import styled from 'styled-components';
import { WandActionCall } from '../WandActionCall';
import type { ActionCall } from '../../../calc/eval/ActionCall';
import {
  everyIter,
  isNotNullOrUndefined,
  isUndefined,
  mapIter,
  ordinalSuffix,
} from '../../../util';
import { MapTree } from '../../../util/MapTree';
import type { WandShotResult } from '../../../calc/eval/WandShot';
import type { ActionSource } from '../../../calc/actionSources';
import { useMemo, type ReactNode } from 'react';
import { TreeArrow } from './TreeArrow';
import type { TreeNode, TreeRoot } from '../../../util/Tree';
import type { EvalTree } from '../../../calc/eval/serialize';

export const ActionTreeRoot = styled.div`
  --row-h: 68px;
  --radius-arrow: 0 0 0 20px/0 0 0 23px;

  --col-spacing: 48px;

  display: flex;
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

const ActionTreeSourceGroup = styled.div<{ $source: ActionSource }>`
  display: flex;
  flex-direction: ${(props) => (props.$source === 'action' ? 'row' : 'column')};
  border-top: 0;
  border-bottom: 0;
`;

const ArrowColumn = styled.div``;

const ActionTreeComponent = ({
  node,
  position,
  level,
  triggerLevel: currentTriggerLevel,
}: {
  node: TreeNode<ActionCall>;
  level: number;
  position: number;
  triggerLevel: number;
}) => {
  const childCount = node.childCount;
  const hasChildren = childCount > 0;
  const isLeaf = childCount === 0;
  const isTwig = everyIter(node.children, (child) => child.childCount === 0);
  const isTriggerParent = isNotNullOrUndefined(
    node.value?.wasLastToBeCalledBeforeBeginTrigger,
  );
  const triggerLevel = currentTriggerLevel + (isTriggerParent ? 1 : 0);
  const causedWrap = isNotNullOrUndefined(
    node.value?.wasLastToBeDrawnBeforeWrapNr,
  );
  /**
   * Find 'runs' of single draw actions,
   *  e.g. several modifiers in a row
   * (To be displayed in a more compact form)
   */
  const runs = useMemo(
    () =>
      [...node.children].reduce<TreeNode<ActionCall>[][]>((runs, cur) => {
        if (
          runs.length > 0 &&
          runs[runs.length - 1][runs[runs.length - 1].length - 1]?.value
            ?.source === cur.value?.source
        ) {
          runs[runs.length - 1].push(cur);
        } else {
          runs.push([cur]);
        }
        return runs;
      }, []),
    [node],
  );
  const branches = runs.length > 1;

  return isUndefined(node.value) ? (
    <></>
  ) : (
    <ActionTreeShotResultNodeDiv
      data-name="AcTreeNode"
      data-spell={node.value.spell.id}
      data-leaf={isLeaf}
      data-twig={isTwig}
      data-branches={branches}
      data-level={level}
      data-childcount={childCount}
      data-trigger={isTriggerParent}
      data-triggerlevel={triggerLevel}
      data-wrap={causedWrap}
      data-deckindex={node.value.spell.deck_index}
      data-seqid={node.value.sequenceId}
      data-recursion={node.value.recursion}
      data-iteration={node.value.iteration}
      data-source={node.value.source ?? 'draw'}
      data-dontdraw={node.value.dont_draw_actions ?? false}
      style={{
        '--data-triggerlevel': triggerLevel,
        '--data-level': level,
        '--data-childcount': childCount,
      }}
    >
      <ArrowColumn data-name="Arrows">
        <TreeArrow arrow={'⭢ '} source={node.value.source ?? 'draw'} />
        {isLeaf && (
          <TreeArrow arrow={'⤵︎'} source={node.value.source ?? 'draw'} />
        )}
        {position > 0 && (
          <>
            <TreeArrow arrow={'⤷ '} source={node.value.source ?? 'draw'} />
            <TreeArrow arrow={'ↆ'} source={node.value.source ?? 'draw'} />
          </>
        )}
      </ArrowColumn>
      <WandActionCall data-name="AcTreeActionCall" actionCall={node.value} />
      {hasChildren && (
        <ChildrenDiv
          data-name="AcTreeChildren"
          data-twig={isTwig}
          data-trigger={isTriggerParent}
        >
          {runs.map((run, runIdx, runs) => (
            <ActionTreeSourceGroup
              data-name={'ActionSourceGroup'}
              data-source={run[0]?.value?.source}
              data-run={runIdx}
              data-has-siblings={runs.length > 1}
              key={runIdx}
              $source={run[0]?.value?.source ?? 'draw'}
            >
              {run.map((childNode, index, run) => (
                <ActionTreeComponent
                  data-first-of-run={index === 0}
                  data-last-of-run={index === run.length - 1}
                  position={index}
                  node={childNode}
                  key={index}
                  level={level + 1}
                  triggerLevel={triggerLevel}
                />
              ))}
            </ActionTreeSourceGroup>
          ))}
        </ChildrenDiv>
      )}
    </ActionTreeShotResultNodeDiv>
  );
};

const ActionTreeCast = styled.div``;
const ActionTreeCastSummary = styled.div``;
const StartingDraw = styled.div``;

export const ActionTreeShotResult = ({ shot }: { shot: WandShotResult }) => {
  const level = 0;
  const triggerLevel = 0;
  return (
    <ActionTreeRoot data-name="ActionTreeRoot">
      {shot.actionCallTrees
        .map((actionCallTree) => new MapTree(actionCallTree))
        .map((actionCallTree, index) => (
          <ActionTreeCast
            data-name="AcTreeCast"
            data-cast={index + 1}
            key={index}
          >
            <ActionTreeCastSummary data-name="AcTreeSummary">
              {`${index + 1}${ordinalSuffix(index + 1)} cast`}
            </ActionTreeCastSummary>
            <StartingDraw data-name="AcTreeSpCast">Spells/cast: </StartingDraw>
            <>
              {mapIter<TreeNode<ActionCall>, ReactNode>(
                actionCallTree.children,
                (root, i) => (
                  <ActionTreeComponent
                    position={0}
                    node={root}
                    level={level + 1}
                    triggerLevel={triggerLevel}
                    key={i}
                  />
                ),
              )}
            </>
          </ActionTreeCast>
        ))}
    </ActionTreeRoot>
  );
};
