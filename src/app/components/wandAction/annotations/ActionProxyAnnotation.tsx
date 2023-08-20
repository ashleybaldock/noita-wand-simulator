import styled from 'styled-components/macro';
import { ActionCall, GroupedProjectile } from '../../../calc/eval/types';
import { Action } from '../../../calc/extra/types';
import { useAppSelector } from '../../../redux/hooks';
import { selectConfig } from '../../../redux/configSlice';

const DEFAULT_SIZE = 48;

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
  size: number;
  proxy?: Action;
} & Partial<ActionCall> &
  Partial<GroupedProjectile>;

export function ActionProxyAnnotation(props: Props) {
  const { proxy } = props;
  const size = props.size ?? DEFAULT_SIZE;
  const { config } = useAppSelector(selectConfig);
  if (proxy === undefined || !config.showProxies) {
    return null;
  }

  return <ProxyDiv size={size} imgUrl={proxy.sprite} />;
}
