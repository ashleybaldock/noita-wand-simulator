import styled from 'styled-components/macro';
import {
  ChangeEventHandler,
  MouseEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Button } from '../../generic';

const WrapperLabel = styled.label`
  user-select: none;
  cursor: pointer;
`;

const NumberInput = styled.input.attrs({ type: 'number' })`
  margin: 0;
  padding: 0 2px;
  border: none;

  width: 100%;
  flex: 1 1 100%;
  background-color: #000;
  text-align: left;
`;

export const NumericInput = ({
  value,
  min = 0,
  max = Number.POSITIVE_INFINITY,
  precision = 0,
  minStep = 1,
  step = 1,
  bigStep = 100,
  showStep = true,
  showBigStep = true,
  showSetToInfinite = true,
  showSetToMax = true,
  showSetToMin = true,
  parseValue = (v: string, min: number, max: number) =>
    Math.max(
      min,
      Math.min(
        max,
        Math.trunc(
          Math.round(Number.parseFloat(v) * Math.pow(10, precision)) /
            Math.pow(10, precision),
        ),
      ),
    ),
  formatForDisplay = (v) => v.toPrecision(precision),
  children,
}: React.PropsWithChildren<{
  value: number;
  min: number;
  max: number;
  precision: number;
  minStep: number;
  step: number;
  bigStep: number;
  showStep: boolean;
  showBigStep: boolean;
  showSetToInfinite: boolean;
  showSetToMax: boolean;
  showSetToMin: boolean;
  formatForDisplay: (n: number) => string;
  parseValue: (v: string, min: number, max: number) => number;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onClick?: MouseEventHandler<HTMLInputElement>;
}>) => {
  const [displayed, setDisplayed] = useState(formatForDisplay(value));
  const [lastSaved, setLastSaved] = useState(formatForDisplay(value));
  const [valid, setValid] = useState(true);

  const inputRef = useRef<HTMLInputElement>(null);

  const saveChanges = useCallback(() => {}, []);

  const onChange = useEffect(() => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <WrapperLabel>
      {children}
      <Button>{`⤓${min}`}</Button>
      <Button>{`↓${step.toString()}`}</Button>
      <Button>{`⇊${bigStep.toString()}`}</Button>
      <NumberInput
        ref={inputRef}
        hidden={true}
        onBlur={() => saveChanges()}
        onKeyDown={(e) => e.key === 'Enter' && saveChanges()}
        onChange={(e) => {}}
      />
      <Button>{`↑${step.toString()}`}</Button>
      <Button>{`⇈${bigStep.toString()}`}</Button>
      <Button>{`⤒${max}`}</Button>
    </WrapperLabel>
  );
};
