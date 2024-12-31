import type { LegacyRef } from 'react';
import { useRef } from 'react';
import styled from 'styled-components';
import { ConfigButton } from '../../buttons';
import { SaveImageButton, ScrollWrapper } from '../../generic';
import { ShotTable } from './ShotTable';
import { SimulationSummary } from './ShotSummary';
import { SectionToolbar } from '../../SectionToolbar';
import { useLatestResult } from '../../../redux';

const SectionDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: fit-content;
  padding: 0px 20px 0 10px;
`;

const StyledConfigButton = styled(ConfigButton)`
  grid-row: buttons;
  grid-column: -2;
`;

const StyledSaveImageButton = styled(SaveImageButton)`
  justify-self: end;
  grid-row: buttons;
  grid-column: -3;
`;

export const ShotList = () => {
  const { shots } = useLatestResult();
  const shotListRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <SectionToolbar title={'Simulation: Shot List'}>
        <StyledSaveImageButton
          name={'Shot List'}
          targetRef={shotListRef}
          fileName={'shot_list'}
          enabled={shots.length > 0}
        />
        <StyledConfigButton />
      </SectionToolbar>
      <ScrollWrapper>
        <SectionDiv
          ref={shotListRef as LegacyRef<HTMLDivElement>}
          className={'saveImageRoot'}
        >
          <SimulationSummary />
          {shots.map((shot, index) => (
            <ShotTable shot={shot} shotIndex={index + 1} key={index} />
          ))}
        </SectionDiv>
      </ScrollWrapper>
    </>
  );
};
