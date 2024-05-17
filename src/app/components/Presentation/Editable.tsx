import styled from 'styled-components';

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
  & > :last-child {
    text-decoration: underline dotted var(--color-toggle-hover) 1.4px;
    cursor: pointer;
    position: relative;
    width: 100%;
  }
  &:hover {
    color: var(--color-toggle-hover);
  }
  & > :last-child::before {
    left: -10px;
    content: '>';
    position: absolute;
    padding-left: 0px;
  }
`;
