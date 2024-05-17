import styled from 'styled-components';

const MainDiv = styled.div.attrs({
  className: 'MainDiv',
})`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  font-family: monospace;
  font-weight: bold;
  font-size: 12px;
`;

const GroupDiv = styled.div.attrs({
  className: 'GroupDiv',
})`
  display: flex;
  flex-direction: row;
`;

const CountParentDiv = styled.div`
  display: flex;
  flex-direction: row;
`;

const CountDiv = styled.div<{
  size: number;
}>`
  display: flex;
  flex: 1 1 auto;
  justify-content: center;
  color: white;
  background-color: black;
  height: ${({ size }) => size / 3}px;
  font-family: monospace;
  font-weight: bold;
  font-size: 12px;
  border: 1px solid #aaa;
  line-height: ${({ size }) => size / 3}px;
  font-family: var(--font-family-noita-default);
`;

const SpacerDiv = styled.div<{
  size: number;
}>`
  display: flex;
  flex: 1 1 auto;
  min-width: 5px;
  max-width: ${({ size }) => size / 4}px;
  height: ${({ size }) => size / 4}px;
`;
