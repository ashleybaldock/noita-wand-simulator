import styled from 'styled-components';
import { toggleConfigSetting } from '../redux/configSlice';
import { useConfig } from '../redux';
import { useAppDispatch } from '../redux/hooks';
import { useHotkeys } from 'react-hotkeys-hook';

export const WithDebugHints = styled.div``;

export const DebugHints = ({
  className,
  children,
}: React.PropsWithChildren<{ className?: string }>) => {
  const { 'debug.dragHint': dragHint } = useConfig();

  const dispatch = useAppDispatch();
  useHotkeys('=', () => {
    dispatch(toggleConfigSetting({ name: 'debug.dragHint' }));
  });

  return dragHint ? (
    <WithDebugHints className={className}>{children}</WithDebugHints>
  ) : (
    <>{children}</>
  );
};
