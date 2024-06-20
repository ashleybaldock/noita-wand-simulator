import { useConfigSetting } from '../../../redux';
import { InputImageLabel } from '../../Input/ImageLabel/InputImageLabel';
import {
  InputWrapper,
  SubSectionContent,
  SubSectionDiv,
  SubSectionTitle,
  WrappedYesNoToggle,
} from '../Components';

export const EndingConfigSection = () => {
  const [endSimulationOnShotCount, , handleEndOnShotCount] = useConfigSetting(
    'endSimulationOnShotCount',
  );
  const [endSimulationOnReloadCount, , handleReloadCountConfig] =
    useConfigSetting('endSimulationOnReloadCount');
  const [endSimulationOnRefreshCount, , handleRefreshCountConfig] =
    useConfigSetting('endSimulationOnRefreshCount');
  const [endSimulationOnRepeatCount, , handleRepeatCountConfig] =
    useConfigSetting('endSimulationOnRepeatCount');

  return (
    <SubSectionDiv data-section="ending">
      <SubSectionTitle>
        <span>End Simulation after:</span>
      </SubSectionTitle>
      <SubSectionContent>
        <WrappedYesNoToggle
          checked={endSimulationOnShotCount > 0}
          onChange={handleEndOnShotCount}
        >
          <span>A single shot</span>
        </WrappedYesNoToggle>
        <WrappedYesNoToggle
          checked={endSimulationOnReloadCount > 0}
          onChange={handleReloadCountConfig}
        >
          <span>Reload</span>
        </WrappedYesNoToggle>
        <WrappedYesNoToggle
          checked={endSimulationOnRefreshCount > 0}
          onChange={handleRefreshCountConfig}
        >
          <InputWrapper>
            <InputImageLabel size={22} sprite={'var(--sprite-action-reset)'} />
            <span>Wand Refresh</span>
          </InputWrapper>
        </WrappedYesNoToggle>
        <WrappedYesNoToggle
          checked={endSimulationOnRepeatCount > 0}
          onChange={handleRepeatCountConfig}
        >
          <span>Repeat</span>
        </WrappedYesNoToggle>
      </SubSectionContent>
    </SubSectionDiv>
  );
};
