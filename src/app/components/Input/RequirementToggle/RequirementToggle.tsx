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
  sprite = 'data/ui_gfx/gun_actions/if_half.png',
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
        imgUrl={'data/ui_gfx/gun_actions/if_else.png'}
      />
      <YesNoToggleWithoutArrow
        checked={!checked}
        onChange={onChange}
        customYes={customYes}
        customNo={customNo}
      ></YesNoToggleWithoutArrow>

      <RequirementInputImageLabel
        size={size}
        imgUrl={'data/ui_gfx/gun_actions/if_end.png'}
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
