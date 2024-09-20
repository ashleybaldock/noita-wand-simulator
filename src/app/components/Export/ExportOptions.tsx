import { Button, SaveImageButton } from '../generic';
import { ExportWikiButton } from '../Export/ExportWikiButton';
import styled from 'styled-components';
import { useCallback, useRef, useState } from 'react';

const Container = styled.div`
  position: absolute;
  right: -0.8em;
  display: flex;
  flex-direction: column;
  justify-content: end;
  align-items: end;
  font-family: var(--font-family-noita-default);
  z-index: var(--zindex-copy-png);

  @media screen and (max-width: 800px) {
    bottom: -0.8em;
  }

  padding: 0.2em 0.2em 0.2em 0.4em;
  background-color: #0000;
  top: calc(100% - 1.4em);
  border-radius: 1em / 8em;
  border: 1px solid #0000;
  transition-property: visibility, background, padding, top, border;
  transition-delay: 500ms;
  transition-timing-function: ease;
  transition-duration: 80ms;
  pointer-events: none;

  &:hover {
    background-color: #000d;
    padding: 1em 0.2em 1em 0.6em;
    top: calc(100% - 2.2em);
    border: 1px solid #c98930;
    transition-property: visibility, background, padding, top, border;
    transition-delay: 0ms;
    transition-timing-function: ease;
    transition-duration: 40ms;
    pointer-events: auto;
  }
`;

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

  @media screen and (max-width: 800px) {
    &::after {
      content: var(--icon-hamburger-menu);
    }
  }
`;
export const ExportOptions = ({ className }: { className?: string }) => {
  const spellsRef = useRef<HTMLDivElement>(null);

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
