import styled from 'styled-components';
import { Duration } from '../Duration';
import { NBSP, isNotNullOrUndefined } from '../../../util';
import type { StopReason } from '../../../types';
import { useConfig } from '../../../redux';
import type { WandShotResult } from '../../../calc/eval/WandShot';

const SummaryItem = styled.div`
  line-height: 1.7em;
`;

const Emphasis = styled.span`
  border: 1px dotted #79a5a1;
  padding: 6px 3px 3px 3px;
  border-radius: 3px;
`;
const Optimal = styled(Emphasis)`
  border: 1px dotted #00ff00;
`;
const CouldImprove = styled(Emphasis)`
  border: 1px dotted #ff0000;
`;
const StickyContainer = styled.div`
  position: sticky;
  left: 1em;
  right: 1em;

  align-self: stretch;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-evenly;
  align-items: baseline;
  gap: 0.2em 1.2em;

  width: fit-content;
  max-width: 90vw;
  padding: 0px 20px 0px 10px;
  margin: 0.8em 0 1.2em 0;

  & > div {
    text-align: center;
  }
`;

export const ShotSummary = styled(
  ({
    pending,
    shots,
    endReason,
    totalRechargeTime,
    totalFiringTime = 0,
    totalManaDrain,
    className,
  }: {
    pending: boolean;
    endReason: StopReason;
    shots: WandShotResult[];
    totalRechargeTime?: number;
    totalFiringTime?: number;
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
      <StickyContainer className={className}>
        <SummaryItem>
          {`Fired${NBSP}`}
          <Emphasis>{`${shots?.length ?? '??'}${NBSP}shot${
            shots?.length === 1 ? '' : 's'
          }`}</Emphasis>
          {totalFiringTime > 0 ? (
            <>
              {`${NBSP}in${NBSP}`}
              <Emphasis>
                <Duration unit="f" f={totalFiringTime} />
              </Emphasis>
            </>
          ) : (
            ''
          )}
        </SummaryItem>
        <SummaryItem>
          {`Shot cycles per second:${NBSP}`}
          <Emphasis>
            {shots.length > 0 ? totalFiringTime / shots.length : 0}
          </Emphasis>
        </SummaryItem>
        {isNotNullOrUndefined(totalRechargeTime) && (
          <SummaryItem>
            {`Total recharge delay:${NBSP}`}
            {totalRechargeTime > 0 ? (
              <CouldImprove>
                <Duration unit="f" f={totalRechargeTime} />
              </CouldImprove>
            ) : (
              <Optimal>
                <Duration unit="f" f={totalRechargeTime} />
              </Optimal>
            )}
          </SummaryItem>
        )}
        {isNotNullOrUndefined(totalManaDrain) && (
          <SummaryItem>
            {`Total mana drain:${NBSP}`}
            {totalManaDrain > 0 ? (
              <CouldImprove>{totalManaDrain}</CouldImprove>
            ) : (
              <Optimal>{totalManaDrain}</Optimal>
            )}
          </SummaryItem>
        )}
      </StickyContainer>
    );
  },
)``;
