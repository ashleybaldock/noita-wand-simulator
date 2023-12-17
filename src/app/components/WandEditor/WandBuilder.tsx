import React, { useRef } from 'react';
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
  display: flex;
  flex-direction: row;
  align-items: stretch;
  background-color: var(--color-button-background);
  padding: 0.8em 0.2em 0.6em 0.2em;

  @media screen and (max-width: 800px) {
    flex-direction: column;
    align-items: stretch;
  }
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
  @media screen and (max-width: 800px) {
    margin: 0.8em 0 0.4em 0;
  }
`;

export function WandBuilder() {
  const wandRef = useRef<HTMLDivElement>();
  const spellsRef = useRef<HTMLDivElement>();

  return (
    <>
      <SectionHeader title={'Wand Editor'} />
      <SectionButtonBar>
        <UndoButton />
        <RedoButton />
        <ResetButton />
        <LoadButton />
        {/* <ExportButton /> */}
        <ConfigButton />
      </SectionButtonBar>
      <MainDiv>
        <WandBorder>
          <ContentDiv ref={wandRef as any} className={'saveImageRoot'}>
            <WandStatsEditor />
            <WandActionEditorWrapper
              ref={spellsRef as any}
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
}
