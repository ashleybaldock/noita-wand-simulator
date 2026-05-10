import styled from 'styled-components';
import { BaseAnnotation } from './BaseAnnotation';

export type ProjectileSource = 'action' | 'related';

const StyledBaseAnnotation = styled(BaseAnnotation)``;

/**
 * Shows the mechanism by which the projectile was added
 * 'action' - added during action call
 * 'related' - added using related_projectile (e.g. add trigger)
 */
export const AddProjectileAnnotation = ({
  source,
  className = '',
}: {
  source: ProjectileSource;
  className?: string;
}) => {
  return (
    <StyledBaseAnnotation className={className}>
      {source === 'action' ? 'AC' : ''}
      {source === 'related' ? 'RP' : ''}
    </StyledBaseAnnotation>
  );
};
