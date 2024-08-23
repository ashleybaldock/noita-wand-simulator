import { noop } from '../../../util';
import type { ChangeEventHandler, MouseEventHandler } from 'react';
import styled from 'styled-components';
import { YesNo } from '../../Presentation';
import { EditableWithLabel } from '../../Presentation/Editable';
import type { ConfigToggleField } from '../../../redux';
import { useConfigToggle } from '../../../redux';

const InteractiveYesNo = styled(YesNo)``;

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

const Wrapper = styled(EditableWithLabel)``;

export const YesNoToggle = ({
  checked,
  onChange,
  onClick = noop,
  customYes,
  customNo,
  children,
  className,
}: React.PropsWithChildren<{
  checked: boolean;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onClick?: MouseEventHandler<HTMLInputElement>;
  customYes?: JSX.Element;
  customNo?: JSX.Element;
  className?: string;
}>) => {
  return (
    <Wrapper data-name="YesNoToggle" className={className}>
      {children}
      <Checkbox
        hidden={true}
        checked={checked}
        onChange={onChange}
        onClick={onClick}
      />
      <InteractiveYesNo
        yes={checked}
        customYes={customYes}
        customNo={customNo}
      />
    </Wrapper>
  );
};

export const YesNoConfigToggle = ({
  configToggle,
  onClick = noop,
  children,
  className,
  customYes,
  customNo,
}: React.PropsWithChildren<{
  configToggle: ConfigToggleField;
  onClick?: MouseEventHandler<HTMLInputElement>;
  customYes?: JSX.Element;
  customNo?: JSX.Element;
  className?: string;
}>) => {
  const [toggleState, , , handleToggle] = useConfigToggle(configToggle);
  // customYes, TODO get from configuration of toggle field
  // customNo,
  return (
    <Wrapper data-name="YesNoConfigToggle" className={className}>
      {children}
      <Checkbox
        hidden={true}
        checked={toggleState}
        onChange={handleToggle}
        onClick={onClick}
      />
      <InteractiveYesNo
        yes={toggleState}
        customYes={customYes}
        customNo={customNo}
      />
    </Wrapper>
  );
};

/*
.khukTi {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.jqbwYa > :first-child {
  flex: 1 1 50%;
}


.gowlYD > :last-child::before {
}

.jqbwYa > :last-child {
  flex: 1 1 50%;
}

.jcCOeu {
  position: relative;
  display: grid;
  place-items: center start;
}

.gowlYD > :last-child:hover::before {
}
 */
