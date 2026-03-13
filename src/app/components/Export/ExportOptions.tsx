import { Button, SaveImageButton } from '../generic';
import { ExportWikiButton } from '../Export/ExportWikiButton';
import styled from 'styled-components';
import type { RefObject } from 'react';
import { useCallback, useState } from 'react';

const Container = styled.div`
  font-family: var(--font-family-noita-default);
  z-index: var(--zindex-copy-png);
  padding: 0.2em 1ch 0.2em 1ch;
  background-color: #0000;

  position: relative;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto auto;
  grid-row: 1;
  grid-column: export;
  inset: auto;
  max-height: 1lh;
  overflow: visible;
  padding: 0.2em 0.5ch;
  margin: 0;

  &:hover {
    inset: auto;
    margin: 0;
    border: none;
  }

  @media screen and (min-width: 600px) {
    pointer-events: none;

    display: flex;
    flex-direction: column;
    justify-content: end;
    align-items: end;

    transition-property: visibility, background, padding, top, border;
    transition-delay: 500ms;
    transition-timing-function: ease;
    transition-duration: 80ms;

    &:hover {
      pointer-events: auto;

      background-color: var(--color-base-background);

      padding: 1em 0.2em 1em 0.6em;
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

const OpenExportOptionsButton = styled(Button)``;

const RevealExports = styled.div<{ expanded: boolean }>`
  padding: 0.5em 1ch 0.5em 1ch;

  background-color: var(--color-base-background);
  visibility: hidden;
  column-gap: 0.3em;
  row-gap: 0.5em;
  max-width: 40vw;
  transition-property: visibility;
  transition-delay: 500ms;
  transition-timing-function: ease;
  transition-duration: 40ms;

  position: absolute;
  inset: 0 auto auto 0;
  display: grid;
  grid-template-columns: 1fr;
  grid-auto-rows: 1fr;
  grid-column: 1;
  grid-row: auto;

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

const DefaultExport = styled.div`
  align-items: center;
  pointer-events: auto;
  background-color: var(--color-base-background);
  position: absolute;
  inset: 0 auto auto 0;
  display: grid;
  grid-template-columns: auto 1fr auto;
  grid-template-rows: 1fr;
  grid-column: 1 / span 2;
  grid-row: 1;

  &::before {
    content: 'Export as...';
    letter-spacing: 0.06em;
    font-size: 0.8em;
    margin-right: 0.2em;
    pointer-events: none;
    top: 0.9em;
    left: 1em;
    transition-property: visibility;
    transition-delay: 500ms;
    transition-duration: 40ms;
    transition-timing-function: ease;
    position: relative;
    inset: auto;
    visibility: hidden;
    white-space: nowrap;
  }

  ${Container}:hover &::before {
    visibility: visible;
    transition-property: visibility;
    transition-delay: 0ms;
    transition-duration: 40ms;
    transition-timing-function: ease;
  }

  @media screen and (max-width: 600px) {
    &::before {
      position: static;
      width: 100%;
      display: block;
      padding-left: 1em;
    }
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
      <DefaultExport data-name="DefaultExport">
        <SaveImageButton
          name={'Wand'}
          dataName="SaveImageButton"
          targetRef={spellsRef}
          fileName={'wand'}
          enabled={true}
          hotkeys={{ hotkeys: 'p', position: 'top' }}
        />
        <OpenExportOptionsButton
          minimal
          dataName="OpenExportOptionsButton"
          imgOnly="always"
          onClick={() => handleClick()}
          imgAfter
          icon={'icon.hamburger.menu'}
          hotkeys={'e'}
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
