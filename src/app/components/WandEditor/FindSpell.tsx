import styled from 'styled-components';

const Wrapper = styled.div`
  position: fixed;
  display: grid;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  place-items: center center;

  z-index: var(--zindex-findspell);
`;

const Container = styled.div`
  padding: 2em;
  background-color: var(--color-base-background);
`;
const SearchInput = styled.input.attrs({ type: 'text' })`
  width: 6em;
`;

export const FindSpell = ({ className }: { className?: string }) => {
  return (
    <Wrapper className={className}>
      <Container>
        <SearchInput></SearchInput>
      </Container>
    </Wrapper>
  );
};
