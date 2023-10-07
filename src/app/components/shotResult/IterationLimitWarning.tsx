import styled from 'styled-components/macro';

const StyledSpan = styled.span`
  font-weight: bold;
  color: red;
  background-color: #000;
  padding: 2px;
`;

type Props = {
  hitIterationLimit: boolean;
};

export function IterationLimitWarning(props: Props) {
  if (!props.hitIterationLimit) {
    return null;
  }

  return <StyledSpan>Iteration limit reached</StyledSpan>;
}
