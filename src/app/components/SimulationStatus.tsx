import styled from 'styled-components';
import { useConfig } from '../redux';
import { StopCondition, StopReason } from '../types';
import { TerminationWarning } from './Visualisation/TerminationWarning';

const StyledStatus = styled.div`
  margin: 0.4em 0 0.1em 0;
  text-align: center;
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
    lastStopReason,
    lastEndCondition,
    elapsedTime = 0,
    className,
  }: {
    className?: string;
    simulationRunning: boolean;
    lastStopReason: StopReason;
    lastEndCondition: StopCondition;
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
          {`${elapsedTime === 0 ? '<1' : elapsedTime}ms`}
        </Value>
        <Value>
          <Label>Result</Label>
          <TerminationWarning
            reason={lastStopReason}
            condition={lastEndCondition}
          />
        </Value>
      </StyledStatus>
    );
  },
)``;
