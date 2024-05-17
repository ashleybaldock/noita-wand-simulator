import styled from 'styled-components';
import { useConfig } from '../redux';
import type { StopCondition, StopReason } from '../types';
import { TerminationWarning } from './Visualisation/TerminationWarning';
import { FNSP } from '../util';
import { Duration } from './Visualisation/Duration';

const StyledStatus = styled.div`
  margin: 0.4em 0 0.1em 0;
  text-align: center;
  position: sticky;
  left: 1em;
  right: 1em;
`;

const Label = styled.span`
  color: var(--color-subdued);
  font-size: 0.8em;
  line-height: 1em;
  &::before {
  }
  &::after {
    content: ':';
    margin: 0 0.6em 0 0.1em;
  }
`;

const Value = styled.span`
  display: inline-block;
  white-space: nowrap;
  &::before {
    content: '«';
    color: var(--color-subdued);
    margin: 0 0.4em 0 -0.4em;
  }
  &&:first-child::before {
    margin-left: 0.4em;
  }
  &::after {
    content: '»';
    margin: 0 -0.4em 0 0.4em;
    color: var(--color-subdued);
  }
  &&:last-child::after {
    margin-right: 0.4em;
  }
`;

export const SimulationStatus = styled(
  ({
    simulationRunning,
    lastRunStopReasons,
    lastRunEndConditions,
    elapsedTime = 0,
    className,
  }: {
    className?: string;
    simulationRunning: boolean;
    lastRunStopReasons: StopReason[];
    lastRunEndConditions: StopCondition[];
    elapsedTime: number;
  }) => {
    const { pauseCalculations } = useConfig();

    return (
      <StyledStatus className={className}>
        <Value>
          <Label>Simulation State</Label>
          {simulationRunning
            ? 'Running'
            : pauseCalculations
            ? 'Paused'
            : 'Ready'}
        </Value>
        <Value>
          <Label>Time Elapsed</Label>
          <>
            {elapsedTime < 1 ? `<${FNSP}` : ''}
            <Duration unit="ms" ms={Math.max(elapsedTime, 1)} />
          </>
        </Value>
        <Value>
          <Label>Result</Label>
          <TerminationWarning
            // TODO - use all
            reason={lastRunStopReasons?.[0] ?? 'unknown'}
            condition={lastRunEndConditions?.[0] ?? 'unknown'}
          />
        </Value>
      </StyledStatus>
    );
  },
)``;
