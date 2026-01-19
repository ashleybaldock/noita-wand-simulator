import styled from 'styled-components';
import type { CSSProperties, PropsWithChildren } from 'react';

export const _ActionTreeCastResultNodeDiv = ({
  children,
  style,
  className = '',
}: {
  style?: CSSProperties;
  className?: string;
} & PropsWithChildren) => {
  return (
    <div
      style={style}
      className={className}
      data-name={'ActionTreeCastResultNodeDiv'}
    >
      {children}
    </div>
  );
};

export const ActionTreeCastResultNodeDiv = styled(_ActionTreeCastResultNodeDiv)`
  display: flex;
`;
