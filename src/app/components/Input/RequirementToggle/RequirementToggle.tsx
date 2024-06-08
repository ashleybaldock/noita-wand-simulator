import styled from 'styled-components';
import { YesNoToggle } from '../YesNoToggle/YesNoToggle';
import { InputImageLabel } from '../ImageLabel/InputImageLabel';

const RequirementToggleWrapper = styled.div``;

const YesNoToggleWithoutArrow = styled(YesNoToggle)`
  place-items: center;

  & > :last-child::before {
    content: '';
  }

  @media screen and (max-width: 600px) {
    font-size: 0.9em;
  }
`;

const RequirementInputImageLabel = styled(InputImageLabel)`
  margin: 0;
  min-width: 32px;
`;

export const _RequirementToggle = ({
  className = '',
  checked,
  onChange,
  customYes,
  customNo,
  size = 32,
  sprite = 'var(--sprite-action-if-half)',
}: {
  className?: string;
  checked: boolean;
  onChange: () => void;
  customYes?: JSX.Element;
  customNo?: JSX.Element;
  size?: number;
  sprite?: string;
}) => {
  return (
    <RequirementToggleWrapper className={className}>
      <RequirementInputImageLabel size={size} imgUrl={sprite} />
      <YesNoToggleWithoutArrow
        checked={checked}
        onChange={onChange}
        customYes={customYes}
        customNo={customNo}
      ></YesNoToggleWithoutArrow>
      <RequirementInputImageLabel
        size={size}
        imgUrl={'var(--sprite-action-if-else)'}
      />
      <YesNoToggleWithoutArrow
        checked={!checked}
        onChange={onChange}
        customYes={customYes}
        customNo={customNo}
      ></YesNoToggleWithoutArrow>

      <RequirementInputImageLabel
        size={size}
        imgUrl={'var(--sprite-action-if-end)'}
      />
    </RequirementToggleWrapper>
  );
};

export const RequirementToggle = styled(_RequirementToggle)`
  flex: 1 0 24%;
  display: flex;
  flex-wrap: nowrap;
  justify-content: center;
  width: fit-content;
  margin: 0;

  & > :last-child {
  }
`;

export const RequiremementEveryOther = styled(RequirementToggle).attrs(() => ({
  sprite: 'var(--sprite-action-if-half)',
}))``;
export const RequiremementIfEnemy = styled(RequirementToggle).attrs(() => ({
  sprite: 'var(--sprite-action-if-enemy)',
}))``;
export const RequiremementIfProjectiles = styled(RequirementToggle).attrs(
  () => ({
    sprite: 'var(--sprite-action-if-projectile)',
  }),
)``;
export const RequiremementIfHp = styled(RequirementToggle).attrs(() => ({
  sprite: 'var(--sprite-action-if-hp)',
}))``;
