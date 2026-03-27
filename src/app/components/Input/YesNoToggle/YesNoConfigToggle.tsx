import type React from 'react';
import type { MouseEventHandler } from 'react';
import { type ConfigToggleField, useConfigToggle } from '../../../redux';
import { noop } from '../../../util';
import { YesNoCheckbox, InteractiveYesNo, YesNoToggle } from './YesNoToggle';
import { EditableWrapper } from '../../Presentation';
import styled from 'styled-components';

export const YesNoConfigToggle = styled(YesNoToggle).attrs<{
  configField: ConfigToggleField;
}>(({ configField }) => {
  const [toggleState, , , handleToggle, { name, tip }] =
    useConfigToggle(configField);

  return {
    dataName: 'YesNoConfigToggle',
    checked: toggleState,
    onChange: handleToggle,
    title: name,
    tip: tip,
  };
})``;

export const YesNoConfigToggl = ({
  field,
  onClick = noop,
  children,
  className,
  customYes,
  customNo,
}: React.PropsWithChildren<{
  field: ConfigToggleField;
  onClick?: MouseEventHandler<HTMLInputElement>;
  customYes?: React.JSX.Element;
  customNo?: React.JSX.Element;
  className?: string;
}>) => {
  const [toggleState, , , handleToggle, { name, tip }] = useConfigToggle(field);
  // customYes, TODO get from configuration of toggle field
  // customNo,
  return (
    <EditableWrapper
      label={true}
      dataName="YesNoConfigToggle"
      className={className}
    >
      <span>
        {name}
        {children}
      </span>
      <YesNoCheckbox
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
    </EditableWrapper>
  );
};
