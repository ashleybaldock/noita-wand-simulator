import styled, { type DataAttributes } from 'styled-components';
import type { CSSProperties, PropsWithChildren } from 'react';

const SpellShortcuts = styled.div.attrs<DataAttributes>({
  'data-name': 'SpellShortcuts',
})`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-self: center;
  width: 100%;
`;

const StyledSpellHotbar = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-self: center;
  background-color: black;
`;

export const SpellHotbar = ({
  children,
  style,
  className = '',
}: {
  style?: CSSProperties;
  className?: string;
} & PropsWithChildren) => {
  return (
    <StyledSpellHotbar
      style={style}
      className={className}
      data-name={'SpellHotbar'}
    >
      {children}
    </StyledSpellHotbar>
  );
};
