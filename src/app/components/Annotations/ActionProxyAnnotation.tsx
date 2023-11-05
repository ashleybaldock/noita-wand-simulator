import styled from 'styled-components/macro';
import { Spell } from '../../calc/spell';
import { useConfig } from '../../redux';

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

type Props = {
  proxy?: Spell;
};

export function ActionProxyAnnotation(props: Props) {
  const { proxy } = props;
  const { config } = useConfig();

  if (proxy === undefined || !config.showProxies) {
    return null;
  }

  return <ProxyDiv imgUrl={proxy.sprite} />;
}
