import styled from 'styled-components';
import { YesNoToggle } from '../YesNoToggle/YesNoToggle';
import { InputImageLabel } from '../ImageLabel/InputImageLabel';
import type { SpriteName } from '../../../calc/sprite';

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
  icon = 'icon.spell.IF_HALF',
}: {
  className?: string;
  checked: boolean;
  onChange: () => void;
  customYes?: JSX.Element;
  customNo?: JSX.Element;
  size?: number;
  icon?: SpriteName;
}) => {
  return (
    <RequirementToggleWrapper className={className}>
      <RequirementInputImageLabel $size={size} icon={icon} />
      <YesNoToggleWithoutArrow
        checked={checked}
        onChange={onChange}
        customYes={customYes}
        customNo={customNo}
      ></YesNoToggleWithoutArrow>
      <RequirementInputImageLabel $size={size} icon={'icon.spell.IF_ELSE'} />
      <YesNoToggleWithoutArrow
        checked={!checked}
        onChange={onChange}
        customYes={customYes}
        customNo={customNo}
      ></YesNoToggleWithoutArrow>

      <RequirementInputImageLabel $size={size} icon={'icon.spell.IF_END'} />
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
  icon: 'icon.spell.IF_HALF',
}))``;
export const RequiremementIfEnemy = styled(RequirementToggle).attrs(() => ({
  icon: 'icon.spell.IF_ENEMY',
}))``;
export const RequiremementIfProjectiles = styled(RequirementToggle).attrs(
  () => ({
    icon: 'icon.spell.IF_PROJECTILE',
  }),
)``;
export const RequiremementIfHp = styled(RequirementToggle).attrs(() => ({
  icon: 'icon.spell.IF_HP',
}))``;
