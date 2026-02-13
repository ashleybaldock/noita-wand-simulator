import styled from 'styled-components';
import type { CSSProperties, PropsWithChildren } from 'react';

const StyledDiv = styled.div`
  display: flex;
`;

export const SpellSequence = ({
  children,
  style,
  className,
}: {
  style?: CSSProperties;
  className?: string;
} & PropsWithChildren) => {
  return (
    <StyledDiv style={style} className={className} data-name={'SpellSequence'}>
      {children}
    </StyledDiv>
  );
};
