import React, { useEffect, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import styled from 'styled-components';
import type { SpellType } from '../../calc/spellTypes';
import { HotkeyHint } from '../Tooltips/HotkeyHint';
import type { ActionId } from '../../calc/actionId';

const MainDiv = styled.div`
  font-size: 14px;
  padding: 0.3em;

  margin-top: -8px;
  padding: calc(var(--ou) * 1);
  margin-top: var(--top-offset);
  inset: var(--top-banner-height) auto auto auto;
  position: sticky;
`;

const TabTitlesDiv = styled.div`
  --bdw-inline: calc(var(--ou) * 1);
  --bdw-above: calc(var(--ou) * 0.7);
  --bsize-spell: 34px;
  display: flex;
  flex-wrap: nowrap;
  justify-content: start;
  margin-right: 0.7em;
  padding: 0 0.7em;
  align-items: start;
  pointer-events: none;
  margin: 0;
  padding: 0 1ch 0 1ch;
  justify-content: stretch;
  overflow: visible;

  &::before {
    border-top-right-radius: calc(var(--border-radius) * 0.5);
  }

  &::after {
    border-top-left-radius: calc(var(--border-radius) * 0.5);
  }
`;

/* TODO
 * * Side-by-side for spell selector on wide screen
 */
const TabButton = styled.button<{
  selected: boolean;
}>`
  cursor: pointer;
  pointer-events: auto;

  position: relative;
  overflow: clip;
  z-index: -1;
  user-select: none;
  background-color: var(--bg-color-tab);
  font-size: 14px;
  font-family: var(--font-family-noita-default);
  box-sizing: content-box;
  color: var(--color-tab-inactive);

  max-width: calc(100% / 8 * 3);
  width: clamp(2.4em, var(--pw), 3em);
  min-width: unset;
  min-height: 3em;

  flex: 0 0 100%;

  display: grid;
  grid-template: 1fr / auto auto auto;
  justify-content: end;
  justify-items: center;
  align-content: stretch;
  align-items: stretch;

  transition: var(--transition-hover-out);
  transition-property: border-color, color;

  @media screen and (max-width: 800px) {
    height: 3em;
  }

  &:hover {
    transition: var(--transition-hover-in);
    transition-property: border-color, color;
    border-color: var(--tabs-hover-color);
    color: var(--color-tab-border-inactive-hover);
  }

  ${({ selected }) =>
    selected
      ? `
    cursor: default;
    pointer-events: none;
    z-index: 2;

    color: var(--color-tab-active);

    border-color: var(--color-tab-border-active);


    box-shadow: calc(var(--ou) * -1.5) calc(var(--ou) * 0.5) 0 calc(var(--ou) * -0.5) var(--color-tab-border-active),calc(var(--ou) * 1.5) calc(var(--ou) * 0.5) 0 calc(var(--ou) * -0.5) var(--color-tab-border-active);

    flex: 0 0 3em;
    padding: 0;
    height: 3em;
    width: 3em;
    display: grid;
    place-content: center;
    margin: 0;
    place-items: center;
  `
      : ``}

  padding: 0;
  margin: 0;
  position: relative;
  border-width: 0;

  &:only-of-type {
    display: none !important;
  }
`;

const ActiveTabContent = styled.div`
  --bg-color: #3e1a1a;
  --bg-texture: url('/data/spelltypes/svg/item_bg_projectile.svg');
  --bsize-gap: 4px;
  --spellandgap: calc(var(--bsize-spell) + var(--bsize-gap));
  --bsize-padh: 6px;

  position: static;
  box-sizing: content-box;
  height: calc(
    round(down, min(30vh, var(--spellandgap) * 8), var(--spellandgap)) +
      var(--bsize-padh)
  );
  overscroll-behavior: none;
  scroll-snap-type: y mandatory;
  scroll-padding: 10px;
  overflow: scroll;
  scroll-margin-top: var(--top-banner-height);

  width: auto;
  height: calc(
    round(
        up,
        min(40vh, ((var(--spellandgap) * 4) - var(--bsize-gap))),
        var(--spellandgap)
      ) +
      calc(var(--bsize-padh) * 2)
  );
  container-type: size;
  contain-intrinsic-size: 100%;

  gap: var(--bsize-gap);
  border: calc(var(--ou) * 0.7) solid var(--color-tab-border-active);
  border-radius: 0.26rem 0.46rem;
  background-image:
    radial-gradient(circle at 50% 50%, #500 0%, #0008 100%), var(--bg-texture);
  background-attachment: fixed, local;
  background-size:
    90% 100%,
    6px;
  background-position: center, center;

  scrollbar-width: thin;
  scrollbar-color: var(--color-tab-border-active) #0000;
  border-radius: var(--border-radius);
  box-shadow:
    inset 0 3px 3px 3px #000,
    inset 0 0 2px 4px var(--bg-color);
  border: var(--bdw) solid var(--color-tab-border-active);
  margin-bottom: calc(var(--ou) * -1);
  height: round(
    down,
    clamp(var(--spellandgap) * 2, 25vh, var(--spellandgap) * 6),
    var(--spellandgap)
  );
  grid-template-columns: repeat(
    auto-fit,
    minmax(max(1px, round(down, var(--bsize-spell), 1px)), 1fr)
  );
  container-type: unset;
  overscroll-behavior: contain;
  display: grid;
  grid-template-rows: 1fr;
  grid-auto-rows: 1fr;

  & > div,
  & > div:nth-child(1) {
    overscroll-behavior: contain;
  }
  box-shadow:
    inset -5px 0 0px var(--bdw) #000a,
    inset 0 3px 3px 3px #000,
    inset 0 0 2px 4px var(--bg-color);
  --bdw: max(1px, round(down, var(--ou), 1px));
`;

const HiddenContentDiv = styled.div`
  visibility: hidden;
  position: absolute;
  overflow: hidden;
  width: 1px;
  height: 1px;
  top: 0;
  left: -200vw;
  z-index: -1000;
`;

export type Tab = {
  title: string;
  key: string;
  type?: SpellType;
  bgSrc?: string;
  egSrc?: ActionId;
  style?: React.CSSProperties;
  content: React.ReactElement;
  buttonContent: React.ReactElement;
};

export const Tabs = ({
  tabs,
}: React.PropsWithChildren<{
  tabs: Tab[];
}>) => {
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  const displayIndex = Math.min(tabs.length - 1, selectedTabIndex);

  useEffect(() => {
    if (displayIndex !== selectedTabIndex) {
      setSelectedTabIndex(displayIndex);
    }
  }, [displayIndex, setSelectedTabIndex, selectedTabIndex]);

  useHotkeys(
    '2,3,4,5,6,7,8,9',
    (_, kEv) => {
      const tabIdx = Number.parseInt(kEv.keys?.join('') ?? '', 10) - 1;
      if (!Number.isNaN(tabIdx) && tabIdx > 0 && tabIdx <= tabs.length) {
        setSelectedTabIndex(tabIdx - 1);
      }
    },
    [tabs, setSelectedTabIndex],
  );

  if (tabs.length === 0) {
    return null;
  }

  return (
    <MainDiv data-name="Tabs">
      <ActiveTabContent data-name="ActiveTabContent">
        {tabs[displayIndex].content}
      </ActiveTabContent>
      <TabTitlesDiv data-name="TabTitles">
        {tabs.map(({ key, content, buttonContent }, index) => (
          <TabButton
            data-name={`Tab${selectedTabIndex === index ? ':Selected' : ''}`}
            {...(selectedTabIndex === index ? { 'data-selected': '' } : {})}
            selected={selectedTabIndex === index}
            onClick={() => setSelectedTabIndex(index)}
            key={key}
          >
            <HiddenContentDiv>{content}</HiddenContentDiv>
            {buttonContent}
            <HotkeyHint hotkeys={`${index + 2}`} position={'ne-corner'} />
          </TabButton>
        ))}
      </TabTitlesDiv>
    </MainDiv>
  );
};
