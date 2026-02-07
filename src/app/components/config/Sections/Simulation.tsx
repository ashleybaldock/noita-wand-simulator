import { useConfigToggle } from '../../../redux';
import {
  SubSectionContent,
  SubSectionDiv,
  SubSectionTitle,
  WrappedYesNoToggle,
} from '../Components';

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
