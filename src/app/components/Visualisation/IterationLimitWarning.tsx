import styled from 'styled-components/macro';

const StyledSpan = styled.span`
  font-weight: bold;
  color: red;
  background-color: #000;
  padding: 2px;
`;

export const IterationLimitWarning = ({
  hitIterationLimit,
}: {
  hitIterationLimit: boolean;
}) =>
  hitIterationLimit ? <StyledSpan>Iteration limit reached</StyledSpan> : null;
