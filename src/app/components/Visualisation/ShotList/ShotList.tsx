import type { LegacyRef } from 'react';
import { useRef } from 'react';
import styled from 'styled-components';
import type { StopReason } from '../../../types';
import { ConfigButton } from '../../buttons';
import { SaveImageButton, ScrollWrapper } from '../../generic';
import { ShotTable } from './ShotTable';
import { ShotSummary } from './ShotSummary';
import { SectionToolbar } from '../../SectionToolbar';
import type { WandShot } from '../../../calc/eval/WandShot';

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

const StyledConfigButton = styled(ConfigButton)`
  grid-row: buttons;
  grid-column: -2;
`;

const ShotListToolbar = () => {
  return (
    <SectionToolbar title={'Simulation: Shot List'}>
      <StyledConfigButton />
    </SectionToolbar>
  );
};

export const ShotList = ({
  simulationRunning,
  endReasons,
  shots,
  totalRechargeTime,
}: {
  simulationRunning: boolean;
  endReasons: StopReason[];
  shots: WandShot[];
  totalRechargeTime: number | undefined;
}) => {
  const shotListRef = useRef<HTMLDivElement>(null);

  const totalManaDrain = shots.reduce(
    (tsf, shot) => tsf + (shot.manaDrain ?? 0),
    0,
  );
  return (
    <>
      <ShotListToolbar />
      <ScrollWrapper>
        <SaveButtons>
          <SaveImageButton
            name={'Shot List'}
            targetRef={shotListRef}
            fileName={'shot_list'}
            enabled={shots.length > 0}
          />
        </SaveButtons>
        <SectionDiv
          ref={shotListRef as LegacyRef<HTMLDivElement>}
          className={'saveImageRoot'}
        >
          <ShotSummary
            pending={simulationRunning}
            shots={shots}
            endReason={endReasons?.[0] ?? 'unknown'}
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
