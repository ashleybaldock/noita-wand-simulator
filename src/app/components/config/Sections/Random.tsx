import { useConfigSetting, useIsRandomUsed } from '../../../redux';
import {
  SubSectionContent,
  SubSectionDiv,
  SubSectionTitle,
} from '../Components';
import { InputImageLabel } from '../../Input/ImageLabel/InputImageLabel';
import { NumericInput } from '../../Input/NumericInput/NumericInput';
import styled from 'styled-components';
import { EditableWithLabel } from '../../Presentation/EditableWithLabel';

const RandomInputWrapper = styled(EditableWithLabel)<{
  $backgroundImage?: string;
}>`
  flex: 1 1 46%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  ${({ $backgroundImage }) =>
    $backgroundImage && `background-image: ${$backgroundImage};`}
  background-position: 0.6em 50%;
  background-size: 1em;
  background-repeat: no-repeat;
  image-rendering: pixelated;
  font-family: var(--font-family-noita-default);
  font-size: 1em;
  color: var(--color-button);
  padding: 0 0.6em 0 2.2em;

  @media screen and (max-width: 500px) {
    font-size: 1.2em;
  }

  column-gap: 0.4em;
`;

export const RandomConfigSection = () => {
  const [frameNumber, setFrameNumber, frameNumberChangeHandler] =
    useConfigSetting('random.frameNumber');
  const [worldSeed, setWorldSeed, worldSeedChangeHandler] =
    useConfigSetting('random.worldSeed');

  const usesRandom = useIsRandomUsed();
  return usesRandom ? (
    <SubSectionDiv data-section="random">
      <SubSectionTitle>
        <InputImageLabel $size={22} icon={'icon.config.die2'} />
        <span>Random</span>
      </SubSectionTitle>
      <SubSectionContent wrapq={true} maxWidth={'calc(100% - 2.2em)'}>
        <RandomInputWrapper>
          <span>Seed</span>
          <NumericInput
            smallest={0}
            largest={Number.POSITIVE_INFINITY}
            bigStepButtons={false}
            setLargestButton={false}
            // type="text"
            // inputMode="numeric"
            // pattern="^[1-9][0-9]*$"
            value={worldSeed}
            setValue={setWorldSeed}
            onChange={worldSeedChangeHandler}
          ></NumericInput>
        </RandomInputWrapper>
        <RandomInputWrapper>
          <span>Frame:</span>
          <NumericInput
            smallest={0}
            largest={Number.POSITIVE_INFINITY}
            bigStepButtons={false}
            setLargestButton={false}
            // type="text"
            // inputMode="numeric"
            // pattern="^[1-9][0-9]*$"
            value={frameNumber}
            setValue={setFrameNumber}
            onChange={frameNumberChangeHandler}
          ></NumericInput>
        </RandomInputWrapper>
      </SubSectionContent>
    </SubSectionDiv>
  ) : null;
};
