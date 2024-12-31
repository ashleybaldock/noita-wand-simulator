import styled from 'styled-components';
import { useConfig, useLatestResult, useSimulationStatus } from '../redux';
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
  ({ className }: { className?: string }) => {
    const [simulationRunning] = useSimulationStatus();
    const { pauseCalculations } = useConfig();
    const {
      endConditions: lastRunEndConditions,
      elapsedTime: lastRunElapsedTime,
    } = useLatestResult();

    return (
      <StyledStatus data-name={'SimulationStatus'} className={className}>
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
            {lastRunElapsedTime < 1 ? `<${FNSP}` : ''}
            <Duration ms={Math.max(lastRunElapsedTime, 1)} />
          </>
        </Value>
        <Value>
          <Label>Result</Label>
          <TerminationWarning
            // TODO - use all
            reason={lastRunEndConditions?.[0] ?? 'unknown'}
          />
        </Value>
      </StyledStatus>
    );
  },
)``;
