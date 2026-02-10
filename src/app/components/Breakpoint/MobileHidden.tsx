import styled from 'styled-components';
import type { BreakPoint } from './Breakpoint';

export const MobileHidden = styled.div<
  { $breakpoint?: BreakPoint } & React.PropsWithChildren
>`
  @media screen and ((max-width: ${({ $breakpoint = '600px' }) =>
      $breakpoint}}) { display: none; };;
`;
