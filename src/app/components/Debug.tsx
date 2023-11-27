import styled from 'styled-components/macro';
import { useConfig } from '../redux/configSlice';

export const DebugHints = ({
  className,
  children,
}: React.PropsWithChildren<{ className?: string }>) => {
  const {
    debug: { dragHint },
  } = useConfig();

  return dragHint ? (
    <WithDebugHints>{children}</WithDebugHints>
  ) : (
    <>{children}</>
  );
};

export const WithDebugHints = styled.div``;
