import styled from 'styled-components';
import { PropsWithChildren } from 'react';

/* rotate() makes the scrollbar be at the top */
const ParentDiv = styled.div`
  padding: 12px 8px;
  overflow-x: auto;
  transform: rotateX(180deg);
`;

const ChildDiv = styled.div`
  transform: rotateX(180deg);
  width: fit-content;
`;

type Props = {};

export function ScrollWrapper(props: PropsWithChildren<Props>) {
  return (
    <ParentDiv>
      <ChildDiv>{props.children}</ChildDiv>
    </ParentDiv>
  );
}
