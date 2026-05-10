import styled from 'styled-components';
import { BaseAnnotation } from './BaseAnnotation';

const StyledBaseAnnotation = styled(BaseAnnotation)``;

export const DeltaDrawAnnotation = () => {
  return (
    <StyledBaseAnnotation data-name="DeltaDrawAnnotation"></StyledBaseAnnotation>
  );
};
