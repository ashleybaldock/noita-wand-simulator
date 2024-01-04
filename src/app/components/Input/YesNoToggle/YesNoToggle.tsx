import { noop } from '../../../util';
import { ChangeEventHandler, MouseEventHandler } from 'react';
import styled from 'styled-components';
import { YesNo } from '../../Presentation';

type CheckboxProps = {
  $hidden?: boolean;
};
export const Checkbox = styled.input.attrs({ type: 'checkbox' })<CheckboxProps>`
  --form-control-color: white;

  appearance: none;
  background-color: #000;
  margin: 0;

  ${({ $hidden }) =>
    $hidden
      ? `
  display: grid;
  `
      : `
  display: none;
  `}
  place-content: center;

  font: inherit;
  color: currentColor;
  width: 1.15em;
  height: 1.15em;
  border: 0.15em solid currentColor;
  border-radius: 0.15em;
  transform: translateY(-0.075em);

  &::before {
    content: '';
    width: 0.65em;
    height: 0.65em;
    transform: scale(0);
    transition: 20ms transform ease-in-out;
    box-shadow: inset 1em 1em var(--form-control-color);
  }
  &&:checked::before {
    transform: scale(1);
  }
`;

const WrapperLabel = styled.label`
  display: flex;
  flex-direction: row;
  user-select: none;
  cursor: pointer;
  position: relative;
`;

const InteractiveYesNo = styled(YesNo)`
  text-decoration: underline dotted var(--color-toggle-hover) 1.4px;
`;

export const YesNoToggle = ({
  checked,
  onChange,
  onClick = noop,
  children,
  className,
}: React.PropsWithChildren<{
  checked: boolean;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onClick?: MouseEventHandler<HTMLInputElement>;
  className?: string;
}>) => {
  return (
    <WrapperLabel className={className}>
      {children}
      <Checkbox
        hidden={true}
        checked={checked}
        onChange={onChange}
        onClick={onClick}
      />
      <InteractiveYesNo yes={checked} />
    </WrapperLabel>
  );
};
