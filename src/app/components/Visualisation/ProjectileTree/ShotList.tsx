import { LegacyRef, useRef } from 'react';
import styled from 'styled-components';
import { StopReason } from '../../../types';
import { GroupedWandShot } from '../../../calc/eval/types';
import { ConfigButton, SectionButtonBar } from '../../buttons';
import { SaveImageButton, ScrollWrapper } from '../../generic';
import { SectionHeader } from '../../SectionHeader';
import { ShotTable } from './ShotTable';
import { Duration } from './Duration';
import { isNotNullOrUndefined } from '../../../util';
import { useConfig } from '../../../redux';

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
  left: 8px;
  top: 18px;
`;

const ShotsSummary = styled(
  ({
    pending,
    shots,
    endReason,
    totalRechargeTime,
    totalManaDrain,
    className,
  }: {
    pending: boolean;
    endReason: StopReason;
    shots: GroupedWandShot[];
    totalRechargeTime?: number;
    totalManaDrain?: number;
    className?: string;
  }) => {
    const { pauseCalculations } = useConfig();
    if (pauseCalculations) {
      return (
        <>{`-- Simulation Paused ${
          pending && `(Pending changes - unpause to update)`
        }--`}</>
      );
    }
    return (
      <div className={className}>
        <div>{`Fired ${
          shots?.length ?? '??'
        } shots, ended due to ${endReason}`}</div>
        {isNotNullOrUndefined(totalRechargeTime) && (
          <div>
            {`Total recharge delay:`}
            <Duration durationInFrames={totalRechargeTime} />
          </div>
        )}
        {isNotNullOrUndefined(totalManaDrain) && (
          <div>{`Total mana drain: ${totalManaDrain}`}</div>
        )}
      </div>
    );
  },
)`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  width: fit-content;
  padding: 0px 20px 0px 10px;
  align-self: stretch;
  margin: 0.5em 0;
  flex-wrap: wrap;
  justify-content: space-evenly;
  gap: 0.2em 1.2em;
  max-width: 90vw;

  & > div {
    text-align: center;
  }
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
      <SectionButtonBar>
        <ConfigButton />
      </SectionButtonBar>

      <ScrollWrapper>
        <SaveButtons>
          <SaveImageButton
            targetRef={shotListRef}
            fileName={'projectiles'}
            enabled={shots.length > 0}
          />
        </SaveButtons>
        <SectionDiv
          ref={shotListRef as LegacyRef<HTMLDivElement>}
          className={'saveImageRoot'}
        >
          <ShotsSummary
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
