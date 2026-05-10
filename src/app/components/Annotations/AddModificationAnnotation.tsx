import type { PropsWithChildren } from 'react';
import styled from 'styled-components';
import { BaseAnnotation } from './BaseAnnotation';

const StyledBaseAnnotation = styled(BaseAnnotation)``;

export const AddModificationAnnotation = ({
  children,
  className,
}: { className?: string } & PropsWithChildren) => {
  return (
    <StyledBaseAnnotation className={className} data-name="Wrapped">
      {children}
    </StyledBaseAnnotation>
  );
};
