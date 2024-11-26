import { Button, SaveImageButton } from '../generic';
import { ExportWikiButton } from '../Export/ExportWikiButton';
import styled from 'styled-components';
import type { RefObject } from 'react';
import { useCallback, useState } from 'react';

const Container = styled.div`
  font-family: var(--font-family-noita-default);
  z-index: var(--zindex-copy-png);
  padding: 0.2em 0.2em 0.2em 0.4em;
  border-radius: 1em / 8em;
  border: 1px solid #0000;
  background-color: #000f;

  @media screen and (min-width: 600px) {
    pointer-events: none;

    position: absolute;
    right: -0.8em;
    display: flex;
    flex-direction: column;
    justify-content: end;
    align-items: end;

    background-color: #0000;
    top: calc(100% - 1.4em);
    transition-property: visibility, background, padding, top, border;
    transition-delay: 500ms;
    transition-timing-function: ease;
    transition-duration: 80ms;
    &:hover {
      pointer-events: auto;

      background-color: #000d;

      padding: 1em 0.2em 1em 0.6em;
      top: calc(100% - 2.2em);
      border: 1px solid #c98930;
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
    & ${SaveImageButton},& ${ExportWikiButton} {
      font-size: 0.8em;
    }
  }
`;

const RevealExportsA = styled.div<{ expanded: boolean }>``;

const OpenExportOptionsButton = styled(Button)``;

const RevealExports = styled.div<{ $expanded: boolean }>`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  visibility: hidden;
  column-gap: 0.3em;
  row-gap: 0.5em;
  max-width: 40vw;
  transition-property: visibility;
  transition-delay: 500ms;
  transition-timing-function: ease;
  transition-duration: 40ms;

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
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  pointer-events: auto;

  &::before {
    content: 'Export as...';
    letter-spacing: 0.06em;
    font-size: 0.8em;
    margin-right: 0.2em;
    pointer-events: none;
    position: absolute;
    top: 0.9em;
    left: 1em;
    visibility: hidden;
    transition-property: visibility;
    transition-delay: 500ms;
    transition-duration: 40ms;
    transition-timing-function: ease;
  }
  &::after {
    content: '...';
    margin-left: 0.2em;
  }

  ${Container}:hover &::before {
    visibility: visible;
    transition-property: visibility;
    transition-delay: 0ms;
    transition-duration: 40ms;
    transition-timing-function: ease;
  }

  @media screen and (max-width: 600px) {
    &::after {
      content: var(--icon-hamburger-menu);
    }
    &::before {
      position: static;
      width: 100%;
      display: block;
      padding-left: 1em;
    }
  }
`;
export const ExportOptions = ({
  wandRef,
  spellsRef,
  className,
}: {
  className?: string;
  wandRef: RefObject<HTMLDivElement>;
  spellsRef: RefObject<HTMLDivElement>;
}) => {
  const [expanded, setExpanded] = useState(false);

  const handleClick = useCallback(() => setExpanded(true), []);

  return (
    <Container data-name="ExportOptions" className={className}>
      <DefaultExport>
        <SaveImageButton
          name={'Wand'}
          targetRef={spellsRef}
          fileName={'wand'}
          enabled={true}
          hotkeys={{ hotkeys: 'p', position: 'top' }}
        />
        <OpenExportOptionsButton
          minimal
          imgOnly="always"
          onClick={() => handleClick()}
          imgAfter
          icon={'icon.hamburger.menu'}
          hotkeys={'e'}
        />
      </DefaultExport>
      <RevealExports $expanded={expanded}>
        <SaveImageButton
          name={'Spells'}
          targetRef={spellsRef}
          fileName={'spells'}
          enabled={true}
          hotkeys={{ hotkeys: 'shift+p', position: 'bottom' }}
        />
        <ExportWikiButton />
      </RevealExports>
    </Container>
  );
};
