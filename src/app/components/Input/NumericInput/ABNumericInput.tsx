import type { ChangeEvent, ChangeEventHandler, MouseEventHandler } from 'react';
import styled from 'styled-components';
import type { CSSProperties, PropsWithChildren } from 'react';
import { EditableWrapper } from '../../Presentation';
import { useSprite } from '../../../calc/sprite';
import type { UsualAttrs } from '../../Types/UsualAttrs';
import { NumericInput, StatSep } from '.';

const Inputs = styled.div.attrs<UsualAttrs>(({dataName}) => ({'data-name': dataName}))`
  display: contents;
  `;

export const ABNumericInput = ({
  className,
  dataName,
  separator = <StatSep/>,
  smallest,
  largest,
  valueA,
  valueB,
  setValueA,
  setValueB,
  changeHandlerValueA,
  changeHandlerValueB
} : UsualAttrs & {
 separator?: string | React.JSX.Element;
 smallest?: number,
 largest?: number;
 valueA: number;
 valueB: number;
setValueA: (to: number) => void;
setValueB: (to: number) => void;
changeHandlerValueA?: ChangeEventHandler<HTMLInputElement>;
changeHandlerValueB?: ChangeEventHandler<HTMLInputElement>

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
      {separator}
      <NumericInput
        smallest={0}
        largest={Number.POSITIVE_INFINITY}
        value={valueB}
        setValue={setValueB}
        onChange={changeHandlerValueB}
      ></NumericInput>
    </Inputs>
  )};

