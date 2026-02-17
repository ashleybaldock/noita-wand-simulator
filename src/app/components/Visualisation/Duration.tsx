import styled from 'styled-components';
import {
  FNSP,
  round,
  SUFFIX_FRAME,
  SUFFIX_MILLISECOND,
  SUFFIX_SECOND,
  toFrames,
  toSeconds,
} from '../../util';
import { useConfig } from '../../redux';

type DurationProps =
  | {
      f: number;
      s?: undefined;
      ms?: undefined;
    }
  | {
      f?: undefined;
      s: number;
      ms?: undefined;
    }
  | {
      f?: undefined;
      s?: undefined;
      ms: number;
    };

export const Duration = styled(
  ({ ms, f, s }: DurationProps & { className?: string }) => {
    const { showDurationsInFrames } = useConfig();

    if (ms) {
      return <>{`≈${FNSP}${ms}${FNSP}${SUFFIX_MILLISECOND}`}</>;
    }
    if (f) {
      if (showDurationsInFrames) {
        return <>{`${f}${FNSP}${SUFFIX_FRAME}`}</>;
      }
      return <>{`≈${FNSP}${round(toSeconds(f), 2)}${FNSP}${SUFFIX_SECOND}`}</>;
    }
    if (s) {
      if (showDurationsInFrames) {
        return <>{`≈${FNSP}${toFrames(s)}${FNSP}${SUFFIX_FRAME}`}</>;
      }
      return <>{`${round(s, 2)}${FNSP}${SUFFIX_SECOND}`}</>;
    }
    return <>{`?`}</>;
  },
)``;
