import styled from 'styled-components';
import type { ChangeEventHandler, MouseEventHandler } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '../../generic';

const WrapperLabel = styled.label`
  --bdr: 6px;
  --chint: var(--hint-color, white);

  display: flex;

  border-radius: var(--bdr);
  padding: 0;
  margin: 0.1em 0.2em;
  cursor: pointer;
  user-select: none;

  &:focus-within {
    box-shadow: 0 0 1px 0.4px var(--color-toggle-hover);
  }
`;

const NumberInput = styled.input.attrs({ type: 'number' })`
  margin: 0;
  padding: 0 2px;
  border: none;

  width: 100%;
  flex: 1 1 100%;
  background-color: #000;
  text-align: left;

  background-color: black;
  caret-color: white;
  color: var(--chint);
  font: inherit;
  border: 1px solid #222;
  font-size: 1.2em;
  padding: 0.3em 0 0.1em 0;
  margin: 0;
  display: flex;
  align-self: center;

  &:focus-visible {
    border: 1px solid #c76464;
    box-shadow: 0 0 2px 1px currentColor inset;
  }
`;
const NumericInputButton = styled(Button)`
  flex: 1 1;
  aspect-ratio: 1;
  align-self: center;
  height: 2em;
  font: inherit;
  background-color: black;
  color: white;
  border-radius: 0;
  display: flex;
  align-content: baseline;
  align-items: center;
  justify-content: center;
  padding-top: 0.1em;
  margin: 0;
  border: 1px solid #444;
`;
const ButtonMin = styled(NumericInputButton)`
  border-radius: var(--bdr) 0 0 var(--bdr);
`;
const ButtonStepDown = styled(NumericInputButton)`
  border-left-width: 0;
`;
const ButtonBigStepDown = styled(NumericInputButton)`
  border-left-width: 0;
`;
const ButtonBigStepUp = styled(NumericInputButton)`
  border-right-width: 0;
`;
const ButtonStepUp = styled(NumericInputButton)`
  border-right-width: 0;
`;
const ButtonMax = styled(NumericInputButton)`
  border-radius: 0 var(--bdr) var(--bdr) 0;
`;

export const NumericInput = ({
  value,
  min = 0,
  max = Number.POSITIVE_INFINITY,
  precision = 1,
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
  className = '',
  children,
}: React.PropsWithChildren<{
  value: number;
  min?: number;
  max?: number;
  precision?: number;
  minStep?: number;
  step?: number;
  bigStep?: number;
  showStep?: boolean;
  showBigStep?: boolean;
  showSetToInfinite?: boolean;
  showSetToMax?: boolean;
  showSetToMin?: boolean;
  formatForDisplay?: (n: number) => string;
  parseValue?: (v: string, min: number, max: number) => number;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onClick?: MouseEventHandler<HTMLInputElement>;
  className?: string;
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
    <WrapperLabel className={className}>
      {children}
      <ButtonMin minimal={true}>{`${min}`}</ButtonMin>
      {showBigStep && (
        <ButtonBigStepDown minimal={true}>{`⇊`}</ButtonBigStepDown>
      )}
      {showStep && <ButtonStepDown minimal={true}>{`↓`}</ButtonStepDown>}
      <NumberInput
        ref={inputRef}
        hidden={true}
        onBlur={() => saveChanges()}
        onKeyDown={(e) => e.key === 'Enter' && saveChanges()}
        onChange={(e) => {}}
      />
      {showStep && <ButtonStepUp minimal={true}>{`↑`}</ButtonStepUp>}
      {showBigStep && <ButtonBigStepUp minimal={true}>{`⇈`}</ButtonBigStepUp>}
      <ButtonMax minimal={true}>{`${
        max === Number.POSITIVE_INFINITY ? '∞' : max
      }`}</ButtonMax>
    </WrapperLabel>
  );
};
