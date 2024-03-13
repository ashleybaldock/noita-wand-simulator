import type { ChangeEvent, RefObject } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Editable } from '../Presentation/Editable';

const Value = styled.input.attrs({
  type: 'text',
})<{ $isEditing: boolean }>`
  height: 100%;
  margin: 0;
  padding: 0 2px;
  border: none;

  background-color: #000;
  font-family: var(--font-family-noita-default);
  font-size: 16px;
  color: var(--color-button);
  text-align: right;
  text-decoration: underline dotted var(--color-toggle-hover) 1.4px;
  cursor: pointer;

  width: 100%;
  flex: 1 1 100%;

  input[type='number'] {
    position: relative;
    padding: 5px;
    padding-right: 25px;
  }
  & {
    -moz-appearance: textfield;
    appearance: textfield;
    margin: 0;
  }

  ${({ $isEditing }) =>
    $isEditing
      ? `
  font-size: 16px;
  color: #fff;
  text-align: center;
  text-decoration: none;
    `
      : `
  height: 15px;
  margin: 0;
  padding: 0 2px;
  border: none;
      `}
`;

const Wrapper = styled(Editable)``;

export const EditableInteger = (props: {
  value: number;
  step?: number;
  onChange: (value: number) => void;
  formatValue?: (value: number) => string;
  convertRawValue?: (rawValue: number) => number;
  convertDisplayValue?: (displayValue: number) => number;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(props.value);
  const [isInvalidValue, setIsInvalidValue] = useState(false);
  const [invalidValue, setInvalidValue] = useState('');
  const inputRef = useRef<HTMLInputElement>();

  const {
    value,
    step,
    onChange,
    formatValue,
    convertRawValue = (n: number) => n,
    convertDisplayValue,
  } = props;

  const handleSaveChange = useCallback(() => {
    if (!isInvalidValue) {
      onChange(currentValue);
    } else {
      setCurrentValue(value);
      setIsInvalidValue(false);
    }
    setIsEditing(false);
  }, [currentValue, isInvalidValue, onChange, value]);

  const handleStartEditing = useCallback(() => {
    setCurrentValue(value);
    setIsEditing(true);
  }, [value]);

  useEffect(() => {
    if (inputRef && inputRef.current && isEditing) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const displayedValue = isEditing
    ? isInvalidValue
      ? invalidValue
      : convertRawValue(currentValue)
    : formatValue
    ? formatValue(value)
    : value;

  return (
    <Wrapper>
      <Value
        $isEditing={isEditing}
        ref={inputRef as RefObject<HTMLInputElement>}
        step={step}
        type="number"
        value={displayedValue}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          const displayValue = Number.parseFloat(e.target.value);
          if (!Number.isNaN(displayValue)) {
            setIsInvalidValue(false);
            setCurrentValue(
              convertDisplayValue
                ? convertDisplayValue(displayValue)
                : displayValue,
            );
          } else {
            setIsInvalidValue(true);
            setInvalidValue(e.target.value);
          }
        }}
        onFocus={handleStartEditing}
        onBlur={() => handleSaveChange()}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleSaveChange();
          }
        }}
      />
    </Wrapper>
  );
};
/* <StaticValue onClick={handleStartEditing}> */
/*   {formatValue ? formatValue(value) : value} */
/* </StaticValue> */
