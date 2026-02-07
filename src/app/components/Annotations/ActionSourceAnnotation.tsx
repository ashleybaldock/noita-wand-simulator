import styled from 'styled-components';
import type { ActionSource } from '../../calc/actionSources';
import { useConfig } from '../../redux';
import { BaseAnnotation } from './BaseAnnotation';

const StyledBaseAnnotation = styled(BaseAnnotation)`
  pointer-events: none;
  font-size: 12px;
  text-align: center;
  font-family: var(--font-family-noita-default);

  position: absolute;
  top: 10%;
  transform: translateY(-50%);
  right: unset;
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
  className,
}: {
  source?: ActionSource;
  className?: string;
}) => {
  const { showSources } = useConfig();

  if (source === undefined || !showSources) {
    return null;
  }

  return (
    <StyledBaseAnnotation
      className={className}
      data-name="ActionSource"
      data-source={source}
      data-content={sourceDisplayMap[source][0]}
      data-title={sourceDisplayMap[source][1]}
      data-desc={sourceDisplayMap[source][2]}
    >
      {sourceDisplayMap[source][0]}
    </StyledBaseAnnotation>
  );
};
