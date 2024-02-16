import styled from 'styled-components';

const StyledButton = styled.button`
  border: 0;
  color: black;
  background-color: transparent;
  cursor: pointer;

  &:hover {
    background-color: #c55;
  }
  & > span {
    filter: grayscale(1) brightness(2.2);
  }

  @media screen and (max-width: 500px) {
    margin-left: 0.4em;
    font-size: 1.6em;
    line-height: 1;
    position: fixed;
    top: 0;
    right: 0;
    background-color: black;
    border-radius: 0 0 0 70% / 40%;
    padding: 0.6em 0.6em 0.6em 0.9em;
    z-index: 10;
    border-color: var(--color-modal-bg);
    border-style: solid;
    border-width: 0 0 0.4em 0em;
  }
`;

export const CloseButton = ({ onClick }: { onClick: () => void }) => (
  <StyledButton onClick={onClick}>
    <span>❌</span>
  </StyledButton>
);
