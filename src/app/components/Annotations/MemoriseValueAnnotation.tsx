import styled from 'styled-components';
import type { PropsWithChildren } from 'react';
import type { ActionStateKey } from '../../calc/actionState';
import { _KeyContainer } from '../Key/Key';
import { BaseAnnotation } from './BaseAnnotation';

const StyledBaseAnnotation = styled(BaseAnnotation)<{ stat: ActionStateKey }>`
  display: flex;
  background-size: contain;
  background-repeat: no-repeat;
  image-rendering: pixelated;
  background-size: 90%;
  background-repeat: no-repeat;
  background-position: center;

  --hue: var(--arrow-hue-${(props) => props.stat});

  ${_KeyContainer} & {
    transform: none;
    position: relative;
    top: unset;
    right: unset;
    bottom: unset;
    left: unset;
  }
`;

export const MemoriseValueAnnotation = ({
  stat,
  children,
  className = '',
}: {
  stat: ActionStateKey;
  className?: string;
} & PropsWithChildren) => {
  return (
    <StyledBaseAnnotation
      stat={stat}
      className={className}
      data-name={'MemoriseValue'}
      data-stat={stat}
    >
      {children}
    </StyledBaseAnnotation>
  );
};
