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
`;

const TabTitlesDiv = styled.div`
  display: flex;
  flex-wrap: wrap-reverse;
  justify-content: start;
  margin-right: 0.7em;
  padding: 0 0.7em;
  align-items: end;
  overflow: hidden;
`;

/* TODO
 * * Side-by-side for spell selector on wide screen
 */
const TitleDiv = styled.div<{
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
    margin: 0 0 0 -0.16em;

    cursor: default;
    z-index: var(--zindex-tabs-selected);

    flex: 1 1;

    &:hover {
    }
  `
      : `
    color: var(--color-tab-inactive);
    border-color: var(--color-tab-border-inactive);
    border-bottom-color: transparent;

    padding: 0.36em 0.7em 0.32em 0.7em;
    margin: 0 0 0 -0.16em;
    cursor: pointer;
    transition: var(--transition-hover-out);
    transition-property: border-color, color;

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
  opacity: 0.94;
  cursor: default;
  transform: none;
  opacity: 1;
  cursor: default;
  margin-right: 0.2em;

  &:hover {
    transform: none;
    opacity: 1;
    cursor: pointer;
  }
`;

const ContentDiv = styled.div`
  background-color: var(--bg-color-tab);
  border: 0.16em solid var(--color-tab-border-active);
  border-radius: 0.26em 0.46em;
  padding: 0.26em;
  top: -0.16em;
  position: relative;
  max-height: 50vh;
  overflow-y: scroll;
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
    <MainDiv>
      <TabTitlesDiv data-name="TabsTitles">
        {tabs.map(({ titleParts }, index) => (
          <TitleDiv
            data-name="TabTitle"
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
          </TitleDiv>
        ))}
      </TabTitlesDiv>
      <ContentDiv data-name="ActiveTabContent">
        {tabs[displayIndex].content}
      </ContentDiv>
    </MainDiv>
  );
}
