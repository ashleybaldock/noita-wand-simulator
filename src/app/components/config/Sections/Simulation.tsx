import styled from 'styled-components';
import { useConfigToggle } from '../../../redux';
import {
  SubSectionContent,
  SubSectionDiv,
  SubSectionTitle,
  WrappedYesNoToggle,
} from '../Components';

const SimPaused = styled.span`
  display: inline-block;
  width: 4em;
  padding-left: 4px;
  font-style: italic;
`;
const SimRunning = styled.span`
  display: inline-block;
  width: 4em;
  padding-left: 4px;
`;

export const SimulationConfigSection = () => {
  const [pauseCalculations, , handlePauseCalculations] =
    useConfigToggle('pauseCalculations');

  return (
    <SubSectionDiv>
      <SubSectionTitle>Simulation: </SubSectionTitle>
      <SubSectionContent>
        <WrappedYesNoToggle
          checked={pauseCalculations}
          onChange={handlePauseCalculations}
        >
          <span>Pause Simulation</span>
        </WrappedYesNoToggle>
      </SubSectionContent>
    </SubSectionDiv>
  );
};
