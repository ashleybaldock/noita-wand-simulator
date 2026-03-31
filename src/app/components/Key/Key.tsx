import type { PropsWithChildren } from 'react';
import styled from 'styled-components';

export const _KeyContainer = styled.div`
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
  return <_KeyContainer className={className}>{children}</_KeyContainer>;
};
export const KeyNote = styled.p``;

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

const _KeyItem = styled.li`
  display: flex;
  padding: 0.2em;
  line-height: 1.2;
  align-items: self-end;
  justify-content: start;
  column-gap: 1ch;
`;

export const KeyExample = styled.div`
  display: flex;
  align-items: center;
  min-width: 1lh;
  position: relative;
`;

const KeyDescription = styled.div`
  display: flex;
`;

export const KeyItem = ({
  description,
  children,
  className = '',
}: { description: string; className?: string } & PropsWithChildren) => {
  return (
    <_KeyItem className={className}>
      <KeyExample>{children}</KeyExample>
      <KeyDescription>{description}</KeyDescription>
    </_KeyItem>
  );
};
