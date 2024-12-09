import type { PropsWithChildren } from 'react';
import styled from 'styled-components';

export const StyledKeyContainer = styled.div`
  margin: 0.4em 0;

  &::before {
    content: 'Key to symbols';
    margin-left: 4lh;
    font-size: 1.1em;
    line-height: 1;
  }
`;

export const KeyContainer = ({
  children,
  className = '',
}: { className?: string } & PropsWithChildren) => {
  return (
    <StyledKeyContainer className={className}>{children}</StyledKeyContainer>
  );
};

export const KeyGroup = styled.ul`
  display: flex;
  flex-direction: column;
  margin: 0.4em 0.2em;
  padding: 0.2em;
  border: 3px solid #000;
  font-size: 0.9em;
  letter-spacing: 0.005ch;

  &[title]::before {
    content: '-- ' attr(title) ' --';
    margin-left: 2lh;
    font-size: 0.9em;
  }
`;

const StyledKeyItem = styled.li`
  display: flex;
  padding: 0.2em;
  line-height: 1.2;
  align-items: self-end;
  justify-content: start;
  column-gap: 1ch;
`;

const StyledKeyExample = styled.div`
  display: flex;
  min-width: 1lh;
`;

const StyledKeyDescription = styled.div`
  display: flex;
`;

export const KeyItem = ({
  description,
  children,
  className = '',
}: { description: string; className?: string } & PropsWithChildren) => {
  return (
    <StyledKeyItem className={className}>
      <StyledKeyExample>{children}</StyledKeyExample>
      <StyledKeyDescription>{description}</StyledKeyDescription>
    </StyledKeyItem>
  );
};
