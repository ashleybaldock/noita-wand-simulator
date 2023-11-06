import styled from 'styled-components/macro';

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
 * reset     - stopped after 2nd RESET (wanr refresh)
 * looped    - same shot result as previous
 *
 * failure:
 * timeout   - hit total execution time limit
 * exception - details in info
 */
export type TerminationReason =
  | 'done'
  | 'timeout'
  | 'exception'
  | 'reset'
  | 'looped';

type TerminationInfo = {
  success: boolean;
  message: string;
};
const reasonMap: Record<TerminationReason, TerminationInfo> = {
  done: { success: true, message: 'Completed' },
  reset: { success: true, message: 'Stopped at 2nd Wand Refresh' },
  looped: { success: true, message: 'Stopped due to loop' },
  timeout: { success: false, message: 'Terminated due to global timeout' },
  exception: { success: false, message: 'Terminated due to exception' },
} as const;

export const TerminationWarning = ({
  reason,
}: {
  reason: TerminationReason;
  info?: string;
}) => {
  const { success, message } = reasonMap[reason];
  if (success) {
    return <ResultSuccess>{message}</ResultSuccess>;
  } else {
    return <ResultError>{message}</ResultError>;
  }
};
