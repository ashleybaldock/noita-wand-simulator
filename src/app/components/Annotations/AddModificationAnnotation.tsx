import type { PropsWithChildren } from 'react';

export const AddModificationAnnotation = ({
  children,
  className,
}: { className?: string } & PropsWithChildren) => {
  return <div className={className}>{children}</div>;
};
