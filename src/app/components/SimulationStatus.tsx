import styled from 'styled-components';
import { useConfig, useLatestResult, useSimulationStatus } from '../redux';
import { FNSP } from '../util';
import { Duration } from './Visualisation/Duration';

const StyledStatus = styled.div`
  margin: 0.4em 0 0.1em 0;
  text-align: center;
  position: sticky;
  left: 1em;
  right: 1em;
  position: fixed;
  inset: auto auto var(--footer-offset, 0) 0;
  z-index: var(--zindex-status);
  background-color: var(--color-base-background);
  margin: 0;
`;

const Label = styled.span`
  color: var(--color-subdued);
  font-size: 0.7em;
  line-height: 1em;
  &::before {
  }
  &::after {
    content: ':';
    margin: 0 0.6em 0 0.1em;
  }
`;

const Value = styled.span`
  white-space: nowrap;
  display: flex;
  background-color: var(--color-base-background);
  &::before {
    content: '«';
    content: none;
    color: var(--color-subdued);
    margin: 0 0.4em 0 -0.4em;
  }
  &&:first-child::before {
    margin-left: 0.4em;
  }
  &::after {
    content: '»';
    content: none;
    margin: 0 -0.4em 0 0.4em;
    color: var(--color-subdued);
  }
  &&:last-child::after {
    margin-right: 0.4em;
  }
`;

const Paused = styled.span`
  color: #ffff00;
  font-size: 1.1em;
  line-height: 1em;
`;

export const SimulationStatus = styled(
  ({ className }: { className?: string }) => {
    const { simulationRunning, elapsedTime } = useSimulationStatus();
    const { pauseCalculations } = useConfig();
    const {
      endConditions: lastRunEndConditions,
      elapsedTime: lastRunElapsedTime,
    } = useLatestResult();

    return (
      <>
        <StyledStatus data-name={'SimulationStatus'} className={className}>
          <Value>
            <Label>Simulation</Label>
            {simulationRunning ? (
              'Running…'
            ) : pauseCalculations ? (
              <Paused>Paused</Paused>
            ) : (
              'Idle'
            )}
          </Value>
          {simulationRunning ? (
            <Value>
              <Label>Time Elapsed</Label>
              <>
                {elapsedTime && elapsedTime < 1 ? `<${FNSP}` : ''}
                <Duration ms={Math.max(elapsedTime ?? 0, 1)} />
              </>
            </Value>
          ) : (
            <Value>
              <Label>Last Run Time</Label>
              <>
                {lastRunElapsedTime < 1 ? `<${FNSP}` : ''}
                <Duration ms={Math.max(lastRunElapsedTime, 1)} />
              </>
            </Value>
          )}
        </StyledStatus>
      </>
    );
  },
)``;
