import styled from 'styled-components';
import {
  isWithExpirationActionId,
  isWithTimerActionId,
  isWithTriggerActionId,
} from '../../calc/actionId';
import type { Spell } from '../../calc/spell';
import { useConfig } from '../../redux';
import { isNotNullOrUndefined } from '../../util';

export const ProxyDiv = styled.div<{
  imgUrl: string;
}>`
  pointer-events: none;
  position: absolute;
  top: 0;
  left: 0;
  width: calc(var(--size-spell) / 3);
  height: calc(var(--size-spell) / 3);
  border: 1px solid #999;
  background-image: url(/${({ imgUrl }) => imgUrl});
  background-size: cover;
  background-color: #111;
  font-family: var(--font-family-noita-default);
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
  proxy?: Spell;
  spell?: Spell;
}) => {
  const { showProxies } = useConfig();

  if (showProxies && isNotNullOrUndefined(proxy)) {
    return <ProxyDiv imgUrl={proxy.sprite} />;
  } else if (isNotNullOrUndefined(spell?.id)) {
    if (isWithTriggerActionId(spell?.id)) {
      return <ProxyDiv imgUrl={'data/icons/trigger-mod.png'} />;
    } else if (isWithTimerActionId(spell?.id)) {
      return <ProxyDiv imgUrl={'data/icons/timer-mod.png'} />;
    } else if (isWithExpirationActionId(spell?.id)) {
      return <ProxyDiv imgUrl={'data/icons/death-mod.png'} />;
    }
  }
  return null;
};
