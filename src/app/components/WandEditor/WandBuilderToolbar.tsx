import styled from 'styled-components';
import { SectionToolbar } from '../SectionToolbar';
import {
  LoadButton,
  ResetButton,
  UndoButton,
  RedoButton,
  ConfigButton,
} from '../buttons';
import { SearchButton } from '../buttons/SearchButton';

const StyledSearchButton = styled(SearchButton)`
  grid-area: search;
  border-radius: 0px 0px 0.2em 15.1em / 0px 0px 0em 64.4em;
  border-right-style: hidden;
  padding-top: 0.4em;
  padding-bottom: 0.3em;
  margin-left: -0.4em;
  align-self: start;
  padding: 0.3em 1em 0.2em 2.4em;
`;

const SearchWrapper = styled.div`
  display: flex;
  grid-area: search;
`;

export const WandBuilderToolbar = () => {
  return (
    <SectionToolbar data-name="WandBuilderToolbar" title={'Wand Editor'}>
      <UndoButton />
      <RedoButton />
      <ResetButton />
      <LoadButton />
      <ConfigButton />
      <SearchWrapper data-name="SearchWrapper">
        <StyledSearchButton data-name="SearchButton" />
      </SearchWrapper>
    </SectionToolbar>
  );
};
