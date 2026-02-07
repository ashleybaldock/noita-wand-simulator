import styled from 'styled-components';
import { BaseAnnotation } from './BaseAnnotation';

const StyledBaseAnnotation = styled(BaseAnnotation)`
  display: flex;
  position: absolute;
  inset: -0.4em 0 auto 0;
  width: fit-content;
  justify-content: center;
  font-size: 1.2em;
  background-color: var(--color-base-background);
  margin: 0 auto;
  padding: 0 0.25ch 0 0.25ch;
  border-radius: 0.5em;
  box-shadow:
    0 0 0 1px var(--color-arrow-action),
    0 0 0 1.5px #000;

  &::before {
    content: 'x';
    margin-right: 0.1ch;
  }
`;

export const ProjectileCountAnnotation = ({
  count = 1,
  className,
}: {
  count?: number;
  className?: string;
}) => {
  return count <= 1 ? null : (
    <StyledBaseAnnotation
      className={className}
      dataName={'ProjectileCountAnnotation'}
    >
      {count}
    </StyledBaseAnnotation>
  );
};
