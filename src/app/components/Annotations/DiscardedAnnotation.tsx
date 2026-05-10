import styled from 'styled-components';
import type { PropsWithChildren } from 'react';
import type { DiscardReason } from '../../calc/discardReasons';
import { _KeyContainer } from '../Key/Key';
import { BaseAnnotation } from './BaseAnnotation';

const StyledBaseAnnotation = styled(BaseAnnotation)<{ reason: DiscardReason }>`
  display: flex;
  background-size: contain;
  background-repeat: no-repeat;
  image-rendering: pixelated;
  background-size: 90%;
  background-repeat: no-repeat;
  background-position: center;

  --hue: var(--arrow-hue-${({ reason }) => reason});

  ${_KeyContainer} & {
    transform: none;
    position: relative;
    top: unset;
    right: unset;
    bottom: unset;
    left: unset;
  }
`;

export const DiscardedAnnotation = ({
  reason,
  children,
  className = '',
}: {
  reason: DiscardReason;
  className?: string;
} & PropsWithChildren) => {
  return (
    <StyledBaseAnnotation
      reason={reason}
      className={className}
      data-name={'Discarded'}
      data-reason={reason}
    >
      {children}
    </StyledBaseAnnotation>
  );
};
