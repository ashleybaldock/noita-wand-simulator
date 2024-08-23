import styled from 'styled-components';
import type { ConfigBooleanField, ConfigRequirements } from '../../../redux';
import { toggleConfigSetting, useAppDispatch, useConfig } from '../../../redux';
import {
  SubSectionContent,
  SubSectionDiv,
  SubSectionTitle,
} from '../Components';
import { InputImageLabel } from '../../Input/ImageLabel/InputImageLabel';
import {
  RequiremementEveryOther,
  RequiremementIfEnemy,
  RequiremementIfHp,
  RequiremementIfProjectiles,
} from '../../Input/RequirementToggle/RequirementToggle';

const RequirementsSubSection = styled(SubSectionDiv).attrs(() => ({
  'data-section': 'requirements',
}))`
  flex-direction: row;
  align-content: unset;
  align-items: unset;
  align-self: unset;
  justify-content: unset;

  & > :first-child {
    align-self: start;
  }
  & > :last-child {
    flex-wrap: wrap;
  }
  @media screen and (max-width: 600px) {
    flex-direction: column;
    row-gap: 0.2em;
    column-gap: 0;
  }
`;

export const RequirementsConfigSection = () => {
  const config = useConfig();
  const dispatch = useAppDispatch();

  const {
    'requirements.half': half,
    'requirements.enemies': enemies,
    'requirements.hp': hp,
    'requirements.projectiles': projectiles,
  } = config;

  const requirementsChangeHandler =
    (field: ConfigBooleanField & keyof ConfigRequirements) => () => {
      dispatch(toggleConfigSetting({ name: field }));
    };

  return (
    <RequirementsSubSection>
      <SubSectionTitle minWidth={'fit-content'}>
        <InputImageLabel $size={22} icon={'icon.config.req'} />
        <span>Requirements</span>
      </SubSectionTitle>
      <SubSectionContent wrapq={true}>
        <RequiremementEveryOther
          checked={half}
          onChange={requirementsChangeHandler('requirements.half')}
          customYes={<>1st</>}
          customNo={<>2nd</>}
        />
        <RequiremementIfEnemy
          checked={enemies}
          onChange={requirementsChangeHandler('requirements.enemies')}
          customYes={<>Cast</>}
          customNo={<>Skip</>}
        />
        <RequiremementIfProjectiles
          checked={projectiles}
          onChange={requirementsChangeHandler('requirements.projectiles')}
          customYes={<>Cast</>}
          customNo={<>Skip</>}
        />
        <RequiremementIfHp
          checked={hp}
          onChange={requirementsChangeHandler('requirements.hp')}
          customYes={<>Cast</>}
          customNo={<>Skip</>}
        />
      </SubSectionContent>
    </RequirementsSubSection>
  );
};
