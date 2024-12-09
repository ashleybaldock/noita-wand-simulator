import styled from 'styled-components';
import type { ActionSource } from '../../calc/actionSources';
import { useConfig } from '../../redux';
import { BaseAnnotation } from './BaseAnnotation';
import { StyledKeyContainer } from '../Key/Key';

const SourceDiv = styled(BaseAnnotation)`
  pointer-events: none;
  font-size: 12px;
  text-align: center;
  font-family: var(--font-family-noita-default);

  position: absolute;
  top: 10%;
  transform: translateY(-50%);
  right: unset;

  ${StyledKeyContainer} & {
    position: relative;
    inset: unset;
    transform: none;
  }
`;

const sourceDisplayMap: Record<ActionSource, [string, string, string]> = {
  perk: ['P', 'Perk', ''],
  action: ['A', 'Action Call', ''],
  draw: ['D', 'Draw', ''],
  perm: ['C', 'Always Cast', ''],
  related: ['R', 'Copy Related', ''],
  multiple: ['*', 'Multiple', ''],
};

export const ActionSourceAnnotation = ({
  source,
}: {
  source?: ActionSource;
}) => {
  const { showSources } = useConfig();

  if (source === undefined || !showSources) {
    return null;
  }

  return (
    <SourceDiv
      data-name="ActionSource"
      data-source={source}
      data-content={sourceDisplayMap[source][0]}
      data-title={sourceDisplayMap[source][1]}
      data-desc={sourceDisplayMap[source][2]}
    >
      {sourceDisplayMap[source][0]}
    </SourceDiv>
  );
};
