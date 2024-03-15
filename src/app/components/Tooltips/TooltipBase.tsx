import styled from 'styled-components';
import { Tooltip } from 'react-tooltip';

export const TooltipBase = styled(Tooltip)`
  z-index: var(--zindex-tooltips);

  min-width: 240px;

  --rt-opacity: 0.9;

  &.show {
    opacity: var(--rt-opacity);

    transition: transform 200ms, visibility 300ms, opacity 300ms;
    transition-delay: 4000ms;
    transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);

    transform: scale(1);
    visibility: visible;

    @media (prefers-reduced-motion: reduce) {
      transition: none;
    }
  }

  &.closing {
    transition: transform 200ms, visibility 100ms, opacity 100ms;
    transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
    transition-delay: 1000ms;

    transform: scale(0.6);
    visibility: hidden;

    @media (prefers-reduced-motion: reduce) {
      transition: none;
    }
  }
`;
