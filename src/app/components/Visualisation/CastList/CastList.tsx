import type { LegacyRef } from 'react';
import { useRef } from 'react';
import styled from 'styled-components';
import { ScrollWrapper } from '../../generic';
import { CastTable } from './CastTable';
import { SimulationSummary } from './SimulationSummary';
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

export const CastList = () => {
  const { casts } = useLatestResult();
  const castListRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <SectionToolbar title={'Simulation: Cast List'}></SectionToolbar>
      <ScrollWrapper>
        <SectionDiv
          ref={castListRef as LegacyRef<HTMLDivElement>}
          className={'saveImageRoot'}
        >
          <SimulationSummary />
          {casts.map((cast, index) => (
            <CastTable cast={cast} castIndex={index + 1} key={index} />
          ))}
        </SectionDiv>
      </ScrollWrapper>
    </>
  );
};
