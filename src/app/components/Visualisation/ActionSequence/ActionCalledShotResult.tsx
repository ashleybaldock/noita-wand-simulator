import styled from 'styled-components';
import { WandActionGroup } from '../WandActionGroup';
import { GroupedWandShot } from '../../../calc/eval/types';

const StyledDiv = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  margin: 1px;
`;

// list of all actions played, and sub-ShotResults for triggers
export const ActionCalledShotResult = ({ shot }: { shot: GroupedWandShot }) => {
  return (
    <StyledDiv>
      {shot.calledActions.map((actionCall, index) => {
        return (
          <div key={index}>
            <WandActionGroup group={actionCall} />
          </div>
        );
      })}
    </StyledDiv>
  );
};
