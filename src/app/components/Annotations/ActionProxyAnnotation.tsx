import styled from 'styled-components/macro';
import { Action, ActionCall, GroupedProjectile } from '../../calc';
import { useConfig } from '../../redux';
import { DEFAULT_SIZE } from '../../util';

export const ProxyDiv = styled.div<{
  size: number;
  imgUrl: string;
}>`
  pointer-events: none;
  position: absolute;
  top: 0;
  left: 0;
  width: ${({ size }) => size / 3}px;
  height: ${({ size }) => size / 3}px;
  border: 1px solid #999;
  background-image: url(/${({ imgUrl }) => imgUrl});
  background-size: cover;
  background-color: #111;
  font-family: var(--font-family-noita-default);
`;

type Props = {
  size?: number;
  proxy?: Action;
} & Partial<ActionCall> &
  Partial<GroupedProjectile>;

export function ActionProxyAnnotation(props: Props) {
  const { size = DEFAULT_SIZE, proxy } = props;
  const { config } = useConfig();

  if (proxy === undefined || !config.showProxies) {
    return null;
  }

  return <ProxyDiv size={size} imgUrl={proxy.sprite} />;
}
