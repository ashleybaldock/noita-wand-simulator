import type { ChangeEventHandler } from 'react';
import { type ConfigToggleField, useConfigToggle } from '../../../redux';
import { YesNoToggle } from './YesNoToggle';
import styled from 'styled-components';

export const YesNoConfigToggle = styled(YesNoToggle).attrs<{
  configField: ConfigToggleField;
  checked?: boolean;
  onChange?: ChangeEventHandler<HTMLInputElement>;
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
