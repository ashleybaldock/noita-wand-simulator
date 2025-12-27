import React, { useEffect, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import styled from 'styled-components';
import type { SpellType } from '../../calc/spellTypes';
import { WandAction } from '../Spells/WandAction';
import { HotkeyHint } from '../Tooltips/HotkeyHint';
import type { ActionId } from '../../calc/actionId';

const MainDiv = styled.div`
  font-size: 14px;
  padding: 0.3em;

  margin-top: -8px;
`;

const TabTitlesDiv = styled.div`
  --bsize-spell: 34px;
  display: flex;
  flex-wrap: wrap-reverse;
  justify-content: start;
  margin-right: 0.7em;
  padding: 0 0.7em;
  align-items: start;
  overflow: hidden;
`;

/* TODO
 * * Side-by-side for spell selector on wide screen
 */
const Tab = styled.div<{
  selected: boolean;
}>`
  position: relative;
  font-size: 14px;

  display: flex;
  flex: 1 1;
  justify-content: center;
  user-select: none;
  background-color: var(--bg-color-tab);
  align-items: center;
  font-family: var(--font-family-noita-default);
  max-width: 8em;
  min-width: fit-content;

  border-radius: 0.5em 0.5em 0 0;
  border-style: solid;
  border-block-end-style: hidden;
  border-bottom-style: hidden;
  border-width: 0.16em;
  border-bottom-width: 0;

  @media screen and (max-width: 800px) {
    height: 3em;
  }

  ${({ selected }) =>
    selected
      ? `
    color: var(--color-tab-active);
    border-color: var(--color-tab-border-active);
    border-bottom-color: var(--bg-color-tab);

    padding: 0.5em 0.7em 0.5em 0.7em;

    cursor: default;
    z-index: var(--zindex-tabs-selected);

    flex: 1 1;

    &:hover {
    }

    border-radius: 0 0 0.5em 0.5em;
    margin: -0.16em 0 0 0;
    border-top: 0 hidden transparent;
  `
      : `
    color: var(--color-tab-inactive);
    border-color: var(--color-tab-border-inactive);
    border-bottom-color: transparent;

    padding: 0.36em 0.7em 0.32em 0.7em;
    cursor: pointer;
    transition: var(--transition-hover-out);
    transition-property: border-color, color;

    margin: -0.16em 0 0 0;
    border-top: 0.16em solid var(--bg-color-tab);
    border-radius: 0 0 0.5em 0.5em;

    &:hover {
      transition: var(--transition-hover-in);
      transition-property: border-color, color;
      border-color: var(--tabs-hover-color);
      color: var(--color-tab-border-inactive-hover);
    }
  `}
`;

const TabsWandAction = styled(WandAction)`
  --transition-props: opacity;
  --sizes-spell: 2em;

  transform: none;
  opacity: 1;
  cursor: inherit;

  &:hover {
    transform: none;
    opacity: 1;
  }
`;

const ContentDiv = styled.div`
  background-color: var(--bg-color-tab);
  border: 0.16em solid var(--color-tab-border-active);
  border-radius: 0.26em 0.46em;
  position: relative;
  background-size: 4px;
  gap: var(--bsize-gap);
  height: calc(
    round(down, min(30vh, var(--spellandgap) * 6), var(--spellandgap)) +
      var(--bsize-padh)
  );
  --bsize-gap: 4px;
  box-sizing: content-box;
  --spellandgap: calc(var(--bsize-spell) + var(--bsize-gap));
  --bsize-padh: 6px;
  overflow-y: scroll;
  overscroll-behavior: none;

  gap: var(--bsize-gap);
  height: calc(
    round(
        up,
        min(40vh, ((var(--spellandgap) * 4) - var(--bsize-gap))),
        var(--spellandgap)
      ) + calc(var(--bsize-padh) * 2)
  );
  --bsize-gap: 4px;
  --spellandgap: calc(var(--bsize-spell) + var(--bsize-gap));
  --bsize-padh: 6px;
  overflow-y: scroll;
  width: auto;
  border: 0.16rem solid var(--color-tab-border-active);
  border-radius: 0.26rem 0.46rem;
  --bg-color: #3e1a1a;
  --bg-texture: url('/data/spelltypes/svg/item_bg_projectile.svg');
  background-image: radial-gradient(circle at 50% 50%, #500 0%, #0008 100%),
    var(--bg-texture);
  box-shadow: inset 0 3px 3px 3px #000, inset 0 0 2px 4px var(--bg-color);
  background-attachment: fixed, local;
  background-size: 90% 100%, 6px;
  background-position: center, center;
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

type TabTitlePart = {
  text: string;
  type?: SpellType;
  bgSrc?: string;
  egSrc?: ActionId;
  style?: React.CSSProperties;
};

export type Tab = {
  titleParts: TabTitlePart[];
  content: React.ReactElement;
};

export function Tabs({
  tabs,
}: React.PropsWithChildren<{
  tabs: Tab[];
}>) {
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  const displayIndex = Math.min(tabs.length - 1, selectedTabIndex);

  useEffect(() => {
    if (displayIndex !== selectedTabIndex) {
      setSelectedTabIndex(displayIndex);
    }
  }, [displayIndex, selectedTabIndex]);

  useHotkeys('2,3,4,5,6,7,8', (_, kEv) => {
    const tabIdx = Number.parseInt(kEv.keys?.join('') ?? '', 10) - 1;
    if (!Number.isNaN(tabIdx) && tabIdx > 0 && tabIdx <= tabs.length) {
      setSelectedTabIndex(tabIdx - 1);
    }
  });

  if (tabs.length === 0) {
    return null;
  }

  return (
    <MainDiv data-name="Tabs">
      <ContentDiv data-name="ActiveTabContent">
        {tabs[displayIndex].content}
      </ContentDiv>
      <TabTitlesDiv data-name="TabTitles">
        {tabs.map(({ titleParts }, index) => (
          <Tab
            data-name={`Tab${selectedTabIndex === index ? ':Selected' : ''}`}
            selected={selectedTabIndex === index}
            onClick={() => setSelectedTabIndex(index)}
            key={titleParts.reduce((acc, { text }) => `${acc}-${text}`, 'tab-')}
          >
            <HiddenContentDiv>{tabs[index].content}</HiddenContentDiv>
            {titleParts.map(({ text, type, bgSrc, egSrc }) => (
              <TabsWandAction
                key={type}
                tooltip={false}
                spellType={type}
                spellId={egSrc}
                keyHint={`Shortcut: ${index}`}
              />
            ))}
            <HotkeyHint hotkeys={`${index + 2}`} position={'ne-corner'} />
          </Tab>
        ))}
      </TabTitlesDiv>
    </MainDiv>
  );
}
