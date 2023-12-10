import { useRef } from 'react';
import styled from 'styled-components/macro';
import { StopReason } from '../../../types';
import { GroupedWandShot } from '../../../calc/eval/types';
import { ConfigButton, SectionButtonBar } from '../../buttons';
import { SaveImageButton, ScrollWrapper } from '../../generic';
import { SectionHeader } from '../../SectionHeader';
import { ShotMetadata } from '../ShotMetadata';
import { ShotTable } from './ShotTable';

const SectionDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: fit-content;
  padding: 5px;
`;

const SaveButtons = styled.div`
  position: absolute;
  left: 50%;
  top: 0;
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

      <ScrollWrapper>
        <SaveButtons>
          <SaveImageButton
            targetRef={projectilesRef}
            fileName={'projectiles'}
            enabled={shots.length > 0}
          />
        </SaveButtons>
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
