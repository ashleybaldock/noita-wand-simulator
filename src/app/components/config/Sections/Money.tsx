import { useConfigSetting } from '../../../redux';
import { InputImageLabel } from '../../Input/ImageLabel/InputImageLabel';
import { NumericInput } from '../../Input/NumericInput/NumericInput';
import {
  SubSectionContent,
  SubSectionDiv,
  SubSectionTitle,
} from '../Components';

export const MoneyConfigSection = () => {
  const [value, setValue, changeHandler] = useConfigSetting('var_money');

  return (
    <SubSectionDiv data-section="money">
      <SubSectionTitle>
        <InputImageLabel $size={20} icon={'icon.config.goldnugget2'} />
        <span>Money</span>
      </SubSectionTitle>
      <SubSectionContent>
        <NumericInput
          min={0}
          max={Number.POSITIVE_INFINITY}
          // type="text"
          // inputMode="numeric"
          // pattern="^[1-9][0-9]*$"
          setValue={setValue}
          value={value}
          onChange={changeHandler}
        ></NumericInput>
      </SubSectionContent>
    </SubSectionDiv>
  );
};
