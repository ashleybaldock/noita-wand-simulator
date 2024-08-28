import { useConfigSetting } from '../../../redux';
import { InputImageLabel } from '../../Input/ImageLabel/InputImageLabel';
import { NumericInput } from '../../Input/NumericInput/NumericInput';
import {
  SubSectionContent,
  SubSectionDiv,
  SubSectionTitle,
} from '../Components';

export const HealthConfigSection = () => {
  const [value, setValue, changeHandler] = useConfigSetting('var_hp');

  return (
    <SubSectionDiv data-section="health">
      <SubSectionTitle>
        <InputImageLabel $size={22} icon={'icon.config.heart2'} />
        <span>Health</span>
      </SubSectionTitle>
      <SubSectionContent>
        <NumericInput
          min={0}
          max={Number.POSITIVE_INFINITY}
          value={value}
          setValue={setValue}
          onChange={changeHandler}
        ></NumericInput>
      </SubSectionContent>
    </SubSectionDiv>
  );
};
