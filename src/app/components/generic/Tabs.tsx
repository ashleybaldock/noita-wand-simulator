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
  padding: calc(var(--ou) * 1);
  margin-top: var(--top-offset);
  inset: var(--top-banner-height) auto auto auto;
  position: sticky;
`;

const TabTitlesDiv = styled.div`
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

  border-color: var(--color-tab-border-inactive);
  border-top: calc(var(--ou) * 1) solid var(--bg-color-tab);
  border-bottom: var(--ou) solid var(--color-tab-border-inactive);
  border-radius: 0 0 0.5em 0.5em;
  border-style: solid;
  /* border-width: 0 0 var(--ou) 0; */
  border-width: calc(var(--ou) * 0.5) 0 calc(var(--ou) * 0.5) 0;
  border-block-end-style: hidden;

  box-shadow:
    calc(var(--ou) * -0.25) 0 0 calc(var(--ou) * 0)
      var(--color-tab-border-inactive),
    calc(var(--ou) * 0.25) 0 0 calc(var(--ou) * 0)
      var(--color-tab-border-inactive);

  max-width: calc(100% / 8 * 3);
  width: clamp(2.4em, var(--pw), 3em);
  min-width: unset;
  min-height: 3em;

  flex: 0 0 100%;
  margin: calc(var(--ou) * -1) 0 0 0;
  padding: 0.36em 0.7em 0.32em 0.7em;

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
    z-index: 0;

    color: var(--color-tab-active);

    border-color: var(--color-tab-border-active);


        box-shadow: calc(var(--ou) * -1.5) calc(var(--ou) * 0.5) 0 calc(var(--ou) * -0.5) var(--color-tab-border-active),calc(var(--ou) * 1.5) calc(var(--ou) * 0.5) 0 calc(var(--ou) * -0.5) var(--color-tab-border-active);
  flex: 0 0 3em;
  padding: 0;
  height: 3em;
  width: 3em;
  display: grid;
  place-content: center;
  margin: calc(var(--ou) * -1) 0 0 0;
  place-items: center;
  `
      : ``}
`;

const TabsWandAction = styled(WandAction)`
  --transition-props: opacity;
  --sizes-spell: 2em;

  transform: none;
  opacity: 1;
  cursor: inherit;

  border: 0;
  background-size: 50%, 200%;
  background-origin: content-box, border-box;
  height: auto;
  width: auto;
  aspect-ratio: 1;
  background-position:
    50% 20%,
    105% 100%;
  margin: 0;
  background-clip: border-box;
  background-repeat: no-repeat;
  --v: 0.3em;
  padding: 0 var(--v) var(--v) 0;
  min-width: calc(var(--v) * 0.25);
  min-height: calc(var(--v) * 0.25);
  min-height: 2.4em;
  border-image-width: 4px;
  background-image: var(--data-spelltype-sprite);
  background-repeat: space;
  background-size: 12%;

  border-image-outset: 2px;
  padding: 0px;
  border-image-source: var(--data-spelltype-sprite);
  background-size: 10%;
  background-repeat: round;

  image-rendering: pixelated;
  transform: rotate(0deg) scale(1) translate(1px);
  border-image: var(--data-spelltype-sprite);
  border-image-source: var(--data-spelltype-sprite);
  aspect-ratio: 1;
  padding: 0;
  margin: 0;
  background-size: 60%, contain;
  border-image-slice: 3 3 3 3;
  border-image-outset: 4px;
  border-image-width: 6px;
  background-origin: content-box;
  background-position: center;
  width: auto;
  height: 100%;

  background-size: 67%, 100%;
  background-clip: padding-box, border-box, border-box;
  background-repeat: no-repeat, space, space;
  background-origin: content-box, border-box, border-box;
  --v: 0.3em;
  border: var(--v) solid #0000;
  border-width: var(--v) 0 0 var(--v);
  padding: 0 var(--v) var(--v) 0;
  margin: 0;
  min-width: calc(var(--v) * 0.25);
  min-height: calc(var(--v) * 0.25);
  background-position:
    center,
    bottom -11% right -11%;

  &:hover {
    transform: none;
    opacity: 1;
  }
`;

const ActiveTabContent = styled.div`
  position: relative;
  box-sizing: content-box;
  height: calc(
    round(down, min(30vh, var(--spellandgap) * 6), var(--spellandgap)) +
      var(--bsize-padh)
  );
  --bg-color: #3e1a1a;
  --bg-texture: url('/data/spelltypes/svg/item_bg_projectile.svg');
  --bsize-gap: 4px;
  --spellandgap: calc(var(--bsize-spell) + var(--bsize-gap));
  --bsize-padh: 6px;

  gap: var(--bsize-gap);
  height: calc(
    round(
        up,
        min(40vh, ((var(--spellandgap) * 4) - var(--bsize-gap))),
        var(--spellandgap)
      ) +
      calc(var(--bsize-padh) * 2)
  );
  width: auto;
  border: calc(var(--ou) * 0.7) solid var(--color-tab-border-active);
  border-radius: 0.26rem 0.46rem;
  background-image:
    radial-gradient(circle at 50% 50%, #500 0%, #0008 100%), var(--bg-texture);
  background-attachment: fixed, local;
  background-size:
    90% 100%,
    6px;
  background-position: center, center;
  box-shadow:
    inset 0 3px 3px 3px #000,
    inset 0 0 2px 4px var(--bg-color),
    1px 2px 1px 0 #000;

  overscroll-behavior: none;
  scroll-snap-type: y mandatory;
  scroll-padding: 10px;
  overflow: scroll;
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

  useHotkeys('2,3,4,5,6,7,8,9', (_, kEv) => {
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
      <ActiveTabContent data-name="ActiveTabContent">
        {tabs[displayIndex].content}
      </ActiveTabContent>
      <TabTitlesDiv data-name="TabTitles">
        {tabs.map(({ titleParts }, index) => (
          <TabButton
            data-name={`Tab${selectedTabIndex === index ? ':Selected' : ''}`}
            {...(selectedTabIndex === index ? { 'data-selected': '' } : {})}
            selected={selectedTabIndex === index}
            onClick={() => setSelectedTabIndex(index)}
            key={titleParts.reduce((acc, { text }) => `${acc}-${text}`, 'tab-')}
          >
            <HiddenContentDiv>{tabs[index].content}</HiddenContentDiv>
            {titleParts.map(({ type, egSrc }) => (
              <TabsWandAction
                key={type}
                tooltip={false}
                spellType={type}
                spellId={egSrc}
                keyHint={`Shortcut: ${index}`}
              />
            ))}
            <HotkeyHint hotkeys={`${index + 2}`} position={'ne-corner'} />
          </TabButton>
        ))}
      </TabTitlesDiv>
    </MainDiv>
  );
}
