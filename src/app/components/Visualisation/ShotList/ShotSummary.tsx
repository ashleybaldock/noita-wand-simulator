import styled from 'styled-components';
import { Duration } from '../Duration';
import { isNotNullOrUndefined, round } from '../../../util';
import {
  useConfig,
  useLatestResult,
  useSimulationStatus,
} from '../../../redux';
import type { WandSalvo } from '../../../calc/eval/ClickWandResult';

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

const totalDelayForSalvo = ({ shots, reloadTime = 1 }: WandSalvo) => {
  const totalCastDelayForShots = shots.reduce(
    (tsf, shot) => tsf + (shot.castState?.fire_rate_wait ?? 1),
    0,
  );
  const lastCastDelay = shots[shots.length - 1]?.castState?.fire_rate_wait ?? 1;
  const largerDelay = Math.max(reloadTime, lastCastDelay);
  const totalDelay = totalCastDelayForShots - lastCastDelay + largerDelay;

  return {
    framesDelay: totalDelay,
    framesFiring: shots.length,
    framesTotal: totalDelay + shots.length,
  };
};

export const SimulationSummary = styled(
  ({ className }: { className?: string }) => {
    const [simulationRunning] = useSimulationStatus();
    const { salvos, reloadTime = 0, endConditions } = useLatestResult();

    const salvoDelayTotals = salvos.map(totalDelayForSalvo);
    const totalExtraDelay = salvoDelayTotals.reduce(
      (tsf, salvo) => tsf + salvo.framesDelay,
      0,
    );
    const totalFiring = salvoDelayTotals.reduce(
      (tsf, salvo) => tsf + salvo.framesFiring,
      0,
    );
    const total = salvoDelayTotals.reduce(
      (tsf, salvo) => tsf + salvo.framesTotal,
      0,
    );

    const totalShotCount = salvos.reduce(
      (tsf, { shots }) => tsf + shots.length,
      0,
    );
    const totalManaDrain = salvos.reduce(
      (tsf, { shots }) =>
        tsf + shots.reduce((tsf, shot) => tsf + (shot.manaDrain ?? 0), 0),
      0,
    );

    const endReason = endConditions?.[0] ?? 'unknown';
    const { pauseCalculations } = useConfig();
    if (pauseCalculations) {
      return (
        <>{`-- Simulation Paused ${
          simulationRunning && `(Pending changes - unpause to update)`
        }--`}</>
      );
    }
    return (
      <StickyContainer className={className}>
        <SummaryItem>
          {`Fired a total of `}
          <Emphasis>{`${totalShotCount} shot${
            totalShotCount === 1 ? '' : 's'
          }`}</Emphasis>
          {` in `}
          <Emphasis>{`${salvos?.length} salvo${
            salvos?.length === 1 ? '' : 's'
          }`}</Emphasis>
        </SummaryItem>
        <SummaryItem>
          {`Total time: `}
          {total === totalFiring ? (
            <CouldImprove>{total}</CouldImprove>
          ) : (
            <Optimal>{total}</Optimal>
          )}
          {` delay: `}
          {totalExtraDelay > 0 ? (
            <CouldImprove>{totalExtraDelay}</CouldImprove>
          ) : (
            <Optimal>{totalExtraDelay}</Optimal>
          )}
          {` ) `}
        </SummaryItem>
        {/* <SummaryItem> */}
        {/*   {`Seconds per shot cycle: `} */}
        {/*   <Emphasis> */}
        {/*     {shots.length > 0 ? ( */}
        {/*       <Duration s={totalCycleTime / shots.length} /> */}
        {/*     ) : null} */}
        {/*   </Emphasis> */}
        {/* </SummaryItem> */}
        {/* <SummaryItem> */}
        {/*   {`Shot cycles per second: `} */}
        {/*   <Emphasis> */}
        {/*     {round( */}
        {/*       shots.length > 0 ? 60 / totalCycleTime / shots.length : 0, */}
        {/*       2, */}
        {/*     )} */}
        {/*   </Emphasis> */}
        {/* </SummaryItem> */}
        {isNotNullOrUndefined(reloadTime) && (
          <SummaryItem>
            {`Total recharge delay: `}
            {reloadTime > 0 ? (
              <CouldImprove>
                <Duration f={reloadTime} />
              </CouldImprove>
            ) : (
              <Optimal>
                <Duration f={reloadTime} />
              </Optimal>
            )}
          </SummaryItem>
        )}
        {isNotNullOrUndefined(totalManaDrain) && (
          <SummaryItem>
            {`Total mana drain: `}
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
