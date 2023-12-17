import styled from 'styled-components';
import {
  round,
  sign,
  SUFFIX_FRAME,
  SUFFIX_SECOND,
  toSeconds,
} from '../../../util';
import { useConfig } from '../../../redux/configSlice';

export const Duration = styled(
  ({
    durationInFrames: n,
    className,
  }: {
    durationInFrames: number;
    className?: string;
  }) => {
    const { showDurationsInFrames } = useConfig();
    if (showDurationsInFrames) {
      return (
        <span className={className}>{`${round(
          Math.max(0, n),
          0,
        )}${SUFFIX_FRAME} ${n < 0 ? ` (${sign(n)})` : ``}`}</span>
      );
    } else {
      const s = toSeconds(n);
      return (
        <span className={className}>{`${round(
          Math.max(0, s),
          2,
        )}${SUFFIX_SECOND} ${n < 0 ? ` (${sign(s)})` : ``}`}</span>
      );
    }
  },
)``;
