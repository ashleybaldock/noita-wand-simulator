import styled from 'styled-components';
import { useConfig } from '../redux';

export const DebugHints = ({
  className,
  children,
}: React.PropsWithChildren<{ className?: string }>) => {
  const {
    debug: { dragHint },
  } = useConfig();

  return dragHint ? (
    <WithDebugHints className={className}>{children}</WithDebugHints>
  ) : (
    <>{children}</>
  );
};

export const WithDebugHints = styled.div``;
