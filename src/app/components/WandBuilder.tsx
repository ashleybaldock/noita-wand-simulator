import React, { useRef } from 'react';
import styled from 'styled-components/macro';
import { WandActionEditor } from './WandActionEditor';
import { WandStatsEditor } from './WandStatsEditor';
import { WandBorder } from './WandBorder';
import { SaveImageButton } from './generic';
import { SectionHeader } from './SectionHeader';
import {
  ExportButton,
  LoadButton,
  ResetButton,
  UndoButton,
  RedoButton,
  ConfigButton,
} from './buttons';

const MainDiv = styled.div`
  display: flex;
  flex-direction: row;
  flex-direction: column;
  background-color: var(--color-base-background);
  margin: 10px 6px;

  @media screen and (max-width: 900px) {
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

  @media screen and (max-width: 900px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const CopySpells = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: row;
  justify-content: end;
  align-items: end;
  font-family: var(--font-family-noita-default);
`;

const WandActionEditorWrapper = styled.div`
  position: relative;
  height: fit-content;
  flex: 1 1 auto;
`;

const EditButtons = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-self: end;
  position: sticky;
  top: -0.16em;
  z-index: var(--zindex-stickyheader-controls, 220);
  margin-top: -2.56em;
  background-color: var(--color-base-background);
  border-radius: 0 0 0 15.1em / 0 0 0 54.4em;
  padding: 0.36em 0.2em 0.46em 0.6em;
  padding: 0;
  border: 0.16em solid var(--color-tab-border-active);
  border-top-style: hidden;
  border-right-style: hidden;
  bottom: 2em;
  gap: 0.1em;

  & > button {
    border: 0.16em solid var(--color-button-border);
    border-radius: 0 0 0.2em 15.1em / 0 0 0em 64.4em;
    border-right-style: hidden;
    padding-top: 0.4em;
    padding-bottom: 0.3em;
    margin-left: -0.4em;
  }
  & > button:first-child {
    margin-left: 0;
  }

  @media screen and (max-width: 900px) {
  }
`;

export function WandBuilder() {
  const wandRef = useRef<HTMLDivElement>();
  const spellsRef = useRef<HTMLDivElement>();

  return (
    <>
      <SectionHeader title={'Wand Editor'} />
      <EditButtons>
        <UndoButton />
        <RedoButton />
        <ResetButton />
        <LoadButton />
        <ExportButton />
        <ConfigButton />
      </EditButtons>
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
              </CopySpells>
            </WandActionEditorWrapper>
          </ContentDiv>
        </WandBorder>
      </MainDiv>
    </>
  );
}
