import styled from 'styled-components';
import { useReleaseInfo } from '../util/useVersion';

const Row = styled.div<{
  isRelease: boolean;
}>`
  display: flex;
  flex-direction: row;
  justify-content: end;
  align-self: center;
  font-size: 10px;
  font-weight: 400;
  position: fixed;
  color: #aaa;
  ${({ isRelease }) => (isRelease ? `opacity: 0;` : `opacity: 0.6;`)}
  padding: 0.2em 0.2em 0.4em 0.4em;
  z-index: var(--zindex-devinfo, 999999);
  background-color: var(--color-base-background);
  border-radius: 1em;
  font-size: 10px;
  bottom: 1px;
  right: 12px;
  padding: 0.4em 0.7em 0.3em 0.7em;

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

export const ReleaseInfo = () => {
  const { isRelease, branch, hash } = useReleaseInfo();
  return (
    <Row data-name="ReleaseInfo" isRelease={isRelease}>
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
};
