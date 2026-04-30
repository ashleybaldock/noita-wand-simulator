import styled from 'styled-components';
import {TooltipBase} from './TooltipBase';
import {useHideTooltips} from './useHideTooltips';
import {getUiHintDescription, isUiHint} from './tooltipId';

const UiHint = styled.div`
  font-size: 0.7em;
  max-width: 18vw;
  width: fit-content;
  min-width: 150px;
  pointer-events: none;

  padding: 1em;
  border: 2px solid #928167;
  border-radius: 0 7.5px;
  background-color: rgba(5, 5, 5, 0.9);
  color: rgb(250, 250, 250);
`;
const UiHintTooltipBase = styled(TooltipBase)`
  --tip-show-delay: 1200ms;
`;

export const UiHintTooltip = () => {
  const [hidden, tooltipRef] = useHideTooltips();

  return (
    <UiHintTooltipBase
      id={'tooltip-uihint'}
      data-name={'UiHintTooltip'}
      hidden={hidden}
      ref={tooltipRef}
      disableStyleInjection={true}
      offset={15}
      closeEvents={{
        mouseleave: true,
        blur: true,
        click: true,
      }}
      render={({content}) =>
        isUiHint(content) ? (
          <UiHint>{getUiHintDescription(content)}</UiHint>
        ) : null
      }
    />
  );
};
