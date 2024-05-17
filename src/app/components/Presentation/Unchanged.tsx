import styled from 'styled-components';

type UnchangedProps = {
  content?: string;
};
export const Unchanged = styled.span.attrs(
  ({ content = '--' }: UnchangedProps) => ({
    content,
  }),
)<UnchangedProps>`
  color: var(--color-value-ignored);
  &::before {
    content: '${({ content }) => content}';
  }
`;
