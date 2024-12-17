import styled from 'styled-components';
import type { CSSProperties, PropsWithChildren } from 'react';
import type { DiscardReason } from '../../calc/discardReasons';
import { StyledKeyContainer } from '../Key/Key';

const StyledDiv = styled.div<{ $reason: DiscardReason }>`
  display: flex;
  background-size: contain;
  background-repeat: no-repeat;
  image-rendering: pixelated;
  background-size: 90%;
  background-repeat: no-repeat;
  background-position: center;

  --hue: var(--arrow-hue-${(props) => props.$reason});

  ${StyledKeyContainer} & {
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
  style,
  className = '',
}: {
  reason: DiscardReason;
  style?: CSSProperties;
  className?: string;
} & PropsWithChildren) => {
  return (
    <StyledDiv
      $reason={reason}
      style={style}
      className={className}
      data-name={'Discarded'}
      data-reason={reason}
    >
      {children}
    </StyledDiv>
  );
};
