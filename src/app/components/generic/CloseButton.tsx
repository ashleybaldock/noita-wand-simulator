import styled from 'styled-components';

const StyledButton = styled.button`
  border: 0;
  color: black;
  background-color: transparent;
  cursor: pointer;

  &:hover {
    background-color: #c55;
  }
`;

export const CloseButton = ({ onClick }: { onClick: () => void }) => (
  <StyledButton onClick={onClick}>❌</StyledButton>
);
