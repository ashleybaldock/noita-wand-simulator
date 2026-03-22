import { useRef } from 'react';
import styled, { type DataAttributes } from 'styled-components';
import { WandActionEditor } from './WandActionEditor';
import { WandStatsEditor } from './WandStatsEditor';
import { WandBorder } from './WandBorder';
import { WandAlwaysCastEditor } from './WandAlwaysCastEditor';
import { ZetaEditor } from './ZetaEditor';
import { ExportOptions } from '../Export';
import { ClearButton, RedoButton, ResetButton, UndoButton } from '../buttons';

const MainDiv = styled.div`
  display: flex;
  flex-direction: column;
  background-color: var(--color-base-background);

  margin: 4px 0;
  align-items: center;

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

  padding: 0.8em 0 0.6em 0;
  width: 100%;
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
  grid-template-columns: [left export-start] auto [export-end] 1fr [ undo-start] auto [undo-end redo-start] auto [redo-end] 1ch [clear-start] auto [clear-end reset-start] auto [reset-end] 1ch [ right];
  grid-template-rows: [top title-start] 1fr [ title-end bottom];
  filter: none;
  background-color: var(--color-base-background);
  padding: 0 0 0.3em 0;
  margin: 0;
  width: 100%;
  grid-column: -2;
  grid-row-end: span 2;
  justify-self: end;

  & > button {
    padding-top: 0.4em;
    padding-bottom: 0.3em;
    border-bottom: none;
  }

  & > ${UndoButton} {
    grid-column: undo;
  }
  & > ${RedoButton} {
    grid-column: redo;
  }
  & > ${ResetButton} {
    grid-column: reset;
  }
  & > ${ClearButton} {
    grid-column: clear;
  }

  @media screen and (max-width: 500px) {
    height: 1.8lh;
    grid-template-columns: [left] 1ch [undo-start] auto [undo-end redo-start] auto [redo-end] 1ch [clear-start] auto [clear-end reset-start] auto [reset-end] 1ch [right];

    & > button {
      background-size: 1.6em;
    }
  }
`;

const ColumnsContainer = styled.div.attrs<DataAttributes>(() => ({
  'data-name': 'ColumnsContainer',
}))`
  --child-unit-height: 1.44em;
  padding: 0;

  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-auto-rows: 1fr;

  row-gap: round(nearest, clamp(1px, 0.2em, 4px), 1px);
  font-size: round(nearest, clamp(1em, calc(1.6em - 2vw), 1.2em), 1px);
  margin: 0;
  grid-template-columns: repeat(auto-fill, minmax(24ch, 1fr));
  column-gap: round(up, clamp(1px, 1vw, 0.5ch), 1px);

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
      <WandBuilderTopButtons data-name="WandBuilderTopButtons">
        <ExportOptions wandRef={wandRef} spellsRef={spellsRef} />
        <UndoButton />
        <RedoButton />
        <ClearButton />
        <ResetButton />
      </WandBuilderTopButtons>
      <WandBorder data-name="WandBorder">
        <WandActionEditorWrapper ref={spellsRef} className={'saveImageRoot'}>
          <WandActionEditor />
        </WandActionEditorWrapper>
        <ContentDiv ref={wandRef} className={'saveImageRoot'}>
          <ColumnsContainer>
            <StyledWandStatsEditor />
            <StyledAlwaysCastEditor />
            <StyledZetaEditor />
          </ColumnsContainer>
        </ContentDiv>
      </WandBorder>
    </MainDiv>
  );
};
