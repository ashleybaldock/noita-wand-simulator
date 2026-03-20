import styled from 'styled-components';
import { SearchButton } from './buttons/SearchButton';

const Wrapper = styled.div`
  display: flex;
  flex: 0 1 content;

  --brtl: 0;
  --brt: 10em;
  --brtr: 0;
  --brr: 0;
  --brbr: 0;
  --brb: 0;
  --brbl: 16em;
  --brl: 60em;
  border: 0 none #0000;
  /* border-radius: var(--brtl) var(--brtr) var(--brbr) var(--brbl) / var(--brt) var(--brr) var(--brb) var(--brl); */

  --bwt: 0;
  --bwr: 0;
  --bwb: 0;
  --bwl: 0;
  border-radius: max(0, var(--brtl) + var(--bwl))
    max(0, var(--brtr) + var(--bwt)) max(0, var(--brbr) + var(--bwr))
    max(0, var(--brbl) + var(--bwb)) / max(0, var(--brt) - var(--bwl))
    max(0, var(--brr) - var(--bwt)) max(0, var(--brb) - var(--bwr))
    max(0, var(--brl) - var(--bwb));
  @media screen and (max-width: 500px) {
    display: contents;
  }
`;

export const StyledSearchButton = styled(SearchButton)`
  grid-area: search;
  border-radius: 0px 0px 0.2em 15.1em / 0px 0px 0em 64.4em;
  border-right-style: hidden;
  padding-top: 0.4em;
  padding-bottom: 0.3em;
  margin-left: -0.4em;
  align-self: start;
  padding: 0.3em 1em 0.2em 2.4em;
  border-left: var(--border-thickness) solid var(--color-button-border);

  @media screen and (max-width: 500px) {
    grid-column: search;
    grid-row: 1;
  }
`;

const _Search = () => {
  return (
    <Wrapper data-name="Search">
      <StyledSearchButton data-name="SearchButton" />
    </Wrapper>
  );
};

export const Search = styled(_Search)``;
