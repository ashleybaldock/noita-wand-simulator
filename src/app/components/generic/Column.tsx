import styled from 'styled-components';
import type { UsualAttrs } from '../Types/UsualAttrs';

export const Column = styled.div.attrs<UsualAttrs>(
  ({ dataName = 'Column' }) => ({
    'data-name': dataName,
  }),
)`
  display: flex;
  flex-direction: column;
`;
