import styled from 'styled-components/macro';
import { useAppSelector } from '../redux/hooks';
import { selectConfig } from '../redux/configSlice';

export const DebugHints = ({
  className,
  children,
}: React.PropsWithChildren<{ className?: string }>) => {
  const {
    config: {
      debug: { dragHint },
    },
  } = useAppSelector(selectConfig);

  return dragHint ? (
    <WithDebugHints>{children}</WithDebugHints>
  ) : (
    <>{children}</>
  );
};

export const WithDebugHints = styled.div``;
