import styled from 'styled-components';
import type { CSSProperties, PropsWithChildren } from 'react';
import { EditableWrapper } from '../../Presentation';
import { useSprite } from '../../../calc/sprite';
import { WandStatName } from './WandStatName';
import { NumericInput } from './NumericInput';

const Inputs = styled.div.attrs<UsualAttrs>(({dataName}) => ({'data-name': dataName}))`
  display: contents;
  `;

export const ABNumericInput = ({
  className,dataName,
  separator={'/'}
  smallest,
  largest,
  valueA,
  valueB,
  setValueA,
  setValueB,
  changeHandlerValueA,
  changeHandlerValueB,
   ): UsualAttrs & {
 separator?: string | JSX;
 smallest?: number,
 largest?: number;
 valueA?: number;
 valueB?: number;

}) => {
  return (
    <Inputs className={className} dataName={dataName}>
      <NumericInput
        smallest={0}
        largest={Number.POSITIVE_INFINITY}
        value={valueA}
        setValue={setValueA}
        onChange={changeHandlerValueA}
      ></NumericInput>
      <StatDivider/>
      <NumericInput
        smallest={0}
        largest={Number.POSITIVE_INFINITY}
        value={valueB}
        setValue={setValueB}
        onChange={changeHandlerValueB}
      ></NumericInput>
    </Inputs>
  )};

