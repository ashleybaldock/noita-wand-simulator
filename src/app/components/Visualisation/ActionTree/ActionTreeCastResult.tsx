import type { ReactNode } from 'react';
import type { ActionCall } from '../../../calc/eval/ActionCall';
import type { WandCastResult } from '../../../calc/eval/WandCastResult';
import { ordinalSuffix, mapIter } from '../../../util';
import { MapTree } from '../../../util/MapTree';
import type { TreeNode } from '../../../util/Tree';
import { ActionTreeComponent } from './ActionTreeComponent';
import styled from 'styled-components';

export const ActionTreeRoot = styled.div`
  --row-h: 68px;
  --radius-arrow: 0 0 0 20px/0 0 0 23px;

  --col-spacing: 48px;

  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  margin: 1px;
`;

const ActionTreeCast = styled.div``;
const ActionTreeCastSummary = styled.div``;
const StartingDraw = styled.div``;

export const ActionTreeCastResult = ({ cast }: { cast: WandCastResult }) => {
  const level = 0;
  const triggerLevel = 0;
  return (
    <ActionTreeRoot data-name="ActionTreeRoot">
      {cast.actionCallTrees
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
                (childCast, i) => (
                  <ActionTreeComponent
                    position={0}
                    node={childCast}
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
