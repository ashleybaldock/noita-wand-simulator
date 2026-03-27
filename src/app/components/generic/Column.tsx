import styled, {
  type CSSProperties,
  type DataAttributes,
} from 'styled-components';

type UsualAttrs = DataAttributes & {
  style?: CSSProperties;
  className?: string;
  dataName?: string;
};

export const Column = styled.div.attrs<UsualAttrs>(
  ({ dataName = 'Column' }) => ({
    'data-name': dataName,
  }),
)`
  display: flex;
  flex-direction: column;
`;
