import styled from 'styled-components';
import type { PropsWithChildren } from 'react';

/* rotate() makes the scrollbar be at the top */
const ParentDiv = styled.div`
  padding: 12px 8px;
  margin: 0 0.6em;
  overflow-x: auto;
  transform: rotateX(180deg);
  overscroll-behavior-x: none;
`;

const ChildDiv = styled.div`
  transform: rotateX(180deg);
  width: fit-content;
  margin: 0 auto;
  display: flex;
  padding: 0 1em 0 1em;
`;

export const ScrollWrapper = (props: PropsWithChildren) => {
  return (
    <ParentDiv>
      <ChildDiv>{props.children}</ChildDiv>
    </ParentDiv>
  );
};
