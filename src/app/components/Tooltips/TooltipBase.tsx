import styled from 'styled-components';
import { Tooltip } from 'react-tooltip';

export const TooltipBase = styled(Tooltip)`
  z-index: var(--zindex-tooltips);

  min-width: 240px;

  --tip-show-delay: 400ms;
  --tip-hide-delay: 100ms;
  --tip-opacity: 0.9;

  --rt-opacity: var(--tip-opacity, 0.9);
  --rt-transition-show-delay: var(--tip-show-delay, 400ms);

  &.react-tooltip__show {
    opacity: var(--rt-opacity);

    transition: transform 200ms, visibility 300ms, opacity 300ms;
    transition-delay: var(--tip-show-delay);
    transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);

    transform: scale(1);
    visibility: visible;

    @media (prefers-reduced-motion: reduce) {
      transition: none;
    }
  }

  &.react-tooltip__closing {
    transition: transform 200ms, visibility 100ms, opacity 100ms;
    transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
    transition-delay: var(--tip-hide-delay);

    transform: scale(0.6);
    visibility: hidden;

    @media (prefers-reduced-motion: reduce) {
      transition: none;
    }
  }
`;
