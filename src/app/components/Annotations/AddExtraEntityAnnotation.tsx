import type { PropsWithChildren } from 'react';

export const AddExtraEntityAnnotation = ({
  children,
  className,
}: { className?: string } & PropsWithChildren) => {
  return <div className={className}>{children}</div>;
};
