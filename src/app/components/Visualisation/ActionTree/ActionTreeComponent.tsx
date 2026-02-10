import { useMemo } from 'react';
import type { ActionCall } from '../../../calc/eval/ActionCall';
import { everyIter, isNotNullOrUndefined, isUndefined } from '../../../util';
import type { TreeNode } from '../../../util/Tree';
import { WandActionCall } from '../WandActionCall';
import { TreeArrow } from './TreeArrow';
import styled from 'styled-components';
import type { ActionSource } from '../../../calc/actionSources';

export const AcTreeRun = styled.div<{ source: ActionSource }>`
  display: flex;
  flex-direction: ${(props) => (props.source === 'action' ? 'row' : 'column')};
  border-top: 0;
  border-bottom: 0;
`;

export const ArrowColumn = styled.div``;

export const ActionTreeCastResultNode = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  border-left: 4px solid #777;
  border-width: 0px;
`;
export const SubTrees = styled.div`
  display: flex;
  flex-direction: column;
  border-top: 0;
  border-bottom: 0;
`;

export const ActionTreeComponent = ({
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
   *
   * [[], [], []]
   */
  const runs = useMemo(
    () =>
      [...node.children].reduce<TreeNode<ActionCall>[][]>((runs, cur) => {
        const latestRun = runs[runs.length - 1];
        const latest = latestRun?.[latestRun?.length - 1]?.value;
        if (
          runs.length > 0 &&
          latest?.source === cur.value?.source &&
          latest?.spell?.id === cur.value?.spell?.id
        ) {
          latestRun.push(cur);
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
    <ActionTreeCastResultNode
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
        <SubTrees
          data-name="AcTreeChildren"
          data-twig={isTwig}
          data-trigger={isTriggerParent}
        >
          {runs.map((run, runIdx, runs) => (
            <AcTreeRun
              data-name={'ActionSourceGroup'}
              data-source={run[0]?.value?.source}
              data-run={runIdx}
              data-has-siblings={runs.length > 1}
              key={`run-${runIdx}`}
              source={run[0]?.value?.source ?? 'draw'}
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
            </AcTreeRun>
          ))}
        </SubTrees>
      )}
    </ActionTreeCastResultNode>
  );
};
