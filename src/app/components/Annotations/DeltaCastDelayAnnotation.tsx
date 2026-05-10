import styled from 'styled-components';
import { BaseAnnotation } from './BaseAnnotation';

const StyledBaseAnnotation = styled(BaseAnnotation)``;

export const DeltaCastDelayAnnotation = () => {
  return (
    <StyledBaseAnnotation data-name="DeltaCastDelayAnnotation"></StyledBaseAnnotation>
  );
};
