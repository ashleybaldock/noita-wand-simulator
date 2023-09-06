import styled from 'styled-components/macro';
import { ActionSource } from '../../calc/actionSources';
import { ActionCall, GroupedProjectile } from '../../calc/eval/types';
import { useResultsConfig } from '../../redux';
import { DEFAULT_SIZE } from '../../util';

const SourceDiv = styled.div<{
  size: number;
  colors: [string, string];
}>`
  pointer-events: none;
  position: absolute;
  top: 10%;
  transform: translateY(-50%);
  left: -${({ size }) => size / 4 + 12}px;
  width: ${({ size }) => size / 4}px;
  height: ${({ size }) => size / 4}px;
  border: 1px solid #999;
  color: ${({ colors }) => colors[0]};
  background-color: ${({ colors }) => colors[1]};
  font-size: 12px;
  line-height: ${({ size }) => size / 3 - 2}px;
  text-align: center;
  font-family: var(--font-family-noita-default);
`;

const sourceDisplayMap: Record<ActionSource, [string, [string, string]]> = {
  perk: ['P', ['#ddd', '#995']],
  action: ['A', ['#ddd', '#955']],
  draw: ['D', ['#ddd', '#559']],
  unknown: ['?', ['#ddd', '#747']],
  multiple: ['*', ['#ddd', '#747']],
};

type Props = {
  size?: number;
  source?: ActionSource;
} & Partial<ActionCall> &
  Partial<GroupedProjectile>;

export function ActionSourceAnnotation(props: Props) {
  const { size = DEFAULT_SIZE, source } = props;

  const { showSources } = useResultsConfig();

  if (source === undefined || !showSources) {
    return null;
  }

  return (
    <SourceDiv size={size} colors={sourceDisplayMap[source][1]}>
      {sourceDisplayMap[source][0]}
    </SourceDiv>
  );
}
