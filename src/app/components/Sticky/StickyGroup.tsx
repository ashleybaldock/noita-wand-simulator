import styled, { type DataAttributes } from 'styled-components';

export const StickyGroup = styled.div.attrs<DataAttributes>({
  'data-name': 'StickyGroup',
})`
  display: flex;
  flex-direction: column;

  inset: var(--top-banner-height) auto auto auto;
  background-color: var(--color-base-background);
  padding-bottom: 10px;
  margin-bottom: 0;
  position: relative;

  &:not(:has(~ &)) {
    margin-bottom: var(--top-banner-height);
  }
`;
