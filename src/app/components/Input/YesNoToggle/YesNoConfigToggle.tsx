import type React from 'react';
import type { MouseEventHandler } from 'react';
import { type ConfigToggleField, useConfigToggle } from '../../../redux';
import { noop } from '../../../util';
import {
  EditableWrapper,
  YesNoCheckbox,
  InteractiveYesNo,
} from './YesNoToggle';

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
  customYes?: React.JSX.Element;
  customNo?: React.JSX.Element;
  className?: string;
}>) => {
  const [toggleState, , , handleToggle] = useConfigToggle(configToggle);
  // customYes, TODO get from configuration of toggle field
  // customNo,
  return (
    <EditableWrapper data-name="YesNoConfigToggle" className={className}>
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
