import styled from 'styled-components';
import { TooltipBase } from './TooltipBase';
import { useHideTooltips } from './useHideTooltips';
import { getUiHintDescription, isUiHint } from './tooltipId';

const UiHint = styled.div`
  font-size: 0.7em;
  max-width: 18vw;
  width: fit-content;
  min-width: 150px;
  pointer-events: none;

  padding: 1em;
  border: 2px solid #928167;
  border-radius: 0 7.5px;
  background-color: rgba(5, 5, 5, 0.76);
  color: rgb(250, 250, 250);
`;

export const UiHintTooltip = () => {
  const [hidden, tooltipRef] = useHideTooltips();

  return (
    <TooltipBase
      id={'tooltip-uihint'}
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
        if (isUiHint(content)) {
          return <UiHint>{getUiHintDescription(content)}</UiHint>;
        }
        return null;
      }}
    />
  );
};
