import styled from 'styled-components';
import {
  assertNever,
  FNSP,
  round,
  sign,
  SUFFIX_FRAME,
  SUFFIX_MILLISECOND,
  SUFFIX_SECOND,
  toFrames,
  toSeconds,
} from '../../../util';
import { useConfig } from '../../../redux/configSlice';

type TimeUnit = 'f' | 's' | 'ms';

type DurationProps =
  | {
      unit: 'f';
      f: number;
    }
  | {
      unit: 's';
      s: number;
    }
  | {
      unit: 'ms';
      ms: number;
    };

export const Duration = styled(
  (props: DurationProps & { className?: string }) => {
    const { showDurationsInFrames } = useConfig();

    if (props.unit === 'ms') {
      return <>{`${props.ms}${FNSP}${SUFFIX_MILLISECOND}`}</>;
    }
    if (props.unit === 'f') {
      if (showDurationsInFrames) {
        return <>{`${props.f}${FNSP}${SUFFIX_FRAME}`}</>;
      }
      return <>{`~${round(toSeconds(props.f), 2)}${FNSP}${SUFFIX_SECOND}`}</>;
    }
    if (props.unit === 's') {
      if (showDurationsInFrames) {
        return <>{`~${toFrames(props.s)}${FNSP}${SUFFIX_FRAME}`}</>;
      }
      return <>{`${round(props.s, 2)}${FNSP}${SUFFIX_SECOND}`}</>;
    }
    return assertNever();
  },
)``;
