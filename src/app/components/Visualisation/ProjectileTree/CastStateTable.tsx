import { useRef } from 'react';
import styled from 'styled-components/macro';
import { StopReason } from '../../../calc/eval/clickWand';
import { GroupedWandShot } from '../../../calc/eval/types';
import { ConfigButton, SectionButtonBar } from '../../buttons';
import { SaveImageButton, ScrollWrapper } from '../../generic';
import { SectionHeader } from '../../SectionHeader';
import { IterationLimitWarning } from '../IterationLimitWarning';
import { ShotMetadata } from '../ShotMetadata';
import { ShotTable } from './ShotTable';

const SectionDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: fit-content;
`;

export const CastStateTable = ({
  endReason,
  shots,
  totalRechargeTime,
}: {
  endReason: StopReason;
  shots: GroupedWandShot[];
  totalRechargeTime: number | undefined;
}) => {
  const projectilesRef = useRef<HTMLDivElement>();
  return (
    <>
      <SectionHeader title={'Simulation: Cast States'} />
      <SectionButtonBar>
        <ConfigButton />
      </SectionButtonBar>
      <SectionDiv>
        {' '}
        <SaveImageButton
          targetRef={projectilesRef}
          fileName={'projectiles'}
          enabled={shots.length > 0}
        />
        <IterationLimitWarning hitIterationLimit={endReason === 'iterLimit'} />
      </SectionDiv>

      <ScrollWrapper>
        <SectionDiv ref={projectilesRef as any} className={'saveImageRoot'}>
          {shots.length > 0 && (
            <ShotMetadata
              rechargeDelay={totalRechargeTime}
              endReason={endReason}
            />
          )}
          {shots.map((shot, index) => (
            <ShotTable shot={shot} shotIndex={index + 1} key={index} />
          ))}
        </SectionDiv>
      </ScrollWrapper>
    </>
  );
};
