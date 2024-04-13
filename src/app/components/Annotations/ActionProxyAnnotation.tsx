import styled from 'styled-components';
import {
  isWithExpirationActionId,
  isWithTimerActionId,
  isWithTriggerActionId,
} from '../../calc/actionId';
import type { SpellDeckInfo } from '../../calc/spell';
import { useConfig } from '../../redux';
import { isNotNullOrUndefined } from '../../util';
import { getSpellById } from '../../calc/spells';

export const ProxyDiv = styled.div<{
  imgUrl: string;
}>`
  --size: 0.58;
  --bsize: calc(var(--size-spell) * var(--size));

  pointer-events: none;
  font-family: var(--font-family-noita-default);
  position: absolute;
  background-image: url(/${({ imgUrl }) => imgUrl});
  background-size: cover;

  top: calc(var(--bsize) * -0.25);
  left: calc(var(--bsize) * -0.25);
  width: var(--bsize);
  height: var(--bsize);
  border: 1px solid #000;
  background-color: #11111199;
  border-radius: 50%;
  box-sizing: border-box;
`;

const ProxyDivNoBorder = styled.div<{
  imgUrl: string;
}>`
  --size-spell: var(--bsize-spell, 48px);
  position: relative;
  min-width: var(--size-spell);
  width: var(--size-spell);
  height: var(--size-spell);
  background-size: cover;
  font-family: monospace;
  font-weight: bold;
  user-select: none;
  image-rendering: pixelated;
`;

export const ActionProxyAnnotation = ({
  proxy,
  spell,
}: {
  proxy?: SpellDeckInfo;
  spell?: SpellDeckInfo;
}) => {
  const { showProxies } = useConfig();

  if (showProxies && isNotNullOrUndefined(proxy)) {
    return (
      <ProxyDiv
        data-name="ActionProxyAnnotation-Proxy"
        imgUrl={getSpellById(proxy.id).sprite}
      />
    );
  } else if (isNotNullOrUndefined(spell?.id)) {
    if (isWithTriggerActionId(spell?.id)) {
      return (
        <ProxyDiv
          data-name="ActionProxyAnnotation-Trigger"
          imgUrl={'data/icons/trigger-mod.png'}
        />
      );
    } else if (isWithTimerActionId(spell?.id)) {
      return (
        <ProxyDiv
          data-name="ActionProxyAnnotation-Timer"
          imgUrl={'data/icons/timer-mod.png'}
        />
      );
    } else if (isWithExpirationActionId(spell?.id)) {
      return (
        <ProxyDiv
          data-name="ActionProxyAnnotation-Expiration"
          imgUrl={'data/icons/death-mod.png'}
        />
      );
    }
  }
  return null;
};
