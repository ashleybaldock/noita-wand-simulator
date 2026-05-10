import styled from 'styled-components';
import {
  isWithExpirationActionId,
  isWithTimerActionId,
  isWithTriggerActionId,
} from '../../calc/actionId';
import type { SpellDeckInfo } from '../../calc/spell';
import { useConfig } from '../../redux';
import { isNotNullOrUndefined } from '../../util';
import { getSpellByActionId } from '../../calc/spells';
import type { SpriteName, SpritePath } from '../../calc/sprite';
import { useSpritePath } from '../../calc/sprite';
import { BaseAnnotation } from './BaseAnnotation';

export const StyledBaseAnnotation = styled(BaseAnnotation)<{
  background: SpritePath;
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

export const ActionProxyAnnotation = ({
  proxy,
  spell,
}: {
  proxy?: SpellDeckInfo;
  spell?: SpellDeckInfo;
}) => {
  const { showProxies } = useConfig();

  const icon: SpriteName = isWithTriggerActionId(spell?.id)
    ? `icon.trigger${spell?.permanently_attached ? '.disabled' : ''}`
    : isWithTimerActionId(spell?.id)
      ? `icon.timer${spell?.permanently_attached ? '.disabled' : ''}`
      : isWithExpirationActionId(spell?.id)
        ? `icon.expiration${spell?.permanently_attached ? '.disabled' : ''}`
        : 'none';

  const iconPath = useSpritePath(icon);

  if (showProxies && isNotNullOrUndefined(proxy)) {
    return (
      <StyledBaseAnnotation
        dataName="ActionProxyAnnotation-Proxy"
        background={getSpellByActionId(proxy.id).sprite}
      />
    );
  } else if (isNotNullOrUndefined(icon)) {
    return (
      <StyledBaseAnnotation
        dataName="ActionProxyAnnotation"
        background={iconPath}
      />
    );
  }
  return null;
};
