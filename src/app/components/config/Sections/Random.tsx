import { useConfigSetting } from '../../../redux';
import {
  SubSectionContent,
  SubSectionDiv,
  SubSectionTitle,
} from '../Components';
import { InputImageLabel } from '../../Input/ImageLabel/InputImageLabel';
import { NumericInput } from '../../Input/NumericInput/NumericInput';
import styled from 'styled-components';

const RandomInputWrapper = styled.div`
  flex: 1 1 46%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;

  column-gap: 0.4em;
`;

export const RandomConfigSection = () => {
  const [frameNumber, , frameNumberChangeHandler] =
    useConfigSetting('random.frameNumber');
  const [worldSeed, , worldSeedChangeHandler] =
    useConfigSetting('random.worldSeed');

  return (
    <SubSectionDiv data-section="random">
      <SubSectionTitle>
        <InputImageLabel $size={22} icon={'icon.config.die2'} />
        <span>Random</span>
      </SubSectionTitle>
      <SubSectionContent wrapq={true} maxWidth={'calc(100% - 2.2em)'}>
        <RandomInputWrapper>
          <span>Seed</span>
          <NumericInput
            min={0}
            max={Number.POSITIVE_INFINITY}
            showBigStep={false}
            showSetToMax={false}
            // type="text"
            // inputMode="numeric"
            // pattern="^[1-9][0-9]*$"
            value={worldSeed}
            onChange={worldSeedChangeHandler}
          ></NumericInput>
        </RandomInputWrapper>
        <RandomInputWrapper>
          <span>Frame:</span>
          <NumericInput
            min={0}
            max={Number.POSITIVE_INFINITY}
            showBigStep={false}
            showSetToMax={false}
            // type="text"
            // inputMode="numeric"
            // pattern="^[1-9][0-9]*$"
            value={frameNumber}
            onChange={frameNumberChangeHandler}
          ></NumericInput>
        </RandomInputWrapper>
      </SubSectionContent>
    </SubSectionDiv>
  );
};
