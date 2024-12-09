import type { PropsWithChildren } from 'react';

export const IterationAnnotation = ({
  iteration,
  limit = 5,
  children,
  style,
  className = '',
}: {
  iteration: number;
  limit?: number;
  style?: string;
  className?: string;
} & PropsWithChildren) => {
  return <div className={className}>{children}</div>;
};
