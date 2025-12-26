import styled from 'styled-components';
import { useState } from 'react';
import { ConfigButton } from './buttons';
import { Search } from './Search';

const logoVariants = [
  '/logo/logo-blue.png',
  '/logo/logo-green.png',
  '/logo/logo-orange.png',
  '/logo/logo-purple.png',
  '/logo/logo-red.png',
  '/logo/logo-teal.png',
  '/logo/logo-yellow.png',
];

const getRandomInteger = (max: number) => Math.floor(Math.random() * max);

const HeaderDiv = styled.div<{
  imgUrl?: string;
}>`
  image-rendering: pixelated;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  color: #eee;
  margin: 0;
  padding: 0.6em 0.8em 0.2em 0.8em;
  background-color: var(--color-base-background);
  z-index: 100;
  position: sticky;
  top: -20px;
  height: 36px;
  padding: 0.3em 0.5ch 0.3em 0.5ch;
  inset: 0 auto auto auto;
  column-gap: 0.3ch;
  margin: 0;

  @media screen and (max-width: 500px) {
    padding: 0 0 0.2em 0.2ch;
  }
`;

const Wrapper = styled.div`
  display: flex;
`;
const HeaderLink = styled.a<{
  imgUrl?: string;
}>`
  display: flex;
  height: auto;
  background-position: left bottom;
  background-image: url('${({ imgUrl = '/logo/logo.png' }) => imgUrl}');
  background-size: contain;
  background-repeat: no-repeat;
  background-color: var(--color-base-background);
  background-origin: content-box;
  background-position: left bottom;

  text-decoration: none;
  width: clamp(160px, 30vw, 300px);
  height: auto;
  margin: 0.1em 0.2ch 0 0.2ch;
  flex: 1 0 auto;
  display: flex;
`;

const ExtraDiv = styled.div`
  display: flex;
  align-self: end;

  & > button {
    border-radius: 0 0 0.2em 15.1em / 0 0 0 64.4em;
    border-right-style: hidden;
    padding-top: 0.4em;
    padding-bottom: 0.3em;
    margin-left: -0.5em;
  }
`;

export function MainHeader({ children }: React.PropsWithChildren) {
  const [logoVariant, setLogoVariant] = useState(
    logoVariants[getRandomInteger(logoVariants.length)],
  );

  return (
    <HeaderDiv data-name="MainHeader" imgUrl={logoVariant}>
      <HeaderLink href="/"></HeaderLink>
      {/* <ExtraDiv>{children}</ExtraDiv> */}
      <Wrapper data-name="Wrapper">
        <Search />
        <ConfigButton />
      </Wrapper>
    </HeaderDiv>
  );
}
