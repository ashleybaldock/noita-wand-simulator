import React, { useEffect, useState } from 'react';
import styled from 'styled-components/macro';
import { SpellType } from '../../calc/spellTypes';
import { SpellTypeBorder } from '../Spells/SpellTypeBorder';
import { WandAction } from '../wandAction/WandAction';

const MainDiv = styled.div`
  font-size: 14px;
  padding: 0.3em;
`;

const TabTitlesDiv = styled.div`
  display: flex;
  flex-direction: row-reverse;
  flex-wrap: wrap-reverse;
  justify-content: start;
  margin-right: 0.7em;
  padding: 0 0.7em;
`;

/* TODO
 * Use spell icons instead of tab text below 720w
 * Switch to two rows for wand spells + wand stats below 900w
 * * Side-by-side for spell selector on wide screen
 */
const TitleDiv = styled.div<{
  selected: boolean;
}>`
  font-size: 14px;

  display: flex;
  flex: 1 1;
  justify-content: center;
  user-select: none;
  background-color: var(--bg-color-tab);
  align-items: center;
  font-family: var(--font-family-noita-default);
  border-radius: 0.5em 0.5em 0 0;
  max-width: 8em;
  min-width: fit-content;
  border-block-end-style: hidden;

  padding: 0.36em 0.7em 0.22em 0.7em;
  margin: 0.16em 0 0 -0.16em;

  @media screen and (max-width: 900px) {
    height: 3em;
  }

  @media screen and (max-width: 720px) {
    font-size: 14px;
  }

  ${({ selected }) =>
    selected
      ? `
    border: 0.16em solid var(--color-tab-border-active);
    border-bottom: 0em none;
    color: var(--color-tab-active);
    padding: 0.56em 0.7em 0.12em 0.7em;
    margin: 0 0 -0.16em -0.16em;
    cursor: default;
    z-index: var(--zindex-tabs-selected);

    flex: 10 1;
    border-bottom: 0;
    margin: 0 0 0 -0.16em;
    padding: 0.2em 0.7em 0.22em 0.7em;

    &:hover {
    }
  `
      : `
    border: 0.16em solid var(--color-tab-border-inactive);
    border-bottom: 0em none;
    color: var(--color-tab-inactive);
    padding: 0.56em 0.7em 0.12em 0.7em;
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

const TitleText = styled(SpellTypeBorder)`
  display: block;

  width: 100%;
  border-image-slice: 1 2 1 2;
  border-image-outset: 0em;
  border-image-width: 2.4em 0em 0.3em 0em;
  padding: 0.36em 1.2em 0.32em 0.7em;
  border-radius: 0em;
  text-overflow: clip;
  text-align: center;
  border-image-width: 0;
  font-size: 12px;

  @media screen and (max-width: 900px) {
    display: none;
  }

  &::first-letter {
    font-size: 34px;
    color: white;
    border-image-source: url('/data/spelltypes/item_bg_utility.png');
    background-size: cover;
    image-rendering: pixelated;
    border-image-width: 0.54em;
    border-image-slice: 2 2 2 2;
    border-image-outset: 0.2em;
    border-image-width: 0.2em 0.2em 0.2em 0.2em;
  }
  &::after {
    content: '/';
    content: unset;
  }
  &:last-child::after {
    content: none;
  }
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
  border-radius: 0.16em 0.48px;
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
  imgSrc?: string;
  style?: React.CSSProperties;
};

export type Tab = {
  titleParts: TabTitlePart[];
  content: React.ReactElement;
};

type Props = {
  tabs: Tab[];
};

export function Tabs(props: React.PropsWithChildren<Props>) {
  const { tabs } = props;

  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  const displayIndex = Math.min(tabs.length - 1, selectedTabIndex);

  useEffect(() => {
    if (displayIndex !== selectedTabIndex) {
      setSelectedTabIndex(displayIndex);
    }
  }, [displayIndex, selectedTabIndex]);

  if (tabs.length === 0) {
    return null;
  }

  return (
    <MainDiv>
      <TabTitlesDiv>
        {tabs.map(({ titleParts }, index) => (
          <TitleDiv
            selected={selectedTabIndex === index}
            onClick={() => setSelectedTabIndex(index)}
            key={titleParts.reduce((acc, { text }) => `${acc}-${text}`, 'tab-')}
          >
            <HiddenContentDiv>{tabs[index].content}</HiddenContentDiv>
            {titleParts.map(({ text, type, imgSrc }) => (
              <TitleText key={`titleText-${text}`} spellType={type}>
                {text}
              </TitleText>
            ))}
          </TitleDiv>
        ))}
      </TabTitlesDiv>
      <ContentDiv>{tabs[displayIndex].content}</ContentDiv>
    </MainDiv>
  );
}
