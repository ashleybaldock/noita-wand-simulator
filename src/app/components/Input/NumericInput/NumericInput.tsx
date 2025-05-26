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
  width: 5em;
  flex: 1 1 fit-content;
  background-color: #000;

  caret-color: white;
  color: var(--chint);
  border: 1px solid #222;
  font: inherit;
  font-size: 1em;
  text-align: left;
  padding: 0.5ch 0.5ch 0.3ch 0.5ch;
  line-height: 1;
  margin: 0 0.1ch;
  display: flex;
  align-self: center;
  box-sizing: border-box;
  border-radius: 0.3em;
  box-shadow: inset 0 0px 2px 2px #595959;

  &:valid {
    box-shadow: inset 0 0px 2px 2px red;
  }
  &:invalid {
    box-shadow: inset 0 0px 1px 1px green;
  }

  &:focus-visible {
    outline: 1.6px inset #d18811;
    border-radius: 7px;
    outline-offset: -1px;
    box-shadow: 0 1px 0 1px #704d14, 1px 0 0 1px #7c4f05, -1px 0 0 1px #a7782c,
      0 -1px 0 1px #ffb53e;
  }
`;

const NumericInputButton = styled(Button)`
  --padding-sides: 1em;
  --hover-radius: 4px;
  aspect-ratio: 1;
  height: 2em;
  color: white;
  font: inherit;
  font-size: 1em;
  line-height: 1;
  background-color: black;
  background-position: center center;
  background-size: 44%;
  border: 1px solid #444;
  border-radius: 0;
  box-sizing: border-box;
  flex: 0;
  display: flex;
  padding-top: 0.6em;
  padding-left: var(--padding-sides);
  padding-right: var(--padding-sides);
  margin: 0;
  z-index: 8;

  ${(props) =>
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
  &:first-of-type:hover {
    border-radius: var(--bdr) var(--hover-radius) var(--hover-radius) var(--bdr);
  }
  &:last-of-type:hover {
    border-radius: var(--hover-radius) var(--bdr) var(--bdr) var(--hover-radius);
  &:active {
    border-color: #666;
    box-shadow: 0 0 1px 2px var(--color-numeric-hover);
    z-index: 10;
    border-radius: var(--hover-radius);
    scale: 1.04;
  `}
`;
const ButtonMin = styled(NumericInputButton)``;
const ButtonSmall = styled(NumericInputButton)``;
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
const ButtonLarge = styled(NumericInputButton)``;
const ButtonMax = styled(NumericInputButton)``;

export const NumericInput = ({
  min = Number.NEGATIVE_INFINITY,
  max = Number.POSITIVE_INFINITY,
  large = Number.POSITIVE_INFINITY,
  small = 0,
  precision = 5,
  minStep = 1,
  step = 1,
  bigStep = 100,
  showStep = true,
  showBigStep = false,
  showSetToLarge = false,
  showSetToSmall = false,
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
  large?: number;
  small?: number;
  precision?: number;
  minStep?: number;
  step?: number;
  bigStep?: number;
  showStep?: boolean;
  showBigStep?: boolean;
  showSetToMax?: boolean;
  showSetToMin?: boolean;
  showSetToSmall?: boolean;
  showSetToLarge?: boolean;
  formatForDisplay?: (n: number) => string;
  value: number;
  setValue: (to: number) => void;
  clamp?: (n: number, min: number, max: number) => number;
  parseInput?: (v: string) => number;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onClick?: MouseEventHandler<HTMLInputElement>;
  className?: string;
}>) => {
  const [lastInput, setLastInput] = useState(value?.toString() ?? '');
  const [valid, setValid] = useState(true);
  const [editing, setEditing] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const saveChanges = () => valid && setEditing(false);

  const abortChanges = () => setEditing(false);

  const onValidityChange = useEffect(() => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus();

      if (valid) {
        inputRef.current.setCustomValidity('');
      } else {
        inputRef.current.setCustomValidity('Invalid');
      }
    }
  }, [inputRef, valid]);

  const handleOnInput = useCallback(() => {
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
    setLastInput(parsed.toString());
  }, [inputRef, min, max]);

  const handleOnChange = useCallback(() => {}, [inputRef, min, max]);

  const handleOnFocus = useCallback(() => {
    setLastInput(value?.toString() ?? '');
    setEditing(true);
  }, [value]);

  const handleOnBlur = useCallback(() => {
    setEditing(false);
  }, [value]);

  const changeBy = (by: number) => setValue(clamp(value + by, min, max));

  const changeTo = (to: number) => setValue(clamp(to, min, max));

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
        >
          {`${min === Number.NEGATIVE_INFINITY ? '−∞' : min}`}
        </ButtonMin>
      )}
      {showSetToSmall && (
        <ButtonSmall
          data-name="SetSmall"
          onClick={() => changeTo(small)}
          minimal={true}
          disabled={value === small}
          // hotkeys={''}
        >
          {`${small}`}
        </ButtonSmall>
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
        onInput={(e) => handleOnInput()}
        onChange={(e) => handleOnChange()}
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
      {showSetToLarge && (
        <ButtonLarge
          data-name="SetLarge"
          onClick={() => changeTo(large)}
          minimal={true}
          disabled={value === large}
          // hotkeys={''}
        >
          {`${large}`}
        </ButtonLarge>
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
