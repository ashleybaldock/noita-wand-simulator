import type { PropsWithChildren } from 'react';
import styled from 'styled-components';
import { BaseAnnotation } from './BaseAnnotation';

const StyledBaseAnnotation = styled(BaseAnnotation)``;

export const AddExtraEntityAnnotation = ({
  children,
  className,
}: { className?: string } & PropsWithChildren) => {
  return (
    <StyledBaseAnnotation className={className}>
      {children}
    </StyledBaseAnnotation>
  );
};
