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

const StyledEditableWithLabel = styled.label<{
  $accessHints?: boolean;
  $disabled?: boolean;
}>`
  display: flex;
  flex-direction: row;
  cursor: pointer;

  @media screen and (max-width: 500px) {
    background-position: 0.25ch 50%;
    border-bottom: var(--ou) dotted #222;
    padding: var(--ou) 0.5ch var(--ou) 2.5ch;
  }

  & > :last-child {
    ${({ $accessHints = true }) =>
      $accessHints
        ? `text-decoration: underline dotted var(--color-toggle-hover) 1.4px;`
        : ''}
    position: relative;
    width: 100%;
    justify-content: end;
  }
  &:hover {
    color: var(--color-toggle-hover);
  }

  & > :last-child::before {
    left: -30px;
    content: '>';
    position: absolute;
    padding-left: 0px;
    scale: 0;
    transition-property: scale, color, opacity, left;
    transition-duration: 200ms;
    transition-timing-function: ease-in-out;
    color: black;
  }
  &&:hover > :last-child::before {
    opacity: 1;
    color: yellow;
    scale: 1;
    left: -12px;
    transition-property: scale, color, opacity, left;
    transition-duration: 200ms;
    transition-timing-function: ease-in-out;
  }
`;

export const EditableWithLabel = ({
  className,
  children,
  $disabled = false,
  $dataName = 'EditableWithLabel',
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
    <StyledEditableWithLabel
      data-name={$dataName}
      className={className}
      $disabled={$disabled}
      $accessHints={!hideAccessibilityHints}
      {...($tip ? tipToAttributes($tip) : {})}
    >
      {children}
    </StyledEditableWithLabel>
  );
};
