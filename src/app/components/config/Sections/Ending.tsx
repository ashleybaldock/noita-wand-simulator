import { useConfigSetting, useIsResetUsed } from '../../../redux';
import { InputImageLabel } from '../../Input/ImageLabel/InputImageLabel';
import {
  InputWrapper,
  SubSectionContent,
  SubSectionDiv,
  SubSectionTitle,
  WrappedYesNoToggle,
} from '../Components';

export const EndingConfigSection = () => {
  const [endSimulationOnCastCount, , handleEndOnShotCount] = useConfigSetting(
    'endSimulationOnCastCount',
  );
  const [endSimulationOnReloadCount, , handleReloadCountConfig] =
    useConfigSetting('endSimulationOnReloadCount');
  const [endSimulationOnRefreshCount, , handleRefreshCountConfig] =
    useConfigSetting('endSimulationOnRefreshCount');
  const [endSimulationOnRepeatCount, , handleRepeatCountConfig] =
    useConfigSetting('endSimulationOnRepeatCount');

  const usesReset = useIsResetUsed();

  return usesReset ? (
    <SubSectionDiv data-section="ending">
      <SubSectionTitle>
        <span>End Simulation after:</span>
      </SubSectionTitle>
      <SubSectionContent>
        {false && (
          <WrappedYesNoToggle
            checked={endSimulationOnCastCount > 0}
            onChange={handleEndOnShotCount}
          >
            <span>A single shot</span>
          </WrappedYesNoToggle>
        )}
        {false && (
          <WrappedYesNoToggle
            checked={endSimulationOnReloadCount > 0}
            onChange={handleReloadCountConfig}
          >
            <span>Reload</span>
          </WrappedYesNoToggle>
        )}
        {usesReset && (
          <WrappedYesNoToggle
            checked={endSimulationOnRefreshCount > 0}
            onChange={handleRefreshCountConfig}
          >
            <InputWrapper>
              <InputImageLabel $size={22} icon={'icon.spell.RESET'} />
              <span>Wand Refresh</span>
            </InputWrapper>
          </WrappedYesNoToggle>
        )}
        {false && (
          <WrappedYesNoToggle
            checked={endSimulationOnRepeatCount > 0}
            onChange={handleRepeatCountConfig}
          >
            <span>Repeat</span>
          </WrappedYesNoToggle>
        )}
      </SubSectionContent>
    </SubSectionDiv>
  ) : null;
};
