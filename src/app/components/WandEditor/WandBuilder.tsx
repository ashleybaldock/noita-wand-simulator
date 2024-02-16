import type { LegacyRef } from 'react';
import { useRef } from 'react';
import styled from 'styled-components';
import { WandActionEditor } from './WandActionEditor';
import { WandStatsEditor } from './WandStatsEditor';
import { WandBorder } from './WandBorder';
import { SaveImageButton } from '../generic';
import { SectionHeader } from '../SectionHeader';
import {
  LoadButton,
  ResetButton,
  UndoButton,
  RedoButton,
  ConfigButton,
  SectionButtonBar,
} from '../buttons';
import { ExportWikiButton } from '../Export/ExportWikiButton';
import { SearchButton } from '../buttons/SearchButton';
import { WandAlwaysCastEditor } from './WandAlwaysCastEditor';

const MainDiv = styled.div`
  display: flex;
  flex-direction: row;
  flex-direction: column;
  background-color: var(--color-base-background);
  margin: 10px 6px;

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

const CopySpells = styled.div`
  position: absolute;
  right: 0;
  bottom: -0.4em;
  display: flex;
  flex-direction: row;
  justify-content: end;
  align-items: end;
  font-family: var(--font-family-noita-default);
  z-index: var(--zindex-copy-png);

  @media screen and (max-width: 800px) {
    bottom: -0.8em;
  }
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

const ColumnsContainer = styled.div`
  --child-unit-height: 1.44em;
  padding: 0.8em 1em 0.6em 1em;
  columns: 4 17em;
  column-fill: balance;
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

const SectionButtonBarSearch = styled(SectionButtonBar)`
  margin-right: -10px;
  padding-right: 10px;
`;
const SectionButtonBarHorizFlex = styled.div`
  position: sticky;
  top: -0.16em;
  z-index: var(--zindex-stickyheader-controls, 220);
  display: flex;
  flex-direction: row;
  flex-wrap: wrap-reverse;
  justify-content: end;
  align-content: start;
  margin-top: -2.56em;
`;

export const WandBuilder = () => {
  const wandRef = useRef<HTMLDivElement>();
  const spellsRef = useRef<HTMLDivElement>();

  return (
    <>
      <SectionHeader title={'Wand Editor'} />
      <SectionButtonBarHorizFlex>
        <SectionButtonBarSearch>
          <SearchButton />
        </SectionButtonBarSearch>
        <SectionButtonBar>
          <UndoButton />
          <RedoButton />
          <ResetButton />
          <LoadButton />
          <ConfigButton />
        </SectionButtonBar>
        {/* <ExportButton /> */}
      </SectionButtonBarHorizFlex>
      <MainDiv>
        <WandBorder>
          <ContentDiv
            ref={wandRef as LegacyRef<HTMLDivElement>}
            className={'saveImageRoot'}
          >
            <ColumnsContainer>
              <StyledWandStatsEditor />
              <StyledAlwaysCastEditor />
            </ColumnsContainer>
            <WandActionEditorWrapper
              ref={spellsRef as LegacyRef<HTMLDivElement>}
              className={'saveImageRoot'}
            >
              <WandActionEditor />
              <CopySpells>
                <SaveImageButton
                  targetRef={spellsRef}
                  fileName={'spells'}
                  enabled={true}
                />
                <ExportWikiButton />
              </CopySpells>
            </WandActionEditorWrapper>
          </ContentDiv>
        </WandBorder>
      </MainDiv>
    </>
  );
};
