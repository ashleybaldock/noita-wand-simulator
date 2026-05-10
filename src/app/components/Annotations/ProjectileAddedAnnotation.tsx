import styled from 'styled-components';
import type { PropsWithChildren } from 'react';
import { BaseAnnotation } from './BaseAnnotation';

const StyledBaseAnnotation = styled(BaseAnnotation)`
  display: flex;
`;

export const ProjectileAddedAnnotation = ({
  children,
  className = '',
}: {
  className?: string;
} & PropsWithChildren) => {
  return (
    <StyledBaseAnnotation
      className={className}
      data-name={'ProjectileAddedAnnotation'}
    >
      {children}
    </StyledBaseAnnotation>
  );
};
