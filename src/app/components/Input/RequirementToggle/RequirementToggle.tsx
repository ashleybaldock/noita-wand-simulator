import styled from 'styled-components';
import { YesNoToggle } from '../YesNoToggle/YesNoToggle';
import { InputImageLabel } from '../ImageLabel/InputImageLabel';

const RequirementToggleWrapper = styled.div``;

const YesNoToggleWithoutArrow = styled(YesNoToggle)`
  & > :last-child::before {
    content: '';
  }
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
      <YesNoToggleWithoutArrow
        checked={checked}
        onChange={onChange}
        customYes={customYes}
        customNo={customNo}
      >
        <InputImageLabel size={size} imgUrl={sprite} />
      </YesNoToggleWithoutArrow>
      <YesNoToggleWithoutArrow
        checked={!checked}
        onChange={onChange}
        customYes={customYes}
        customNo={customNo}
      >
        <InputImageLabel
          size={size}
          imgUrl={'data/ui_gfx/gun_actions/if_else.png'}
        />
      </YesNoToggleWithoutArrow>

      <InputImageLabel
        size={size}
        imgUrl={'data/ui_gfx/gun_actions/if_end.png'}
      />
    </RequirementToggleWrapper>
  );
};

export const RequirementToggle = styled(_RequirementToggle)`
  display: flex;
  flex: 1 1 40%;
  justify-content: center;
  margin: 0.1em 0.4em;

  & > :last-child {
    flex: 0 0;
  }
`;