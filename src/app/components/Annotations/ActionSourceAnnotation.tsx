import styled from 'styled-components/macro';
import { ActionSource } from '../../calc/actionSources';
import { ActionCall } from '../../calc/eval/types';
import { useConfig } from '../../redux';
import { BaseAnnotation } from './BaseAnnotation';

const SourceDiv = styled(BaseAnnotation)<{
  colors: [string, string];
}>`
  pointer-events: none;
  position: absolute;
  top: 10%;
  transform: translateY(-50%);
  right: unset;
  border: 1px solid #999;
  color: ${({ colors }) => colors[0]};
  background-color: ${({ colors }) => colors[1]};
  font-size: 12px;
  text-align: center;
  font-family: var(--font-family-noita-default);
`;

const sourceDisplayMap: Record<ActionSource, [string, [string, string]]> = {
  perk: ['P', ['#ddd', '#995']],
  action: ['A', ['#ddd', '#955']],
  draw: ['D', ['#ddd', '#559']],
  multiple: ['*', ['#ddd', '#747']],
};

type Props = {
  source?: ActionSource;
} & Partial<ActionCall>;

export function ActionSourceAnnotation(props: Props) {
  const { source } = props;
  const { showSources } = useConfig();

  if (source === undefined || !showSources) {
    return null;
  }

  return (
    <SourceDiv colors={sourceDisplayMap[source][1]}>
      {sourceDisplayMap[source][0]}
    </SourceDiv>
  );
}
