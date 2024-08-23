import styled from 'styled-components';
import { YesNoConfigToggle } from '../Input';

export const Editable = styled.div`
  text-decoration: underline dotted var(--color-toggle-hover) 1.4px;
  &:hover {
    color: var(--color-toggle-hover);
  }
  cursor: pointer;
  position: relative;
  &::before {
    left: -10px;
    content: '>';
    position: absolute;
    padding-left: 0px;
  }
`;

export const EditableWithLabel = styled.label`
  display: flex;
  flex-direction: row;
  cursor: pointer;

  & > :last-child {
    text-decoration: underline dotted var(--color-toggle-hover) 1.4px;
    position: relative;
    width: 100%;
  }
  &:hover {
    color: var(--color-toggle-hover);
  }

  & > :last-child::before {
    left: -30px;
    content: '>';
    position: absolute;
    padding-left: 0px;
    scale: 0;
    transition-property: scale, color, opacity, left;
    transition-duration: 200ms;
    transition-timing-function: ease-in-out;
    color: black;
  }
  &&:hover > :last-child::before {
    opacity: 1;
    color: yellow;
    scale: 1;
    left: -12px;
    transition-property: scale, color, opacity, left;
    transition-duration: 200ms;
    transition-timing-function: ease-in-out;
  }
`;
