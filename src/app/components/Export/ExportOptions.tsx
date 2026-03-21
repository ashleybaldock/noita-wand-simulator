import { Button, SaveImageButton } from '../generic';
import { ExportWikiButton } from '../Export/ExportWikiButton';
import styled from 'styled-components';
import type { RefObject } from 'react';
import { useCallback, useState } from 'react';

const Container = styled.div`
  --pad: 0.2em;

  font-family: var(--font-family-noita-default);
  z-index: var(--zindex-copy-png);
  background-color: #0000;

  position: relative;
  inset: auto;

  display: grid;
  grid-column: export;
  grid-row: 1;
  grid-template-columns: 2fr 10fr;
  grid-auto-rows: 1fr;
  max-height: 1lh;
  overflow: visible;
  padding: 0.2em 0.5ch;
  margin: 0;

  &:hover {
    inset: auto;
    margin: 0;
    border: none;
  }

  align-items: start;
  justify-content: end;

  @media screen and (min-width: 600px) {
    pointer-events: none;

    transition-property: visibility, background, padding, top, border;
    transition-delay: 500ms;
    transition-timing-function: ease;
    transition-duration: 80ms;

    &:hover {
      pointer-events: auto;

      background-color: var(--color-base-background);

      transition-property: visibility, background, padding, top, border;
      transition-delay: 0ms;
      transition-timing-function: ease;
      transition-duration: 40ms;
    }
  }

  @media screen and (max-width: 600px) {
    position: fixed;
    inset: 10% 50% 10% 50%;
    top: calc(50vh - 50%);
    opacity: 0.4;
    transition-property: transform, opacity;
    transform: scale(0);
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-around;
    padding-top: 2em;
    gap: 1em;
    height: fit-content;

    &:hover {
      opacity: 1;
      transform: scale(1);
      transition-property: transform, opacity;
    }
    & ${SaveImageButton}, & ${ExportWikiButton} {
      font-size: 0.8em;
    }
  }
`;

const OpenExportOptionsButton = styled(Button)`
  grid-column: 1;
  grid-row: 1;
  padding: 0 0.5ch;
`;

const DefaultExport = styled.div`
  align-items: center;
  pointer-events: auto;
  background-color: var(--color-base-background);
  display: grid;
  grid-template-columns: auto;
  grid-template-rows: 1fr;
  grid-column: -2;
  grid-row: 1/1;
  grid-auto-rows: 1fr;
  padding: 0 0.5ch;
  column-gap: var(--pad);

  @media screen and (max-width: 600px) {
    &::before {
      position: static;
      width: 100%;
      display: block;
      padding-left: 1em;
    }
  }
`;

const RevealExports = styled.div<{ expanded: boolean }>`
  padding: var(--pad) 0.5ch var(--pad) 0.5ch;
  row-gap: var(--pad);
  column-gap: 0;

  background-color: var(--color-base-background);
  visibility: hidden;
  z-index: 1;

  max-width: 40vw;
  transition-property: visibility;
  transition-delay: 500ms;
  transition-timing-function: ease;
  transition-duration: 40ms;

  display: grid;
  grid-template-columns: 1fr;
  grid-auto-rows: 1fr;
  grid-column: 1/-1;
  grid-row: 1/-1;
  background-color: #000;

  ${Container}:hover & {
    visibility: visible;
    transition-property: visibility;
    transition-delay: 40ms;
    transition-timing-function: ease;
    transition-duration: 40ms;
  }

  @media screen and (max-width: 600px) {
    display: contents;
  }
`;

export const ExportOptions = ({
  spellsRef,
  className,
}: {
  className?: string;
  wandRef: RefObject<HTMLElement | null>;
  spellsRef: RefObject<HTMLElement | null>;
}) => {
  const [expanded, setExpanded] = useState(false);

  const handleClick = useCallback(() => setExpanded(true), []);

  return (
    <Container data-name="ExportOptions" className={className}>
      <OpenExportOptionsButton
        minimal
        dataName="OpenExportOptionsButton"
        imgOnly="always"
        onClick={() => handleClick()}
        imgAfter
        icon={'icon.hamburger.menu'}
        hotkeys={'e'}
      />
      <DefaultExport data-name="DefaultExport">
        <SaveImageButton
          name={'Wand'}
          dataName="SaveImageButton"
          targetRef={spellsRef}
          fileName={'wand'}
          enabled={true}
          hotkeys={{ hotkeys: 'p', position: 'top' }}
        />
      </DefaultExport>
      <RevealExports expanded={expanded} data-name="RevealExports">
        <SaveImageButton
          dataName="SaveImageButton"
          name={'Spells'}
          targetRef={spellsRef}
          fileName={'wandsim'}
          enabled={true}
          hotkeys={{ hotkeys: 'shift+p', position: 'bottom' }}
        />
        <ExportWikiButton />
      </RevealExports>
    </Container>
  );
};
