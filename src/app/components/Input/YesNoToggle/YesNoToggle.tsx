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

const StyledName = styled.div`
  text-align: left;
  flex: 0 1 auto;
  width: 7.4em;
  white-space: nowrap;

  width: 100%;
  display: flex;
  align-items: center;

  &::after {
    content: '';
    border-bottom: 3px dotted #222222;
    height: 0.7em;
    display: inline-block;
    flex: 1 1 auto;
  }
`;

export const YesNoToggle = ({
  sprite,
  checked,
  disabled = false,
  onChange,
  onClick = noop,
  title,
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
    onChange?: ChangeEventHandler<HTMLInputElement>;
    disabled?: boolean;
    onClick?: MouseEventHandler<HTMLInputElement>;
    title?: string;
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
      sprite={sprite}
    >
      <StyledName>{title}</StyledName>
      {children}
      <YesNoCheckbox
        disabled={disabled}
        hidden={true}
        checked={checked}
        onChange={onChange}
        onClick={onClick}
      />
      <InteractiveYesNo
        disabled={disabled}
        yes={checked}
        customYes={customYes}
        customNo={customNo}
      />
    </EditableWrapper>
  );
};
