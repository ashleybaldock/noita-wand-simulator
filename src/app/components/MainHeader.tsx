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
  box-sizing: border-box;
  image-rendering: pixelated;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  color: #eee;
  margin: 0;
  background-color: var(--color-base-background);
  z-index: var(--zindex-mainheader);
  position: sticky;
  inset: -20px auto auto auto;
  height: calc(var(--top-banner-height) - var(--pad-bottom));
  column-gap: 0.3ch;
  margin: 0;
  --pad-bottom: clamp(3px, 0.5vmin, 14px);
  padding: clamp(2px, 0.4vmin, 14px) clamp(2px, 0.5vmin, 14px) var(--pad-bottom)
    clamp(2px, 0.5vmin, 14px);
  inset: 0 auto auto auto;

  column-gap: max(1px, round(down, 0.3ch, 1px));
  --pad-bottom: max(1px, round(down, clamp(3px, 0.5vmin, 14px), 1px));
  --pad: max(1px, round(down, clamp(2px, 0.4vmin, 14px), 1px));
  padding: var(--pad) var(--pad) var(--pad-bottom) var(--pad);

  & > a {
    width: max(1px, round(down, clamp(160px, 30vw, 300px), 1px));
    margin: max(1px, round(down, 0.1em, 1px)) max(1px, round(down, 0.2ch, 1px))
      0 max(1px, round(down, 0.2ch, 1px));
  }
  &::after {
    content: '';
    z-index: var(--zindex-mainheader);
    box-shadow: inset 0 -5px 10px -4px #000;
    position: absolute;
    inset: 0 0 0 0;
    pointer-events: none;
  }

  @media screen and (max-width: 500px) {
    & > button {
      grid-column: config;
      grid-row: 1;
    }
    & > a {
      grid-column: logo;
      grid-row: 1;
    }

    display: grid;
    justify-items: center;
    grid-template-areas: 'config logo search';
    grid-template-columns: [config-start] 1fr[config-end searchinput-start logo-start] 100fr [logo-end searchinput-end search-start] 1fr[search-end];
  }
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

  @media screen and (max-width: 500px) {
    width: clamp(160px, 30vw, 300px);
  }
`;

export const MainHeader = () => {
  const [logoVariant] = useState(
    logoVariants[getRandomInteger(logoVariants.length)],
  );

  return (
    <HeaderDiv data-name="MainHeader" imgUrl={logoVariant}>
      <HeaderLink href="/"></HeaderLink>
      <Search />
      <ConfigButton />
    </HeaderDiv>
  );
};
