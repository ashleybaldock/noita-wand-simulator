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
  background-image: url('${({ imgUrl = '/logo/logo.png' }) => imgUrl}');
  background-size: contain;
  background-repeat: no-repeat;
  background-color: var(--color-base-background);
  background-origin: content-box;
  z-index: 100;
  position: sticky;
  top: -20px;
  height: 36px;

  @media screen and (max-width: 500px) {
    margin: 6px 6px;
    background-position: center;
  }
`;

const HeaderLink = styled.a`
  text-decoration: none;
  width: max(30vw, 300px);
  height: 60px;
  @media screen and (max-width: 500px) {
    width: 100%;
  }
`;

const SpacerDiv = styled.div`
  display: flex;
  align-self: center;
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
      <SpacerDiv />
      <ExtraDiv>{children}</ExtraDiv>
      <ConfigButton />
    </HeaderDiv>
  );
}
