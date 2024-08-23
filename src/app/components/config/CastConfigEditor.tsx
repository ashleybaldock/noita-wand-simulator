import styled from 'styled-components';
import { SectionToolbar } from '../SectionToolbar';
import { EndingConfigSection } from './Sections/Ending';
import { SimulationConfigSection } from './Sections/Simulation';
import { LimitsConfigSection } from './Sections/Limits';
import { MoneyConfigSection } from './Sections/Money';
import { HealthConfigSection } from './Sections/Health';
import { RequirementsConfigSection } from './Sections/Requirements';
import { RandomConfigSection } from './Sections/Random';

const MainDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  background-color: #000;
`;

export const CastConfigEditor = () => {
  return (
    <>
      <SectionToolbar title={'Cast Config'} />
      <MainDiv data-name={'CastConfigEditor'}>
        <HealthConfigSection />
        <MoneyConfigSection />
        <RandomConfigSection />
        <RequirementsConfigSection />
        <LimitsConfigSection />
        <EndingConfigSection />
        <SimulationConfigSection />
      </MainDiv>
    </>
  );
};
