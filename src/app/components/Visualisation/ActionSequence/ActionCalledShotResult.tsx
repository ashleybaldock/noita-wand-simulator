import styled from 'styled-components';
import { WandActionCall } from '../WandActionCall';
import type { WandShot } from '../../../calc/eval/WandShot';

const StyledDiv = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  margin: 1px;
`;

// list of all actions played, and sub-ShotResults for triggers
export const ActionCalledShotResult = ({ shot }: { shot: WandShot }) => {
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
