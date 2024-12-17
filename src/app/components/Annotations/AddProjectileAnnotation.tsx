import styled from 'styled-components';
import type { CSSProperties } from 'react';

export type ProjectileSource = 'action' | 'related';

const StyledDiv = styled.div``;

/**
 * Shows the mechanism by which the projectile was added
 * 'action' - added during action call
 * 'related' - added using related_projectile (e.g. add trigger)
 */
export const AddProjectileAnnotation = ({
  source,
  style,
  className = '',
}: {
  source: ProjectileSource;
  style?: CSSProperties;
  className?: string;
}) => {
  return (
    <StyledDiv style={style} className={className}>
      {source === 'action' ? 'AC' : ''}
      {source === 'related' ? 'RP' : ''}
    </StyledDiv>
  );
};
