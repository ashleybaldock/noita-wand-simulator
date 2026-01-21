import { useRef } from 'react';
import styled from 'styled-components';
import { WandActionEditor } from './WandActionEditor';
import { WandStatsEditor } from './WandStatsEditor';
import { WandBorder } from './WandBorder';
import { WandAlwaysCastEditor } from './WandAlwaysCastEditor';
import { ZetaEditor } from './ZetaEditor';
import { ExportOptions } from '../Export';
import { RedoButton, ResetButton, UndoButton } from '../buttons';

const MainDiv = styled.div`
  display: flex;
  flex-direction: column;
  background-color: var(--color-base-background);
  margin: 4px 2px;

  @media screen and (max-width: 500px) {
    margin: 10px 0;
  }

  @media screen and (max-width: 800px) {
    flex-direction: column;
  }
`;
const ContentDiv = styled.div`
  position: relative;
  background-color: var(--color-button-background);

  padding: 0.8em 1em 0.6em 1em;
`;

const WandActionEditorWrapper = styled.div`
  position: relative;
  height: auto;
  flex: 1 1 min-content;
  grid-area: spells;
  @media screen and (max-width: 800px) {
    margin: 0.8em 0 0.4em 0;
  }
`;

const WandBuilderTopButtons = styled.div`
  display: grid;
  grid-template-columns: [left title-start] auto [title-end] 1fr [ undo-start] auto [undo-end redo-start] auto [redo-end] 1ch [clear-start] auto [clear-end reset-start] auto [reset-end] 1ch [ right];
  grid-template-rows: [top title-start] 1fr [ title-end bottom];
  margin: 0;
  filter: none;
  background-color: var(--color-base-background);
  padding: 0 0 0.3em 0;

  & > button {
    padding-top: 0.4em;
    padding-bottom: 0.3em;
    border-bottom: none;
  }

  @media screen and (max-width: 500px) {
    height: 1.8lh;
    grid-template-columns: [left] 1ch [undo-start] auto [undo-end redo-start] auto [redo-end] 1ch [clear-start] auto [clear-end reset-start] auto [reset-end] 1ch [right];

    & > button {
      background-size: 1.6em;
    }
  }
`;
const ColumnsContainer = styled.div`
  --child-unit-height: 1.44em;
  padding: 0;

  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-auto-rows: 1fr;

  @media screen and (max-width: 500px) {
    grid-template-columns: 1fr;
    padding: 0;
  }
`;

const StyledWandStatsEditor = styled(WandStatsEditor)`
  ${ColumnsContainer} > & {
    grid-row-end: span 1;
  }
`;
const StyledAlwaysCastEditor = styled(WandAlwaysCastEditor)`
  ${ColumnsContainer} > & {
    grid-row-end: span 3;
    @media screen and (max-width: 500px) {
      grid-row-end: span 2;
    }
  }
`;
const StyledZetaEditor = styled(ZetaEditor)`
  ${ColumnsContainer} > & {
    grid-row-end: span 3;
    @media screen and (max-width: 500px) {
      grid-row-end: span 1;
    }
  }
`;

export const WandBuilder = () => {
  const wandRef = useRef<HTMLDivElement>(null);
  const spellsRef = useRef<HTMLDivElement>(null);

  // <GridSectionHeader title={'Wand Editor'} />
  return (
    <MainDiv data-name="WandBuilder">
      <WandBorder data-name="WandBorder">
        <WandBuilderTopButtons data-name="WandBuilderTopButtons">
          <UndoButton />
          <RedoButton />
          <ResetButton />
        </WandBuilderTopButtons>
        <ContentDiv ref={wandRef} className={'saveImageRoot'}>
          <ColumnsContainer>
            <StyledWandStatsEditor />
            <StyledAlwaysCastEditor />
            <StyledZetaEditor />
          </ColumnsContainer>
          <WandActionEditorWrapper ref={spellsRef} className={'saveImageRoot'}>
            <WandActionEditor />
            <ExportOptions wandRef={wandRef} spellsRef={spellsRef} />
          </WandActionEditorWrapper>
        </ContentDiv>
      </WandBorder>
    </MainDiv>
  );
};
