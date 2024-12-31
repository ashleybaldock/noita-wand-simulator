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
  (props: DurationProps & { className?: string }) => {
    const { showDurationsInFrames } = useConfig();

    if (props.ms) {
      return <>{`≈${FNSP}${props.ms}${FNSP}${SUFFIX_MILLISECOND}`}</>;
    }
    if (props.f) {
      if (showDurationsInFrames) {
        return <>{`${props.f}${FNSP}${SUFFIX_FRAME}`}</>;
      }
      return (
        <>{`≈${FNSP}${round(toSeconds(props.f), 2)}${FNSP}${SUFFIX_SECOND}`}</>
      );
    }
    if (props.s) {
      if (showDurationsInFrames) {
        return <>{`≈${FNSP}${toFrames(props.s)}${FNSP}${SUFFIX_FRAME}`}</>;
      }
      return <>{`${round(props.s, 2)}${FNSP}${SUFFIX_SECOND}`}</>;
    }
    return <>{`?`}</>;
  },
)``;
