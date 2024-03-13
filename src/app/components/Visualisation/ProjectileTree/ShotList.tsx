import type { LegacyRef } from 'react';
import { useRef } from 'react';
import styled from 'styled-components';
import type { StopReason } from '../../../types';
import type { GroupedWandShot } from '../../../calc/eval/types';
import { ConfigButton, SectionButtonBar } from '../../buttons';
import { SaveImageButton, ScrollWrapper } from '../../generic';
import { SectionHeader } from '../../SectionHeader';
import { ShotTable } from './ShotTable';
import { ShotSummary } from './ShotSummary';

const SectionDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: fit-content;
  padding: 0px 20px 0 10px;
`;

const SaveButtons = styled.div`
  position: absolute;
  left: 200px;
  top: 37px;
`;

export const ShotList = ({
  simulationRunning,
  endReason,
  shots,
  totalRechargeTime,
}: {
  simulationRunning: boolean;
  endReason: StopReason;
  shots: GroupedWandShot[];
  totalRechargeTime: number | undefined;
}) => {
  const shotListRef = useRef<HTMLDivElement>();

  const totalManaDrain = shots.reduce(
    (tsf, shot) => tsf + (shot.manaDrain ?? 0),
    0,
  );
  return (
    <>
      <SectionHeader title={'Simulation: Shot List'} />
      <SaveButtons>
        <SaveImageButton
          targetRef={shotListRef}
          fileName={'projectiles'}
          enabled={shots.length > 0}
        />
      </SaveButtons>
      <SectionButtonBar>
        <ConfigButton />
      </SectionButtonBar>

      <ScrollWrapper>
        <SectionDiv
          ref={shotListRef as LegacyRef<HTMLDivElement>}
          className={'saveImageRoot'}
        >
          <ShotSummary
            pending={simulationRunning}
            shots={shots}
            endReason={endReason}
            totalRechargeTime={totalRechargeTime}
            totalManaDrain={totalManaDrain}
          />
          {shots.map((shot, index) => (
            <ShotTable shot={shot} shotIndex={index + 1} key={index} />
          ))}
        </SectionDiv>
      </ScrollWrapper>
    </>
  );
};
