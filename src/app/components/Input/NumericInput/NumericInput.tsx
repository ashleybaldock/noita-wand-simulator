import styled from 'styled-components';
import type { ChangeEventHandler, MouseEventHandler } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '../../generic';

const Wrapper = styled.fieldset`
  --bdr: 6px;
  --chint: var(--hint-color, white);

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
    background-size: 32%;
    align-content: center;
    align-items: center;
    justify-content: center;
    align-self: center;
    display: flex;
    background-position: center;
    aspect-ratio: var(--𝚽);
    text-align: center;
    padding: 0;
    width: auto;
    font-size: 1em;
    line-height: 1;
    border-radius: 0;
    border-left-width: 1px;
    border-right-width: 1px;

    transition-property: box-shadow, border-radius;
    transition-duration: 80ms;
    transition-timing-function: ease;
  }

  & > button:first-of-type {
    border-radius: 4px 0 0 4px;
    border-left-width: 2px;
  }

  & > button:last-of-type {
    border-radius: 0 4px 4px 0;
    border-right-width: 2px;
  }

  & > button:hover {
    border-radius: 4px;
    scale: 1.08;

    transition-property: box-shadow, border-radius, scale;
    transition-duration: 80ms;
    transition-timing-function: ease;
  }

  & input:focus-visible {
    z-index: 100;
  }
`;

const NumberInput = styled.input.attrs({
  type: 'text',
  inputMode: 'numeric',
  pattern: '[.0-9]+',
})`
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

  --hover-radius: 2px;

  &:hover {
    border-color: #444;
    box-shadow: 0 0 1px 2px var(--color-numeric-hover);
    z-index: 10;
    border-radius: var(--hover-radius);
  }
  &:first-of-type {
    border-radius: var(--bdr) 0 0 var(--bdr);
  }
  &:first-of-type:hover {
    border-radius: var(--bdr) var(--hover-radius) var(--hover-radius) var(--bdr);
  }
  &:last-of-type {
    border-radius: 0 var(--bdr) var(--bdr) 0;
  }
  &:last-of-type:hover {
    border-radius: var(--hover-radius) var(--bdr) var(--bdr) var(--hover-radius);
  }
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
  value,
  min = 0,
  max = Number.POSITIVE_INFINITY,
  precision = 1,
  minStep = 1,
  step = 1,
  bigStep = 100,
  showStep = true,
  showBigStep = true,
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
    <Wrapper data-name="NumericInput" className={className}>
      {showSetToMin && (
        <ButtonMin data-name="SetMinimum" minimal={true}>{`${min}`}</ButtonMin>
      )}
      {showBigStep && (
        <ButtonBigStepDown
          data-name="BigStepDown"
          minimal={true}
          icon={'icon.chevron.d2x'}
          // hotkeys={'shift+down,ctrl+shift+x'}
        />
      )}
      {showStep && (
        <ButtonStepDown
          data-name="StepDown"
          minimal={true}
          icon={'icon.chevron.d'}
          hotkeys={'down,ctrl+x'}
          onClick={}
        />
      )}
      {children}
      <NumberInput
        data-name="NumberInput"
        ref={inputRef}
        hidden={true}
        onBlur={() => saveChanges()}
        onKeyDown={(e) => e.key === 'Enter' && saveChanges()}
        onChange={(e) => {}}
      />
      {showStep && (
        <ButtonStepUp
          data-name="StepUp"
          minimal={true}
          icon={'icon.chevron.u'}
          hotkeys={'up,ctrl+a'}
        />
      )}
      {showBigStep && (
        <ButtonBigStepUp
          data-name="BigStepUp"
          minimal={true}
          icon={'icon.chevron.u2x'}
          // hotkeys={'shift+up,ctrl+shift+a'}
        />
      )}
      {showSetToMax && (
        <ButtonMax data-name="SetMaximum" minimal={true}>{`${
          max === Number.POSITIVE_INFINITY ? '∞' : max
        }`}</ButtonMax>
      )}
    </Wrapper>
  );
};
