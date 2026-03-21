import styled, { type DataAttributes } from 'styled-components';

export const StickyHeading = styled.h2.attrs<DataAttributes>({
  'data-name': 'StickyHeading',
})`
  display: flex;
  flex-direction: column;
  margin: 0;
`;
