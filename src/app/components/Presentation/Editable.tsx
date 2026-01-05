import styled from 'styled-components';
import { useConfigToggle } from '../../redux';
import { tipToAttributes, type Tip } from '../Tooltips/tooltipId';

const StyledEditable = styled.div<{
  $accessHints?: boolean;
  $disabled?: boolean;
}>`
  ${({ $accessHints = true }) =>
    $accessHints
      ? `text-decoration: underline dotted var(--color-toggle-hover) 1.4px;`
      : ''}
  &:hover {
    color: var(--color-toggle-hover);
  }
  cursor: pointer;
  position: relative;

  &::before {
    left: -10px;
    content: '>';
    position: absolute;
    padding-left: 0px;
  }
`;

export const Editable = ({
  className,
  children,
  $disabled = false,
  $dataName = 'Editable',
  $tip,
}: React.PropsWithChildren<{
  className?: string;
  $disabled?: boolean;
  $dataName?: string;
  $tip?: Tip;
}>) => {
  const [hideAccessibilityHints] = useConfigToggle('hideAccessibilityHints');
  // const [mirrorControls] = useConfigToggle('mirrorControls');

  return (
    <StyledEditable
      data-name={$dataName}
      className={className}
      $disabled={$disabled}
      $accessHints={!hideAccessibilityHints}
      {...($tip ? tipToAttributes($tip) : {})}
    >
      {children}
    </StyledEditable>
  );
};
