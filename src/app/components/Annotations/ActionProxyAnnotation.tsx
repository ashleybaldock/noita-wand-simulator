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
import type { SpriteName } from '../../calc/sprite';
import { useIcon } from '../../calc/sprite';

export const ProxyDiv = styled.div<{
  background: string;
}>`
  --size: 0.58;
  --bsize: calc(var(--size-spell) * var(--size));

  pointer-events: none;
  font-family: var(--font-family-noita-default);
  position: absolute;
  ${(props) => props?.background && `background-image: ${props.background};`}
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

// const ProxyDivNoBorder = styled.div<{
//   imgUrl: string;
// }>`
//   --size-spell: var(--bsize-spell, 48px);
//   position: relative;
//   min-width: var(--size-spell);
//   width: var(--size-spell);
//   height: var(--size-spell);
//   background-size: cover;
//   font-family: monospace;
//   font-weight: bold;
//   user-select: none;
//   image-rendering: pixelated;
// `;

export const ActionProxyAnnotation = ({
  proxy,
  spell,
}: {
  proxy?: SpellDeckInfo;
  spell?: SpellDeckInfo;
}) => {
  const { showProxies } = useConfig();

  const icon: SpriteName | undefined = isWithTriggerActionId(spell?.id)
    ? `icon.trigger${spell?.permanently_attached ? '.disabled' : ''}`
    : isWithTimerActionId(spell?.id)
    ? `icon.timer${spell?.permanently_attached ? '.disabled' : ''}`
    : isWithExpirationActionId(spell?.id)
    ? `icon.expiration${spell?.permanently_attached ? '.disabled' : ''}`
    : undefined;

  const iconPath = useIcon(icon);

  if (showProxies && isNotNullOrUndefined(proxy)) {
    return (
      <ProxyDiv
        data-name="ActionProxyAnnotation-Proxy"
        background={getSpellById(proxy.id).sprite}
      />
    );
  } else if (isNotNullOrUndefined(spell?.id)) {
    return (
      <ProxyDiv
        data-name="ActionProxyAnnotation"
        background={icon ? iconPath : 'none'}
      />
    );
  }
  return null;
};
