import styled from 'styled-components';
import { WandActionCall } from '../WandActionCall';
import type { WandShotResult } from '../../../calc/eval/clickWand';

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
      {shot.actionCalls.map((actionCall, index) => {
        return (
          <div key={index}>
            <WandActionCall actionCall={actionCall} />
          </div>
        );
      })}
    </StyledDiv>
  );
};
