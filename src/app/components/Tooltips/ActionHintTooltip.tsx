import styled from 'styled-components';
import { Tooltip } from 'react-tooltip';
import { getActionHintDescription, isValidActionHintId } from './actionHintId';
import { isNotNullOrUndefined } from '../../util';
const StyledTooltip = styled(Tooltip)`
  z-index: var(--zindex-tooltips);

  min-width: 240px;

  &.show {
    opacity: var(--rt-opacity);
    transition: opacity var(--rt-transition-show-delay) ease-out;

    transition: transform 200ms, visibility 300ms, opacity 300ms;
    transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
    transform: scale(1);
    visibility: visible;

    @media (prefers-reduced-motion: reduce) {
      transition: none;
    }
  }

  &.closing {
    transition: opacity var(--rt-transition-closing-delay) ease-in;
    transition: transform 200ms, visibility 100ms, opacity 100ms;
    transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
    transform: scale(0.6);
    visibility: hidden;

    @media (prefers-reduced-motion: reduce) {
      transition: none;
    }
  }
`;

const ActionHint = styled.div`
  font-size: 0.7em;
  max-width: 18vw;
  width: fit-content;
  min-width: 150px;
  pointer-events: none;

  padding: 1em;
  border: 2px solid #928167;
  border-radius: 0px 7.5px 0px 7.5px;
  background-color: rgba(5, 5, 5, 0.76);
  color: rgb(250, 250, 250);
`;

export const ActionHintTooltip = () => {
  return (
    <StyledTooltip
      id={'tooltip-actionhint'}
      disableStyleInjection={true}
      offset={10}
      closeEvents={{
        mouseleave: true,
        blur: true,
        click: true,
      }}
      render={({ content }) => {
        if (!isNotNullOrUndefined(content) || !isValidActionHintId(content)) {
          return null;
        }
        return <ActionHint>{getActionHintDescription(content)}</ActionHint>;
      }}
    />
  );
};
