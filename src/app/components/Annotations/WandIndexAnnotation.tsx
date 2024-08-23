import styled from 'styled-components';
import type { WandIndex } from '../../redux/WandIndex';
import { WithDebugHints } from '../Debug';

const IndexDiv = styled.div`
  display: none;

  ${WithDebugHints} && {
    display: block;
    pointer-events: none;
    position: absolute;
    top: -2px;
    right: 0;
    left: 0;
    text-align: center;
    z-index: var(--zindex-note-deckidx);
    color: rgb(64, 255, 64);
    font-size: 16px;
    font-family: var(--font-family-noita-default);
    font-family: monospace;
    font-weight: normal;
    --shadow-bg: rgb(0, 0, 0);
    --shadow-w: 0px;
    text-shadow: var(--shadow-bg) 1px 1px var(--shadow-w),
      var(--shadow-bg) 1px -1px var(--shadow-w),
      var(--shadow-bg) -1px 1px var(--shadow-w),
      var(--shadow-bg) -1px -1px var(--shadow-w), var(--shadow-bg) 1px 1px 1px,
      var(--shadow-bg) 1px -1px 1px, var(--shadow-bg) -1px 1px 1px,
      var(--shadow-bg) -1px -1px 1px;
  }
`;

export const WandIndexAnnotation = ({
  wandIndex,
}: {
  wandIndex?: WandIndex;
}) => {
  return <IndexDiv data-name="WandIndexAnnotation">{wandIndex}</IndexDiv>;
};
