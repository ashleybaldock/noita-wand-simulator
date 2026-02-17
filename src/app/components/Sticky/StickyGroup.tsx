import styled, { type DataAttributes } from 'styled-components';

export const StickyGroup = styled.div.attrs<DataAttributes>({
  'data-name': 'StickyGroup',
})`
  display: flex;
  flex-direction: column;
`;
