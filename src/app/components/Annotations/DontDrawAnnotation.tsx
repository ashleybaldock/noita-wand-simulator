import styled from 'styled-components/macro';
import { ActionCall, GroupedProjectile } from '../../calc/eval/types';
import { useConfig } from '../../redux';
import { DEFAULT_SIZE } from '../../util';

const DontDrawDiv = styled.div<{
  size: number;
}>`
  pointer-events: none;
  position: absolute;
  top: -3px;
  top: 50%;
  transform: translateY(-50%);
  right: -${({ size }) => size / 4 + 12}px;
  width: ${({ size }) => size / 4}px;
  height: ${({ size }) => size / 4}px;
  border: 1px solid #999;
  color: black;
  background-color: #c55;
  font-size: 12px;
  line-height: ${({ size }) => size / 3 - 2}px;
  text-align: center;
  font-family: var(--font-family-noita-default);
`;

type Props = {
  size: number;
  dont_draw_actions?: boolean;
} & Partial<ActionCall> &
  Partial<GroupedProjectile>;

export function DontDrawAnnotation(props: Props) {
  const { size = DEFAULT_SIZE, dont_draw_actions = false } = props;
  const { config } = useConfig();

  if (!dont_draw_actions || !config.showDontDraw) {
    return null;
  }

  return <DontDrawDiv size={size}>D</DontDrawDiv>;
}
