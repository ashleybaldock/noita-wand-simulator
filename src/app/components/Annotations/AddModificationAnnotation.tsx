import type { PropsWithChildren } from 'react';

export const AddModificationAnnotation = ({
  children,
  style,
  className = '',
}: { style?: string; className?: string } & PropsWithChildren) => {
  return <div className={className}>{children}</div>;
};
