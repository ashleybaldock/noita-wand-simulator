import styled from 'styled-components';
import { SearchButton } from './buttons/SearchButton';

export const StyledSearchButton = styled(SearchButton)`
  grid-area: search;
  border-radius: 0px 0px 0.2em 15.1em / 0px 0px 0em 64.4em;
  border-right-style: hidden;
  padding-top: 0.4em;
  padding-bottom: 0.3em;
  margin-left: -0.4em;
  align-self: start;
  padding: 0.3em 1em 0.2em 2.4em;
`;

const Wrapper = styled.div`
  display: flex;
  grid-area: search;
`;

const _Search = () => {
  return (
    <Wrapper data-name="SearchWrapper">
      <StyledSearchButton data-name="SearchButton" />
    </Wrapper>
  );
};

export const Search = styled(_Search)``;
