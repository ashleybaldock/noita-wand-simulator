import styled from 'styled-components';
import { WandActionGroup } from '../WandActionGroup';
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
      {shot.actionCallGroups.map((actionCall, index) => {
        return (
          <div key={index}>
            <WandActionGroup group={actionCall} />
          </div>
        );
      })}
    </StyledDiv>
  );
};
