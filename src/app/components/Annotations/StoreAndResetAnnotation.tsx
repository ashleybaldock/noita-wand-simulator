import styled from 'styled-components';
import type { CSSProperties, PropsWithChildren } from 'react';
import type { ActionStateKey } from '../../calc/actionState';
import { StyledKeyContainer } from '../Key/Key';

const StyledDiv = styled.div<{ $stat: ActionStateKey }>`
  display: flex;
  background-size: contain;
  background-repeat: no-repeat;
  image-rendering: pixelated;
  background-size: 90%;
  background-repeat: no-repeat;
  background-position: center;

  --hue: var(--arrow-hue-${(props) => props.$stat});

  ${StyledKeyContainer} & {
    transform: none;
    position: relative;
    top: unset;
    right: unset;
    bottom: unset;
    left: unset;
  }
`;

export const StoreAndResetAnnotation = ({
  stat,
  children,
  style,
  className = '',
}: {
  stat: ActionStateKey;
  style?: CSSProperties;
  className?: string;
} & PropsWithChildren) => {
  return (
    <StyledDiv
      $stat={stat}
      style={style}
      className={className}
      data-name={'StoreAndResetAnnotation'}
      data-stat={stat}
    >
      {children}
    </StyledDiv>
  );
};
