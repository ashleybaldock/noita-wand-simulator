import styled from 'styled-components';
import { WandActionCall } from '../WandActionCall';
import type { Key } from 'react';
import type { ActionCall } from '../../../calc/eval/ActionCall';
import type { WandShotResult } from '../../../calc/eval/WandShot';

const StyledDiv = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  margin: 1px;
`;

// list of all actions played, and sub-ShotResults for triggers
export const ActionCalledShotResult = ({ shot }: { shot: WandShotResult }) => {
  return (
    <StyledDiv>
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
