import styled from 'styled-components';
import { Duration } from '../Duration';
import { NBSP, isNotNullOrUndefined } from '../../../util';
import type { StopReason } from '../../../types';
import type { GroupedWandShot } from '../../../calc/eval/types';
import { useConfig } from '../../../redux';

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

export const ShotSummary = styled(
  ({
    pending,
    shots,
    endReason,
    totalRechargeTime,
    totalFiringTime = 30,
    totalManaDrain,
    className,
  }: {
    pending: boolean;
    endReason: StopReason;
    shots: GroupedWandShot[];
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
      <div className={className}>
        <SummaryItem>
          {`Fired${NBSP}`}
          <Emphasis>{`${shots?.length ?? '??'}${NBSP}shots`}</Emphasis>
          {totalFiringTime ? (
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
          <Emphasis>{totalFiringTime / shots.length}</Emphasis>
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
      </div>
    );
  },
)`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: baseline;
  width: fit-content;
  padding: 0px 20px 0px 10px;
  align-self: stretch;
  margin: 0.8em 0 1.2em 0;
  flex-wrap: wrap;
  justify-content: space-evenly;
  gap: 0.2em 1.2em;
  max-width: 90vw;

  & > div {
    text-align: center;
  }
`;
