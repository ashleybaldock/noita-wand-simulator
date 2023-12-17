import styled from 'styled-components';

const StyledButton = styled.button`
  border: 1px solid #111;
  color: black;
  background-color: #a33;
  cursor: pointer;

  &:hover {
    background-color: #c55;
  }
`;

export const CloseButton = ({ onClick }: { onClick: () => void }) => (
  <StyledButton onClick={onClick}>X</StyledButton>
);
