import styled from 'styled-components/macro';
import { useReleaseInfo } from '../util/useVersion';

const Row = styled.div<{
  isRelease: boolean;
}>`
  display: flex;
  flex-direction: row;
  justify-content: end;
  align-self: center;
  font-size: small;
  font-weight: 400;
  margin: 3px 1em;
  position: absolute;
  height: 40px;
  padding-left: 20px;
  top: 0;
  right: 0;
  color: #aaa;
  ${({ isRelease }) => (isRelease ? `opacity: 0;` : `opacity: 0.6;`)}

  scroll-snap-align: start;

  &:hover {
    opacity: 1;
  }
`;

const Dev = styled.span`
  color: #da06a5;
`;

const Link = styled.a`
  &,
  &:visited,
  &:hover,
  &:active {
    color: #eee;
    text-decoration: none;
  }
  &:hover {
    text-decoration: underline;
  }
`;

export function ReleaseInfo() {
  const { isRelease, branch, hash } = useReleaseInfo();
  return (
    <Row isRelease={isRelease}>
      {isRelease ? `Release` : <Dev>{`Development`}</Dev>}
      {'/'}
      <Link
        href={`https://github.com/ashleybaldock/noita-wand-simulator/tree/${branch}`}
      >{`${branch}`}</Link>
      {'/'}
      <Link
        href={`https://github.com/ashleybaldock/noita-wand-simulator/commit/${hash}`}
      >{`${hash}`}</Link>
    </Row>
  );
}
