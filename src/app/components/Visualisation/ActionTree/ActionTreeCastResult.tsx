import { useMemo, type ReactNode } from 'react';
import type { ActionCall } from '../../../calc/eval/ActionCall';
import type { WandCastResult } from '../../../calc/eval/WandCastResult';
import { ordinalSuffix } from '../../../util';
import { MapTree } from '../../../util/MapTree';
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

export const ActionTreeCastResult = ({
  cast: { actionCallTrees },
}: {
  cast: WandCastResult;
}) => {
  const level = 0;
  const triggerLevel = 0;

  const callTrees = useMemo(
    () => actionCallTrees.map((serialisedTree) => new MapTree(serialisedTree)),
    [actionCallTrees],
  );

  // const callTreeTraversals = useMemo(() => actionCallTrees.map((callTree) => ), [callTrees]);

  return (
    <ActionTreeRoot data-name="ActionTreeRoot">
      {callTrees.map((actionCallTree, index) => (
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
            {[...actionCallTree].map((childCast, i) => (
              <ActionTreeComponent
                position={0}
                node={childCast}
                level={level + 1}
                triggerLevel={triggerLevel}
                key={i}
              />
            ))}
          </>
        </ActionTreeCast>
      ))}
    </ActionTreeRoot>
  );
};
