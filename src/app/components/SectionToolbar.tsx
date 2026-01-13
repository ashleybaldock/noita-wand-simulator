import styled from 'styled-components';
import type { ReactNode } from 'react';
import { SectionHeader } from './SectionHeader';

const StickyHeaderSep = styled.div`
  grid-row: line;
  grid-column: left/right;

  display: flex;
  align-items: center;
  width: 100%;
  z-index: var(--zindex-stickyheader-overline, 210);

  background-color: transparent;
  border-bottom: var(--ou) solid #222;
  border-top: calc(var(--ou) * 0.65) groove var(--color-tab-border-active);
  box-shadow:
    0 4px 1px 0px #000,
    0 -5px 0 0 #000;
`;
const SectionHeaderContainer = styled.div<{ $line: 'above' | 'below' }>`
  position: sticky;
  inset: var(--top-banner-height) auto auto auto;
  z-index: var(--zindex-stickyheader-controls, 220);
  display: grid;
  grid-template-columns:
    [left
    title-start] auto [title-end
    buttons-start] repeat(6, 1fr) [buttons-end
    right];

  grid-template-rows:
    [top
    ${({ $line }) => ($line === 'above' ? `line-start] auto [line-end` : '')}
    title-start buttons-start] 1fr [buttons-end title-end
    ${({ $line }) => ($line === 'below' ? `line-start] auto [line-end` : '')}
    bottom];
  margin: 10px 0 10px 0;

  @media screen and (max-width: 500px) {
    grid-template-columns:
      [left
      title-start buttons-start] auto repeat(5, 1fr)
      [title-end buttons-end
      right];
    grid-template-rows:
      [top
      ${({ $line }) => ($line === 'above' ? `line-start] auto [line-end` : '')}
      buttons-start] 3em [buttons-end
      ${({ $line }) => ($line === 'below' ? `line-start] auto [line-end` : '')}
      bottom];
  }

  filter: var(--filter-floating-shadow);

  & > button {
    padding-top: 0.4em;
    padding-bottom: 0.3em;
  }
`;

export const GridSectionHeader = styled(SectionHeader)`
  grid-area: title;
  place-self: start;

  display: flex;
  flex-wrap: nowrap;
  align-items: flex-start;

  @media screen and (max-width: 500px) {
  }
  font-size: 15px;
  font-weight: normal;
  border-width: 2px;
  border-style: solid;
  border-radius: 0 0.2em 15.1em 0 / 0 0 64.4em 0;
  border-left-style: hidden;
  padding: 0.3em 1ch 0.2em 0.6ch;
`;

export const SectionToolbar = ({
  title,
  className = '',
  children,
  line = 'above',
}: React.PropsWithChildren<{
  title: string | ReactNode;
  className?: string;
  line?: 'above' | 'below';
}>) => {
  return (
    <SectionHeaderContainer
      data-name="SectionToolbar"
      data-title={title}
      className={className}
      $line={line}
    >
      <StickyHeaderSep />
      <GridSectionHeader title={title} />
      {children}
    </SectionHeaderContainer>
  );
};
