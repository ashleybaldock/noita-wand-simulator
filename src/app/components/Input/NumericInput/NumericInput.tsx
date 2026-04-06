import styled from 'styled-components';
import type { ChangeEvent, ChangeEventHandler, MouseEventHandler } from 'react';
import { useCallback, useState } from 'react';
import { Button } from '../../generic';
import { tipToAttributes, type Tip } from '../../Tooltips/tooltipId';
import { useHotkeys } from 'react-hotkeys-hook';
import { useFocus } from '../../../hooks/useFocus';
import { mergeRefs } from '../../../util/mergeRefs';
import { useValidity } from '../../../hooks/useValidity';
import { useInputValue } from '../../../hooks/useInputValue';
import { noop } from '../../../util';

const Buttons = styled.div<{ vertical: boolean }>`
  display: flex;
  flex-direction: ${({ vertical = false }) => (vertical ? 'column' : 'row')};
  position: absolute;

  border: 1px solid var(--color-bdshade-light);
  border-radius: var(--outer-radius);
  padding: var(--padding);
  background-color: #000;
  --bdr: calc(var(--outer-radius) - var(--padding));
  --outer-radius: 0.5ch;
  --padding: 0.2ch;
  margin: 0 0.5ch;
  box-shadow: 0 0 0 0.2ch #000;
  z-index: 10;
`;

const ButtonsBefore = styled(Buttons)`
  inset: auto 100% auto auto;
`;
const ButtonsAfter = styled(Buttons)`
  inset: auto auto auto 100%;
`;

const NumericInputWrapper = styled.fieldset<{ valid: boolean }>`
  --bdr: 0px;
  --chint: var(--hint-color, #fff);

  position: relative;
  display: flex;
  flex: 1 1 auto;

  border-radius: var(--bdr);
  padding: 0;
  margin: 0.1em 0.2em;
  margin: 0;
  cursor: pointer;
  user-select: none;
  border: 0 solid transparent;
  line-height: normal;
  font-size: 1em;
  text-align: end;
  align-content: center;
  align-items: center;
  background-color: #0000;

  box-sizing: unset;
  width: auto;
  justify-content: center;
  margin-left: 0;
  flex: 0 1 min-content;

  &:hover {
  }

  &:focus-within,
  &:focus-within:hover {
  }

  &:invalid {
    box-shadow:
      0.2ch 0ch 0 0ch var(--color-invalid),
      inset -0.4ch 0 0 -0.2ch var(--color-invalid);
  }
`;

const NumberInput = styled.input`
  background: none;
  background-color: #000;
  caret-color: var(--color-emphasis);
  color: var(--chint);
  font: inherit;
  font-size: 1em;
  line-height: normal;
  text-align: end;
  align-self: center;
  flex: 0 1 auto;
  display: flex;
  align-content: baseline;
  align-items: center;
  justify-content: stretch;
  box-shadow: none;
  border-radius: 0.5ch;
  border: none;
  box-sizing: content-box;
  min-width: 5ch;
  width: 100%;
  max-width: unset;
  margin: 0;
  padding: 0 1ch 0 0.5ch;

  &:focus-visible {
    outline: max(0.2ch, 2px) inset var(--color-bdshade-light);
    outline-offset: max(0.2ch, 2px);
  }
  &:focus-visible:valid {
    box-shadow: inset -0.5ch 0 0 -0.1ch var(--color-valid);
  }
  &:focus-visible:invalid {
    box-shadow: inset -0.5ch 0 0 -0.1ch var(--color-invalid);
  }

  @media screen and (max-width: 500px) {
    justify-content: end;
    padding: 0;
  }
`;

const NumericInputButton = styled(Button)<{ vertical: boolean }>`
  --padding-sides: 1em;
  --hover-radius: 4px;
  aspect-ratio: 1;
  color: white;
  font: inherit;
  font-size: 1em;
  line-height: 1;
  background-color: black;
  z-index: 8;

  align-self: center;
  aspect-ratio: calc(var(--𝚽) * 2 / 3);
  text-align: center;
  padding: 0;
  width: auto;
  font-size: 0.8em;
  line-height: normal;
  border-radius: 0;

  transition-property: box-shadow, border-radius;
  transition-duration: 60ms;
  transition-timing-function: ease;

  opacity: 1;

  margin: 0;
  box-sizing: content-box;
  text-align: center;
  line-height: 0;
  max-height: unset;
  min-height: unset;
  --height: 4em;
  height: var(--height);
  padding: 0.2ch;
  border: 1px solid var(--color-button-border);
  --width: calc(var(--height) * var(--aspect-ratio));
  min-width: var(--width);
  max-width: var(--width);
  --aspect-ratio: calc(var(--𝚽) * 2 / 3);
  display: grid;
  grid-template: 1fr/1fr;
  place-content: center;
  place-items: center;
  background-position: center;
  background-size: contain;
  box-shadow: 0 0 0 0.2ch var(--color-button-border);

  ${({ disabled }) => (disabled ? 'pointer-events: none;' : ``)}

  &:hover {
    border-color: #444;
    box-shadow: 0 0 0 0.2ch var(--color-numeric-border-hover);
    z-index: 10;
    transform: scale(1.08);

    transition-property: box-shadow, border-radius, transform;
    transition-duration: 60ms;
    transition-timing-function: ease;
  }

  &:first-of-type {
    ${({ vertical }) =>
      vertical
        ? `
      border-top-left-radius: var(--bdr);
      border-top-right-radius: var(--bdr);
      border-top-width: 2px;
    `
        : `
      border-top-left-radius: var(--bdr);
      border-bottom-left-radius: var(--bdr);
      border-left-width: 2px;
    `}
  }
  &:first-of-type:hover {
    border-radius: var(--bdr);
  }
  &:last-of-type {
    ${({ vertical }) =>
      vertical
        ? `
      border-bottom-left-radius: var(--bdr);
      border-bottom-right-radius: var(--bdr);
      border-bottom-width: 2px;
    `
        : `
      border-top-right-radius: var(--bdr);
      border-bottom-right-radius: var(--bdr);
      border-right-width: 2px;
    `}
  }
  &:last-of-type:hover {
    border-radius: var(--bdr);
  }
  &:active {
    border-color: var(--color-numeric-border-active);
    box-shadow: 0 0 1px 1px var(--color-numeric-border-active);
    z-index: 10;
    border-radius: var(--bdr);
    transform: scale(1.04);

    transition-property: box-shadow, border-radius, transform;
    transition-duration: 20ms;
    transition-timing-function: ease;
  }
`;
const ButtonSmallest = styled(NumericInputButton)``;
const ButtonSmall = styled(NumericInputButton)``;
const ButtonStepDown = styled(NumericInputButton)``;
const ButtonBigStepDown = styled(NumericInputButton)``;
const ButtonBigStepUp = styled(NumericInputButton)``;
const ButtonStepUp = styled(NumericInputButton)``;
const ButtonLarge = styled(NumericInputButton)``;
const ButtonLargest = styled(NumericInputButton)``;

const default_precision = 5;

export const NumericInput = ({
  smallest = Number.NEGATIVE_INFINITY,
  largest = Number.POSITIVE_INFINITY,
  large = Number.POSITIVE_INFINITY,
  small = 0,
  minStep = 1,
  step = 1,
  bigStep = 100,
  stepButtons = true,
  bigStepButtons = false,
  setLargeButton = false,
  setSmallButton = false,
  setLargestButton = true,
  setSmallestButton = true,
  value,
  setValue,
  parseInput = (v: string) => Number.parseFloat(v),
  clamp = (n: number, min: number, max: number) =>
    Math.max(
      min,
      Math.min(
        max,
        Math.trunc(
          Math.round(n * Math.pow(10, default_precision)) /
            Math.pow(10, default_precision),
        ),
      ),
    ),
  formatForDisplay = (v) =>
    v.toFixed(minStep.toString().split('.')?.[1]?.length ?? 0),
  onChange = noop,
  onInput = noop,
  className = '',
  $tip,
  children,
  $dataName = 'NumericInput',
}: React.PropsWithChildren<{
  /**
   * Smallest valid value
   * @see minButton
   */
  smallest?: number;
  /**
   * Largest valid value
   * @see maxButton
   */
  largest?: number;
  /**
   * Large, but reasonable, default
   * @see largeButton
   */
  large?: number;
  /** 
   * Small, but reasonable, default
   * @see smallButton
   */
  small?: number;
  /**
   * Smallest possible difference between values
   * Determines the resolution of the field
   * @default {undefined] - no limit imposed
   */
  minStep?: number;
  /**
   * Reasonable, small step value
   * Used for the step up and step down buttons (if enabled)
   * and the corresponding keybinds
   * @see stepButtons
   * Cannot be smaller than minStep (which defaults to 1)
   * @see minStep
   */
  step?: number;
  /**
   * Reasonable, large step value
   * Used for the big step up and big step down buttons
   * @see bigStepButtons
   */
  bigStep?: number;
  /**
   * Display buttons to add/subtract value of @see step
   */
  stepButtons?: boolean;
  /**
   * Display buttons to add/subtract value of @see bigStep
   * Not shown if bigStep is undefined
   */
  bigStepButtons?: boolean;
  setLargestButton?: boolean;
  setSmallestButton?: boolean;
  setSmallButton?: boolean;
  setLargeButton?: boolean;
  confirmButton?: boolean;
  cancelButton?: boolean;
  /**
   * Determines how the input string is parsed
   */
  parseInput?: (v: string) => number;
  /**
   * Determines how the current value is formatted for display
   */
  formatForDisplay?: (n: number) => string;
  value: number;
  setValue: (to: number) => void;
  clamp?: (n: number, min: number, max: number) => number;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onInput?: InputEventHandler<HTMLInputElement>;
  onClick?: MouseEventHandler<HTMLInputElement>;
  className?: string;
  $tip?: Tip;
  $dataName?: string;
}>) => {
  const stepUp = Math.max(minStep, step),
    stepDown = stepUp * -1,
    bigStepUp = Math.max(minStep, bigStep),
    bigStepDown = bigStepUp * -1;

  const [lastInput, setLastInput] = useState(value?.toString() ?? '');
  const [editing, setEditing] = useState(false);

  const [inputValidRef, valid, setValid] = useValidity<HTMLInputElement>();
  const [inputFocusRef, focusInput, blurInput] = useFocus<HTMLInputElement>();
  const [inputValueRef, inputValue] = useInputValue<HTMLInputElement>();

  const saveChanges = () => {
    if (valid) {
      setValue(value);
    }
    setEditing(false);
    blurInput();
  };

  const abortChanges = () => {
    setEditing(false);
    blurInput();
  };

  const refocus = () => focusInput();

  const handleInputEvent = useCallback(
    (e: InputEvent<HTMLInputElement>) => {
    const parsed = clamp(parseInput(inputValue ?? 'NaN'), smallest, largest);
    setValid(!Number.isNaN(parsed));
    setLastInput(parsed.toString());
    onInput(e);
  }, [inputValue, parseInput, clamp, smallest, largest]);

  const handleChangeEvent = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const parsed = clamp(parseInput(inputValue ?? 'NaN'), smallest, largest);
      setValid(!Number.isNaN(parsed));
      setLastInput(parsed.toString());
      onChange(e);
    },
    [onChange, inputValue, smallest, largest],
  );

  const onFocus = useCallback(() => {
    setLastInput(value?.toString() ?? '');
    setEditing(true);
  }, [value, setLastInput, setEditing]);

  const onBlur = useCallback(() => {
    setEditing(false);
  }, [setEditing]);

  const changeBy = (by: number) =>
    setValue(clamp(value + by, smallest, largest));

  const changeTo = (to: number) => setValue(clamp(to, smallest, largest));

  const atMaximum = value >= largest;
  const atMinimum = value <= smallest;

  useHotkeys('tab', saveChanges, { preventDefault: false });
  useHotkeys('enter', saveChanges, { preventDefault: true });
  useHotkeys('esc', abortChanges, { preventDefault: true });

  const vertical = true;

  return (
    <NumericInputWrapper
      data-name={$dataName}
      valid={valid}
      className={className}
      {...($tip ? tipToAttributes($tip) : {})}
    >
      {editing && (
        <ButtonsBefore vertical={vertical} data-name="ButtonsBefore">
          {setSmallestButton && (
            <ButtonSmallest
              vertical={vertical}
              dataName="SetMinimum"
              onClick={() => {
                changeBy(Number.NEGATIVE_INFINITY);
                refocus();
              }}
              icon={'none'}
              minimal={true}
              disabled={value <= smallest}
              hotkeys={'shift+alt+down'}
            >
              {`${smallest === Number.NEGATIVE_INFINITY ? '−∞' : smallest}`}
            </ButtonSmallest>
          )}
          {setSmallButton && (
            <ButtonSmall
              vertical={vertical}
              dataName="SetSmall"
              onClick={() => {
                changeTo(small);
                refocus();
              }}
              icon={'none'}
              minimal={true}
              disabled={value <= small}
              hotkeys={'shift+alt+down'}
            >
              {`${small}`}
            </ButtonSmall>
          )}
          {bigStepButtons && (
            <ButtonBigStepDown
              vertical={vertical}
              dataName="BigStepDown"
              minimal={true}
              icon={'icon.chevron.d2x'}
              disabled={atMinimum}
              onClick={() => {
                changeBy(bigStepDown);
                refocus();
              }}
              hotkeys={'alt+down,ctrl+shift+x'}
            />
          )}
          {stepButtons && (
            <ButtonStepDown
              vertical={vertical}
              dataName="StepDown"
              minimal={true}
              icon={'icon.chevron.d'}
              disabled={atMinimum}
              hotkeys={'down,ctrl+x'}
              onClick={() => {
                changeBy(stepDown);
                refocus();
              }}
            />
          )}
        </ButtonsBefore>
      )}
      {children}
      <NumberInput
        data-name="NumberInput"
        type="text"
        inputMode="numeric"
        pattern="-?\d*\.?\d*"
        value={editing ? lastInput : formatForDisplay(value)}
        ref={mergeRefs(inputFocusRef, inputValidRef, inputValueRef)}
        hidden={true}
        onFocus={() => onFocus()}
        onBlur={() => onBlur()}
        onInput={(e) => handleInputEvent(e)}
        onChange={(e) => handleChangeEvent(e)}
        enterKeyHint="done"
      />
      {/* onKeyDown={(e) => */}
      {/*   ((e.key === 'Enter' || e.key === 'Tab') && saveChanges()) || */}
      {/*   (e.key === 'Esc' && abortChanges()) */}
      {/* } */}
      {editing && (
        <ButtonsAfter vertical={vertical} data-name="ButtonsAfter">
          {stepButtons && (
            <ButtonStepUp
              vertical={vertical}
              dataName="StepUp"
              minimal={true}
              disabled={atMaximum}
              icon={'icon.chevron.u'}
              hotkeys={'up,ctrl+a'}
              onClick={() => {
                changeBy(stepUp);
                refocus();
              }}
            />
          )}
          {bigStepButtons && (
            <ButtonBigStepUp
              vertical={vertical}
              dataName="BigStepUp"
              minimal={true}
              disabled={atMaximum}
              icon={'icon.chevron.u2x'}
              hotkeys={'alt+up,ctrl+shift+a'}
              onClick={() => {
                changeBy(bigStepUp);
                refocus();
              }}
            />
          )}
          {setLargeButton && (
            <ButtonLarge
              vertical={vertical}
              dataName="SetLarge"
              onClick={() => {
                changeTo(large);
                refocus();
              }}
              icon={'none'}
              minimal={true}
              disabled={value >= large}
              hotkeys={'shift+alt+up'}
            >
              {`${large}`}
            </ButtonLarge>
          )}
          {setLargestButton && (
            <ButtonLargest
              vertical={vertical}
              dataName="SetMaximum"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                changeBy(Number.POSITIVE_INFINITY);
                refocus();
              }}
              icon={'none'}
              minimal={true}
              disabled={atMaximum}
              hotkeys={'shift+alt+up'}
            >
              {`${largest === Number.POSITIVE_INFINITY ? '∞' : largest}`}
            </ButtonLargest>
          )}
        </ButtonsAfter>
      )}
    </NumericInputWrapper>
  );
};
