import styled from 'styled-components';
import type { ChangeEventHandler, MouseEventHandler } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '../../generic';

const Wrapper = styled.fieldset<{ $valid: boolean }>`
  --bdr: 6px;
  --chint: var(--hint-color, #fff);

  display: flex;

  border-radius: var(--bdr);
  padding: 0;
  margin: 0.1em 0.2em;
  cursor: pointer;
  user-select: none;
  border: 0 solid transparent;

  &:hover {
    box-shadow: 0 0 4px 2px var(--color-numeric-hover);
  }

  &:focus-within,
  &:focus-within:hover {
    box-shadow: 0 0 1px 0.4px var(--color-numeric-focus);
  }

  & > button {
    height: 2em;
    background-size: 48%;
    align-content: center;
    align-items: center;
    justify-content: center;
    align-self: center;
    display: flex;
    background-position: center;
    aspect-ratio: calc(1 / var(--𝚽));
    aspect-ratio: calc(var(--𝚽) * 2 / 3);
    text-align: center;
    padding: 0;
    width: auto;
    font-size: 1em;
    line-height: 1;
    border-radius: 0;
    border-left-width: 1px;
    border-right-width: 1px;

    transition-property: box-shadow, border-radius;
    transition-duration: 60ms;
    transition-timing-function: ease;
  }

  & > button:first-of-type {
    border-radius: var(--bdr) 0 0 var(--bdr);
    border-left-width: 2px;
  }

  & > button:last-of-type {
    border-radius: 0 var(--bdr) var(--bdr) 0;
    border-right-width: 2px;
  }

  & > button:hover {
    transition-property: box-shadow, border-radius, scale;
    transition-duration: 60ms;
    transition-timing-function: ease;
  }

  & > button:active {
    transition-property: box-shadow, border-radius, scale;
    transition-duration: 20ms;
    transition-timing-function: ease;
  }

  & input:focus-visible {
    z-index: 100;

    ${($valid) => ($valid ? '' : 'background-color: red;')}
  }
`;

const NumberInput = styled.input`
  width: 100%;
  height: 2em;
  flex: 1 1 100%;
  background-color: #000;

  caret-color: white;
  color: var(--chint);
  border: 1px solid #222;
  font: inherit;
  font-size: 1em;
  text-align: left;
  padding: 0.22em 0.4em 0 0.4em;
  line-height: 1;
  margin: 0;
  display: flex;
  align-self: center;
  box-sizing: border-box;

  &:focus-visible {
  }
`;

const NumericInputButton = styled(Button)`
  flex: 1 1;
  aspect-ratio: 1;
  align-self: center;
  height: 2em;
  font: inherit;
  background-color: black;
  background-position: center center;
  color: white;
  border-radius: 0;
  display: flex;
  box-sizing: border-box;
  align-content: baseline;
  align-items: center;
  justify-content: center;
  padding-top: 0.1em;
  --padding-sides: 0.6em;
  padding-left: var(--padding-sides);
  padding-right: var(--padding-sides);
  margin: 0;
  border: 1px solid #444;
  padding-top: 0.6em;
  --padding-sides: 1em;
  font-size: 1em;
  line-height: 1;
  background-size: 44%;
  z-index: 8;

  --hover-radius: 4px;

  ${(props) => `
  ${
    props.disabled
      ? ''
      : `
  &:hover {
    border-color: #444;
    box-shadow: 0 0 1px 1px var(--color-numeric-hover);
    z-index: 10;
    border-radius: var(--hover-radius);
    scale: 1.08;
  }
  `
  }
  ${
    props.disabled
      ? ''
      : `
  &:first-of-type:hover {
    border-radius: var(--bdr) var(--hover-radius) var(--hover-radius) var(--bdr);
  }
  `
  }
  ${
    props.disabled
      ? ''
      : `
  &:last-of-type:hover {
    border-radius: var(--hover-radius) var(--bdr) var(--bdr) var(--hover-radius);
  }
  `
  }

  ${
    props.disabled
      ? ''
      : `
  &:active {
    border-color: #666;
    box-shadow: 0 0 1px 2px var(--color-numeric-hover);
    z-index: 10;
    border-radius: var(--hover-radius);
    scale: 1.04;
  }
  `
  }
  `}
`;
const ButtonMin = styled(NumericInputButton)``;
const ButtonStepDown = styled(NumericInputButton)`
  margin-left: -1px;
`;
const ButtonBigStepDown = styled(NumericInputButton)`
  margin-left: -1px;
`;
const ButtonBigStepUp = styled(NumericInputButton)`
  margin-right: -1px;
`;
const ButtonStepUp = styled(NumericInputButton)`
  margin-right: -1px;
`;
const ButtonMax = styled(NumericInputButton)``;

export const NumericInput = ({
  min = Number.NEGATIVE_INFINITY,
  max = Number.POSITIVE_INFINITY,
  precision = 5,
  minStep = 1,
  step = 1,
  bigStep = 100,
  showStep = true,
  showBigStep = true,
  showSetToMax = true,
  showSetToMin = true,
  value,
  setValue,
  parseInput = (v: string) => Number.parseFloat(v),
  clamp = (n: number, min: number, max: number) =>
    Math.max(
      min,
      Math.min(
        max,
        Math.trunc(
          Math.round(n * Math.pow(10, precision)) / Math.pow(10, precision),
        ),
      ),
    ),
  formatForDisplay = (v) => v.toPrecision(precision),
  onChange,
  className = '',
  children,
}: React.PropsWithChildren<{
  min?: number;
  max?: number;
  precision?: number;
  minStep?: number;
  step?: number;
  bigStep?: number;
  showStep?: boolean;
  showBigStep?: boolean;
  showSetToMax?: boolean;
  showSetToMin?: boolean;
  formatForDisplay?: (n: number) => string;
  value: number;
  setValue: (to: number) => void;
  clamp?: (n: number, min: number, max: number) => number;
  parseInput?: (v: string) => number;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onClick?: MouseEventHandler<HTMLInputElement>;
  className?: string;
}>) => {
  // const [displayed, setDisplayed] = useState(value);
  const [lastInput, setLastInput] = useState(value);
  const [valid, setValid] = useState(true);
  const [editing, setEditing] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const saveChanges = () => valid && setEditing(false);

  const abortChanges = () => setEditing(false);

  const onInputChange = useEffect(() => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus();
    }
    const parsed = clamp(
      parseInput(inputRef.current?.value ?? 'NaN'),
      min,
      max,
    );
    if (Number.isNaN(parsed)) {
      setValid(false);
    } else {
      setValid(true);
    }
  }, [inputRef, min, max]);

  const handleOnFocus = useCallback(() => {
    setLastInput(value);
    setEditing(true);
  }, [value]);

  const handleOnBlur = useCallback(() => {
    // setCurrentValue(value);
    setEditing(false);
  }, [value]);

  const changeBy = (by: number) => setValue(clamp(value + by, min, max));

  const atMaximum = value >= max;
  const atMinimum = value <= min;

  return (
    <Wrapper data-name="NumericInput" $valid={valid} className={className}>
      {showSetToMin && (
        <ButtonMin
          data-name="SetMinimum"
          onClick={() => changeBy(Number.NEGATIVE_INFINITY)}
          minimal={true}
          disabled={atMinimum}
          // hotkeys={''}
        >{`${min}`}</ButtonMin>
      )}
      {showBigStep && (
        <ButtonBigStepDown
          data-name="BigStepDown"
          minimal={true}
          icon={'icon.chevron.d2x'}
          disabled={atMinimum}
          onClick={() => changeBy(bigStep * -1)}
          // hotkeys={'shift+down,ctrl+shift+x'}
        />
      )}
      {showStep && (
        <ButtonStepDown
          data-name="StepDown"
          minimal={true}
          icon={'icon.chevron.d'}
          disabled={atMinimum}
          hotkeys={'down,ctrl+x'}
          onClick={() => changeBy(step * -1)}
        />
      )}
      {children}
      <NumberInput
        data-name="NumberInput"
        type="text"
        inputMode="numeric"
        pattern="-?\d*\.?\d*"
        value={editing ? lastInput : value}
        ref={inputRef}
        hidden={true}
        onFocus={() => handleOnFocus()}
        onBlur={() => handleOnBlur()}
        onKeyDown={(e) =>
          ((e.key === 'Enter' || e.key === 'Tab') && saveChanges()) ||
          (e.key === 'Esc' && abortChanges())
        }
        onChange={onChange}
      />
      {showStep && (
        <ButtonStepUp
          data-name="StepUp"
          minimal={true}
          disabled={atMaximum}
          icon={'icon.chevron.u'}
          hotkeys={'up,ctrl+a'}
          onClick={() => changeBy(step)}
        />
      )}
      {showBigStep && (
        <ButtonBigStepUp
          data-name="BigStepUp"
          minimal={true}
          disabled={atMaximum}
          icon={'icon.chevron.u2x'}
          // hotkeys={'shift+up,ctrl+shift+a'}
          onClick={() => changeBy(bigStep)}
        />
      )}
      {showSetToMax && (
        <ButtonMax
          data-name="SetMaximum"
          onClick={() => changeBy(Number.POSITIVE_INFINITY)}
          minimal={true}
          disabled={atMaximum}
          // hotkeys={''}
        >
          {`${max === Number.POSITIVE_INFINITY ? '∞' : max}`}
        </ButtonMax>
      )}
    </Wrapper>
  );
};
