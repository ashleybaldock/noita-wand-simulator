import styled from 'styled-components';
import type { CSSProperties, PropsWithChildren } from 'react';
import { EditableWrapper }  from '../Presentation';
import { useSprite } from '../../calc/sprite';
import { WandStatName } from './WandStatName';
import { NumericInput } from '../Input';

const MinMaxNumericInput = styled(ABNumericInput).attrs<{
valueMin,
valueMax,
setValueMin,
setValueMax,
changeHandlerValueMin,
changeHandlerValueMax}>(({
  valueMin,
valueMax,
stValueMin,
setValueMax,
changeHandlerValueMin,
changeHandlerValueMax
}) => (,
value: AvalueMin,
 value BvalueMax,
 setValueA: setValueMin ,
setValueB: setValueMax ,
changeHandlerValueA: changeHandlerValueMin,
changeHandlerValueB: changeHandlerValueMax

))
)``;
