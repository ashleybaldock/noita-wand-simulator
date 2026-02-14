import styled from 'styled-components';
import { BaseAnnotation } from './BaseAnnotation';

const StyledBaseAnnotation = styled(BaseAnnotation)`
  display: flex;
  position: absolute;
  inset: -0.4em 0 auto 0;
  width: fit-content;
  justify-content: center;
  font-size: 1.1em;
  background-color: var(--color-base-background);
  margin: 0 auto;
  padding: 0.1em 0.25ch 0 0.25ch;
  border-radius: 6px;
  box-shadow:
    -1px -1.75px 0 -0.25px var(--color-arrow-action),
    1px -1.75px 0 -0.25px var(--color-arrow-action),
    0 0 0 1.5px #000;
  line-height: 0.9;

  &::before {
    content: '×';
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
