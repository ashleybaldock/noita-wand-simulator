import styled from 'styled-components';
import { ABNumericInput } from './';

export const MinMaxNumericInput = styled(ABNumericInput).attrs<{
  valueMin: typeof ABNumericInput['valueA'],
valueMax,
setValueMin,
setValueMax,
changeHandlerValueMin,
changeHandlerValueMax}>(({
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
