import styled from 'styled-components';
import type { StopReason } from '../../types';
import { isNotNullOrUndefined } from '../../util';

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
  refreshCount: { success: true, message: 'Stopped at 2nd Wand Refresh' },
  repeatCount: { success: true, message: 'Stopped due to loop' },
  timeout: { success: false, message: 'Terminated due to global timeout' },
  exception: { success: false, message: 'Terminated due to exception' },
  shotCount: { success: true, message: 'One Shot Completed' },
  iterationCount: { success: false, message: 'Hit Iteration Limit' },
  reloadCount: { success: true, message: 'Ended on Wand Reload' },
} as const;

export const TerminationWarning = styled(
  ({ reason, className }: { reason?: StopReason; className?: string }) => {
    if (isNotNullOrUndefined(reason)) {
      const { success, message } = reasonMap[reason];
      return success ? (
        <ResultSuccess className={className}>{message}</ResultSuccess>
      ) : (
        <ResultError className={className}>{message}</ResultError>
      );
    }

    return <></>;
  },
)``;
