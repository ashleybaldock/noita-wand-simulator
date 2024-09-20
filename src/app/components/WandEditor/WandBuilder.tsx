import { useRef } from 'react';
import styled from 'styled-components';
import { WandActionEditor } from './WandActionEditor';
import { WandStatsEditor } from './WandStatsEditor';
import { WandBorder } from './WandBorder';
import { WandAlwaysCastEditor } from './WandAlwaysCastEditor';
import { ZetaEditor } from './ZetaEditor';
import { ExportOptions } from '../Export';

const MainDiv = styled.div`
  display: flex;
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
        <ContentDiv ref={wandRef} className={'saveImageRoot'}>
          <ColumnsContainer>
            <StyledWandStatsEditor />
            <StyledAlwaysCastEditor />
            <StyledZetaEditor />
          </ColumnsContainer>
          <WandActionEditorWrapper ref={spellsRef} className={'saveImageRoot'}>
            <WandActionEditor />
            <ExportOptions />
          </WandActionEditorWrapper>
        </ContentDiv>
      </WandBorder>
    </MainDiv>
  );
};
