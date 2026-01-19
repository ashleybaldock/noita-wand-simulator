import type { Key } from 'react';
import type { ActionCall } from '../../../calc/eval/ActionCall';
import type { WandCastResult } from '../../../calc/eval/WandCastResult';
import { WandActionCall } from '../WandActionCall';
import styled from 'styled-components';

export const StyledDiv = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  margin: 1px;
`;

// list of all actions played, and sub-ShotResults for triggers
export const ActionCallSequenceShotResult = ({
  shot,
}: {
  shot: WandCastResult;
}) => {
  return (
    <StyledDiv data-name="ActionCallSequenceShotResult">
      {shot.actionCalls.map(
        (actionCall: ActionCall, index: Key | null | undefined) => {
          return (
            <div key={index}>
              <WandActionCall actionCall={actionCall} />
            </div>
          );
        },
      )}
    </StyledDiv>
  );
};
