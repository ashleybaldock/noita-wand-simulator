import styled from 'styled-components';
import {
  InputWrapper,
  SubSectionContent,
  SubSectionDiv,
  SubSectionTitle,
  WrappedYesNoConfigToggle,
} from '../Components';
import { InputImageLabel } from '../../Input/ImageLabel/InputImageLabel';

const Col = styled.div`
  display: flex;
  flex-direction: column;

  flex-direction: row;
  align-items: center;

  & > :first-child {
    flex: 1 1 50%;
  }
`;

const Hint = styled.span`
  margin-top: 0.4em;
  font-size: 0.6em;
`;

export const LimitsConfigSection = () => {
  return (
    <SubSectionDiv data-section="limits">
      <SubSectionTitle>
        <span>Limits</span>
      </SubSectionTitle>
      <SubSectionContent data-subsection="spellcharges">
        <WrappedYesNoConfigToggle
          data-toggle="unlimitedSpells"
          configToggle={'unlimitedSpells'}
        >
          <InputWrapper>
            <InputImageLabel $size={42} icon={'unlimited_spells'} />
            <Col>
              <span>Unlimited Spells Perk</span>
            </Col>
          </InputWrapper>
        </WrappedYesNoConfigToggle>
        <WrappedYesNoConfigToggle
          data-toggle="infiniteSpells"
          configToggle={'infiniteSpells'}
        >
          <Col>
            <span>Ignore spell charge limits</span>
          </Col>
        </WrappedYesNoConfigToggle>
        <WrappedYesNoConfigToggle
          data-toggle="showChargeUsage"
          configToggle={'showChargeUsage'}
        >
          <Col>
            <span>Highlight spells that consume charges</span>
          </Col>
        </WrappedYesNoConfigToggle>
      </SubSectionContent>
    </SubSectionDiv>
  );
};
