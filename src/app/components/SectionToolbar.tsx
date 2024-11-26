import styled from 'styled-components';
import type { ReactNode } from 'react';
import { SectionHeader } from './SectionHeader';

const StickyHeaderTopBar = styled.div`
  grid-row: line;
  grid-column: left/right;

  display: flex;
  align-items: center;
  width: 100%;
  z-index: var(--zindex-stickyheader-overline, 210);

  background-color: transparent;
  border-top: 0.16em solid var(--color-base-background);
  border-bottom: 0.16em solid var(--color-tab-border-inactive);
`;
const SectionHeaderContainer = styled.div`
  position: sticky;
  top: -0.36em;
  bottom: 0;
  z-index: var(--zindex-stickyheader-controls, 220);
  display: grid;
  grid-template-columns:
    [left
    title-start] 3fr [title-end
    search-start buttons-start] repeat(6, 1fr) [search-end buttons-end
    right];
  grid-template-rows:
    [top
    line-start] auto [line-end
    title-start buttons-start] 1fr [buttons-end
    search-start] auto [search-end title-end
    bottom];

  @media screen and (max-width: 600px) {
    grid-template-columns:
      [left
      title-start search-start buttons-start] auto repeat(5, 1fr)
      [title-end search-end buttons-end
      right];
    grid-template-rows:
      [top
      line-start] auto [line-end
      buttons-start] 3em [buttons-end
      search-start] 2em [search-end
      bottom];
  }

  filter: var(--filter-floating-shadow);

  & > button {
    border-radius: 0 0 0.2em 15.1em / 0 0 0 64.4em;
    border-right-style: hidden;
    padding-top: 0.4em;
    padding-bottom: 0.3em;
    margin-left: -0.5em;
  }
`;

const GridSectionHeader = styled(SectionHeader)`
  grid-area: title;
  place-self: start;

  display: flex;
  flex-wrap: nowrap;
  align-items: flex-start;

  @media screen and (max-width: 500px) {
  }
`;

export const SectionToolbar = ({
  title,
  className = '',
  children,
}: React.PropsWithChildren<{
  title: string | ReactNode;
  className?: string;
}>) => {
  return (
    <SectionHeaderContainer data-name="SectionToolbar" className={className}>
      <StickyHeaderTopBar />
      <GridSectionHeader title={title} />
      {children}
    </SectionHeaderContainer>
  );
};
