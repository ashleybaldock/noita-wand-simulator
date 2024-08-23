import styled from 'styled-components';
import { useState } from 'react';

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
  display: flex;
  flex-direction: row;
  color: #eee;
  justify-content: space-between;
  background-image: url('${({ imgUrl = '/logo/logo.png' }) => imgUrl}');
  background-size: contain;
  background-repeat: no-repeat;
  height: 60px;
  image-rendering: pixelated;
  margin: 14px 16px;
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
  margin-right: 15px;
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
    </HeaderDiv>
  );
}
