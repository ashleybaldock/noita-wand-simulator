import styled from 'styled-components';
import { YesNoConfigToggle, YesNoToggle } from '../Input';

export const SubSectionDiv = styled.div<{
  'data-section'?: string;
}>`
  display: flex;
  flex-direction: row;
  flex: 1 1 46%;
  flex-wrap: nowrap;
  align-content: center;
  align-items: center;
  align-self: center;
  align-self: stretch;
  justify-content: start;

  padding: 0;
  margin: 0;
  min-height: 2.3em;
  background-color: #000;
  border: 2px solid #232323;
  border-top-color: var(--config-topleft-border);
  border-left-color: var(--config-topleft-border);
  border-bottom-color: var(--config-bottomright-border);
  border-right-color: var(--config-bottomright-border);

  @media screen and (max-width: 600px) {
    flex-direction: column;
    gap: 0;
    padding: 0;
    margin: 0;
    padding-bottom: 0.4em;
  }
`;

export const SubSectionTitle = styled.div<{
  minWidth?: string;
}>`
  display: flex;
  flex: 0 1;
  flex-wrap: nowrap;
  justify-content: unset;

  flex-direction: row;
  align-content: center;
  align-items: center;
  align-self: center;

  color: #eee;
  padding: 2px 6px 2px 4px;
  font-size: 14px;

  ${({ minWidth }) => `min-width: ${minWidth ?? '8em'};`}

  object-fit: contain;
  background-size: contain;
  background-repeat: no-repeat;
  white-space: nowrap;
  background-color: #000;

  &:nth-child(1) {
    flex: 0 1;
    object-fit: contain;
    background-size: contain;
    background-repeat: no-repeat;
    justify-content: unset;
  }
  &:nth-child(1)::after {
    content: '';
    background-color: red;
    flex: 1;
  }
  &:last-child {
    width: auto;
  }
  &:nth-child(2) {
    flex: 1 0;
  }

  & > span {
    padding-top: 2px;
    white-space: nowrap;
    margin-right: 1.2em;
  }

  @media screen and (max-width: 600px) {
    flex-direction: column;
    gap: 0;
    padding: 0.4em;
    margin: 0;
    align-self: start;
    align-items: start;
    border: none;
    flex-direction: row;
  }
`;

export const SubSectionContent = styled.div<{
  wrapq?: boolean;
  maxWidth?: string;
}>`
  ${({ wrapq = false }) => (wrapq ? 'flex-wrap: wrap;' : '')}
  display: flex;
  align-items: center;
  background-color: #000;
  padding: 0;
  margin-right: 4px;
  flex: 1 1 auto;
  flex-wrap: wrap;
  width: 100%;
  ${({ maxWidth }) => (maxWidth ? `max-width: ${maxWidth};` : '')}
  gap: 0.6em;

  flex-direction: row;
  align-content: center;
  align-items: center;
  align-self: center;
  flex-wrap: nowrap;
  justify-content: space-between;

  @media screen and (min-width: 600px) {
    padding: 0.2em;

    :is([data-section='ending'], [data-section='limits']) & {
      flex-wrap: wrap;
      flex: 1 1 auto;
      margin: 0 3em;
      column-gap: 2em;
      row-gap: 0;
      & > label {
        flex-basis: 40%;
      }
    }
  }

  @media screen and (max-width: 600px) {
    :is([data-section='ending'], [data-section='limits']) & {
      flex-direction: column;
      gap: 0;
    }
  }
`;

export const InputWrapper = styled.label`
  display: flex;
  align-items: center;
  color: #eee;
  flex: 1 1 auto;

  &:first-child {
    flex: 1 1 46%;

    object-fit: contain;
    background-size: contain;
    background-repeat: no-repeat;
  }

  input[type='text'],
  input[type='number'] {
    margin: 0 1px 0 5px;
    min-width: 4em;
    max-width: 100%;
    width: 100%;
    flex: 1 1 100%;
    background-color: #222;
    border: var(--input-border);
    border-radius: var(--input-border-radius);
    font-size: 14px;
    color: #fff;
    text-align: center;
    padding: 5px 0 3px 0;
  }

  input[type='text']:focus-visible,
  input[type='number']:focus-visible {
    border: 2px solid #c89e3adb;
    outline: 1px solid #bf8d10cf;
    border: 2px solid #d0ba43;
    outline: 1px solid #dea71bcf;
    background-color: #000;
    outline-style: dashed;
    border-style: inset;
  }

  input[type='checkbox'] {
    margin: 0 6px 0 5px;
  }

  span {
    text-align: right;
    white-space: nowrap;
    margin-right: 1em;
  }

  @media screen and (max-width: 600px) {
    padding: 0 1.8em;
    flex: 1 1 100%;
    align-self: stretch;
  }
`;

export const WrappedYesNoConfigToggle = styled(YesNoConfigToggle)`
  flex: 0 1;
  padding: 0.6em 0.2em;
  flex: 1 1 100%;

  & > :first-child {
    flex: 1 0;
  }
  & > :last-child {
    flex: 0 0;
  }
  @media screen and (max-width: 600px) {
    align-self: stretch;
    padding: 0.6em 1.8em;

    & > :first-child {
      flex: 1 0;
    }
    & > :last-child {
      flex: 0 0;
    }
    & > :last-child::before {
    }
  }
`;
export const WrappedYesNoToggle = styled(YesNoToggle)`
  flex: 0 1;
  padding: 0.6em 0.2em;
  flex: 1 1 100%;

  & > :first-child {
    flex: 1 0;
  }
  & > :last-child {
    flex: 0 0;
  }
  @media screen and (max-width: 600px) {
    align-self: stretch;
    padding: 0.6em 1.8em;

    & > :first-child {
      flex: 1 0;
    }
    & > :last-child {
      flex: 0 0;
    }
    & > :last-child::before {
    }
  }
`;
