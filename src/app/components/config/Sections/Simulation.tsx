import styled from 'styled-components';
import { useConfig } from '../../../redux';
import {
  InputWrapper,
  SubSectionContent,
  SubSectionDiv,
  SubSectionTitle,
} from '../Components';
import { noop } from '../../../util';

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
const CheckboxWrapper = styled.span``;

export const SimulationConfigSection = () => {
  const config = useConfig();

  return (
    <SubSectionDiv>
      <SubSectionTitle>
        Simulation:{' '}
        {config.pauseCalculations ? (
          <SimPaused>Paused</SimPaused>
        ) : (
          <SimRunning>Running</SimRunning>
        )}
      </SubSectionTitle>
      <SubSectionContent>
        <InputWrapper>
          <CheckboxWrapper>
            <input
              type="checkbox"
              checked={config.pauseCalculations}
              onChange={noop}
            />
          </CheckboxWrapper>
        </InputWrapper>
      </SubSectionContent>
    </SubSectionDiv>
  );
};
