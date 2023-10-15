import React, { useRef } from 'react';
import styled from 'styled-components/macro';
import { WandActionEditor } from './WandActionEditor';
import { WandStatsEditor } from './WandStatsEditor';
import { WandBorder } from './WandBorder';
import { SaveImageButton } from './generic';
import SectionHeader from './SectionHeader';

const MainDiv = styled.div`
  display: flex;
  flex-direction: column;
  background-color: var(--color-base-background);
  margin: 10px 6px;
`;
const ContentDiv = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: var(--color-button-background);
  padding: 10px;
`;

const CopySpells = styled.div`
  position: absolute;
  right: 6px;
  bottom: 4px;
  display: flex;
  flex-direction: row;
  justify-content: end;
  align-items: end;
  font-family: 'noita', '04b03', sans-serif;
`;

const WandActionEditorWrapper = styled.div`
  height: fit-content;
  width: fit-content;
`;

type Props = {};

export function WandBuilder(props: Props) {
  const wandRef = useRef<HTMLDivElement>();
  const spellsRef = useRef<HTMLDivElement>();

  return (
    <>
      <SectionHeader
        title={'Wand Editor'}
        rightChildren={
          <SaveImageButton
            targetRef={spellsRef}
            fileName={'spells'}
            enabled={true}
          />
        }
      />
      <MainDiv>
        <WandBorder>
          <ContentDiv ref={wandRef as any} className={'saveImageRoot'}>
            <WandStatsEditor />
            <WandActionEditorWrapper
              ref={spellsRef as any}
              className={'saveImageRoot'}
            >
              <WandActionEditor />
            </WandActionEditorWrapper>
            <CopySpells></CopySpells>
          </ContentDiv>
        </WandBorder>
      </MainDiv>
    </>
  );
}
