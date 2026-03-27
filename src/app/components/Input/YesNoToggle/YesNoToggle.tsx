import { noop } from '../../../util';
import type { ChangeEventHandler, MouseEventHandler } from 'react';
import styled from 'styled-components';
import { EditableWrapper, YesNo } from '../../Presentation';
import type { Tip } from '../../Tooltips/tooltipId';
import React from 'react';
import type { Sprite } from '../../../calc/sprite';
import type { UsualAttrs } from '../../Types/UsualAttrs';

export const InteractiveYesNo = styled(YesNo)``;

type CheckboxProps = {
  $hidden?: boolean;
};
export const YesNoCheckbox = styled.input.attrs({
  type: 'checkbox',
})<CheckboxProps>`
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
  place-items: center center;

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

  &:checked::before {
    transform: scale(1);
  }
`;

export const YesNoToggle = ({
  sprite,
  checked,
  disabled = false,
  onChange,
  onClick = noop,
  customYes,
  customNo,
  children,
  className,
  dataName,
  tip,
}: UsualAttrs &
  React.PropsWithChildren<{
    sprite?: Sprite;
    checked: boolean;
    disabled?: boolean;
    onChange: ChangeEventHandler<HTMLInputElement>;
    onClick?: MouseEventHandler<HTMLInputElement>;
    customYes?: React.JSX.Element;
    customNo?: React.JSX.Element;
    tip?: Tip;
  }>) => {
  return (
    <EditableWrapper
      dataName={dataName}
      tip={tip}
      className={className}
      disabled={disabled}
      label={true}
    >
      {children}
      <YesNoCheckbox
        disabled={disabled}
        hidden={true}
        checked={checked}
        onChange={onChange}
        onClick={onClick}
      />
      <InteractiveYesNo
        $disabled={disabled}
        yes={checked}
        customYes={customYes}
        customNo={customNo}
      />
    </EditableWrapper>
  );
};
