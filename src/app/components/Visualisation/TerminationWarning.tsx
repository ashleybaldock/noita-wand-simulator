import styled from 'styled-components';
import { StopCondition, StopReason } from '../../types';

const ResultError = styled.span`
  font-weight: bold;
  color: red;
  padding: 2px;
`;
const ResultSuccess = styled.span`
  font-weight: bold;
  padding: 2px;
`;

/*
 * successful:
 * done      - completed one wand shot
 * reset     - stopped after 2nd RESET (wand refresh)
 * looped    - same shot result as previous
 *
 * failure:
 * timeout   - hit total execution time limit
 * exception - details in info
 */

type TerminationInfo = {
  success: boolean;
  message: string;
};
const reasonMap: Record<StopReason, TerminationInfo> = {
  noSpells: { success: false, message: 'No Spells to process' },
  unknown: { success: false, message: 'Unknown' },
  refresh: { success: true, message: 'Stopped at 2nd Wand Refresh' },
  looped: { success: true, message: 'Stopped due to loop' },
  timeout: { success: false, message: 'Terminated due to global timeout' },
  exception: { success: false, message: 'Terminated due to exception' },
  oneshot: { success: true, message: 'One Shot Completed' },
  iterLimit: { success: false, message: 'Hit Iteration Limit' },
  reload: { success: true, message: 'Ended on Wand Reload' },
} as const;

export const TerminationWarning = styled(
  ({
    reason,
    condition,
    className,
  }: {
    reason: StopReason;
    condition: StopCondition;
    className?: string;
  }) => {
    const { success, message } = reasonMap[reason];
    return success ? (
      <ResultSuccess className={className}>{message}</ResultSuccess>
    ) : (
      <ResultError className={className}>{message}</ResultError>
    );
  },
)``;
