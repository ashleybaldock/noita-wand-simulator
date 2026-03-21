import type React from 'react';
import type { MouseEventHandler } from 'react';
import { type ConfigToggleField, useConfigToggle } from '../../../redux';
import { noop } from '../../../util';
import { YesNoCheckbox, InteractiveYesNo } from './YesNoToggle';
import { EditableWrapper } from '../../Presentation';

export const YesNoConfigToggle = ({
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
  const [toggleState, , , handleToggle] = useConfigToggle(field);
  // customYes, TODO get from configuration of toggle field
  // customNo,
  return (
    <EditableWrapper
      label={true}
      dataName="YesNoConfigToggle"
      className={className}
    >
      {children}
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
