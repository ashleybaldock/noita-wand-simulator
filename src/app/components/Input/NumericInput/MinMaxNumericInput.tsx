import type { ChangeEvent, ChangeEventHandler, MouseEventHandler } from 'react';
import styled from 'styled-components';
import { ABNumericInput } from './';

export const MinMaxNumericInput = styled(ABNumericInput).attrs<{
  valueMin: number,
  valueMax : number,
  setValueMin: (to: number) => void,
  setValueMax: (to: number) => void,
  changeHandlerValueMin: ChangeEventHandler<HTMLInputElement>,
  changeHandlerValueMax: ChangeEventHandler<HTMLInputElement>,
}>(({
  valueA,
valueB,
setValueA,
setValueB,
changeHandlerValueA,
changeHandlerValueB
}) => ({
valueMin: valueA,
valueMax: valueB,
 setValueMin: setValueA,
 setValueMax: setValueB,
 changeHandlerValueMin: changeHandlerValueA,
 changeHandlerValueMax: changeHandlerValueB
}
))``;
