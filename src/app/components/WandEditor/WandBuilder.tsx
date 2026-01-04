import { useRef } from 'react';
import styled from 'styled-components';
import { WandActionEditor } from './WandActionEditor';
import { WandStatsEditor } from './WandStatsEditor';
import { WandBorder } from './WandBorder';
import { WandAlwaysCastEditor } from './WandAlwaysCastEditor';
import { ZetaEditor } from './ZetaEditor';
import { ExportOptions } from '../Export';
import { RedoButton, ResetButton, UndoButton } from '../buttons';
import { GridSectionHeader } from '../SectionToolbar';

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

const ButtonsContainer = styled.div`
  display: grid;
  grid-template-columns: [left title-start] auto [title-end] 1fr [ undo-start] auto [undo-end redo-start] auto [redo-end] 1ch [clear-start] auto [clear-end reset-start] auto [reset-end] 1ch [ right];
  margin: 0;
  grid-template-rows: [top title-start] 1fr [ title-end bottom];
  filter: none;

  & > button {
    padding-top: 0.4em;
    padding-bottom: 0.3em;
    border-bottom: none;
  }
`;
const ColumnsContainer = styled.div`
  --child-unit-height: 1.44em;
  padding: 0.8em 1em 0.6em 1em;
  columns: 4 17em;
  column-fill: balance;

  @media screen and (max-width: 500px) {
    padding: 0;
    columns: 2 50vw;
    column-gap: 2ch;
    column-fill: auto;
  }
`;

const StyledWandStatsEditor = styled(WandStatsEditor)`
  ${ColumnsContainer} > & {
    height: calc(var(--child-unit-height) * 1);
    break-inside: avoid;
    box-sizing: border-box;
  }
`;
const StyledAlwaysCastEditor = styled(WandAlwaysCastEditor)`
  ${ColumnsContainer} > & {
    height: calc(var(--child-unit-height) * 3);
    break-inside: avoid;
    box-sizing: border-box;
  }
`;
const StyledZetaEditor = styled(ZetaEditor)`
  ${ColumnsContainer} > & {
    height: calc(var(--child-unit-height) * 3);
    break-inside: avoid;
    box-sizing: border-box;
  }
`;

export const WandBuilder = () => {
  const wandRef = useRef<HTMLDivElement>(null);
  const spellsRef = useRef<HTMLDivElement>(null);

  return (
    <MainDiv data-name="WandBuilder">
      <WandBorder data-name="WandBorder">
        <ButtonsContainer data-name="WandBuilderTopButtons">
          <GridSectionHeader title={'Wand Editor'} />
          <UndoButton />
          <RedoButton />
          <ResetButton />
        </ButtonsContainer>
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
