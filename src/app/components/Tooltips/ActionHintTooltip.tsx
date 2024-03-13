import styled from 'styled-components';
import { TooltipBase } from './TooltipBase';
import { getActionHintDescription, isValidActionHintId } from './actionHintId';
import { isNotNullOrUndefined } from '../../util';
import { useHideTooltips } from './useHideTooltips';
const StyledTooltip = styled(TooltipBase)``;

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
  const [hidden, tooltipRef] = useHideTooltips();

  return (
    <TooltipBase
      id={'tooltip-actionhint'}
      hidden={hidden}
      ref={tooltipRef}
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
