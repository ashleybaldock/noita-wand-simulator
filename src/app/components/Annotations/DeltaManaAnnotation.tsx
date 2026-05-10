import styled from 'styled-components';
import { BaseAnnotation } from './BaseAnnotation';

const StyledBaseAnnotation = styled(BaseAnnotation)``;

export const DeltaManaAnnotation = () => {
  return (
    <StyledBaseAnnotation data-name="DeltaManaAnnotation"></StyledBaseAnnotation>
  );
};
