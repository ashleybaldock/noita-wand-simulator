import styled from 'styled-components/macro';
import { ActionCall, GroupedProjectile } from '../../calc/eval/types';
import { useResultsConfig } from '../../redux';
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
} & Partial<ActionCall> &
  Partial<GroupedProjectile>;

export function ActionProxyAnnotation(props: Props) {
  const { size = DEFAULT_SIZE, proxy } = props;

  const { showProxies } = useResultsConfig();

  if (proxy === undefined || !showProxies) {
    return null;
  }

  return <ProxyDiv size={size} imgUrl={proxy.sprite} />;
}
