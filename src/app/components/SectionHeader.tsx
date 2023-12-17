import styled from 'styled-components';
import { ReactNode } from 'react';

const StickyHeaderBackground = styled.div`
  position: sticky;
  top: -0.36em;
  z-index: var(--zindex-stickyheader-behind, 200);

  display: flex;
  align-items: center;

  background-color: transparent;
  border-top: 0.16em solid var(--color-base-background);
  border-bottom: 0.16em solid var(--color-tab-border-inactive);
`;

const StickyTitleHeader = styled.h2`
  --color-fg-section-header: var(--color-button-border);

  position: sticky;
  top: 0em;
  left: 0;
  width: fit-content;
  z-index: var(--zindex-stickyheader-title, 210);

  display: flex;
  align-items: center;

  background-color: transparent;
  background-color: blue;
  background-color: var(--color-base-background);
  border-top: 1px solid var(--color-fg-section-header);
  padding: 0.8em 0 0.2em 0;
  padding: 0.8em 0.2em 0.4em 0.2em;

  margin: 0;
  padding: 0.8em 0.6em 0.8em 0.2em;
  font-size: 16px;
  margin: 0;
  font-weight: normal;
  border-radius: 0em 0em 20em 0em / 0 0em 2.1em 0em;
  border: 0.16em solid var(--color-tab-border-active);
  border-top-style: hidden;
  border-left-style: hidden;

  padding: 0.5em 0.6em 6.8px 0.2em;

  font-size: 16px;
  margin: 0;
  font-weight: normal;
  border-radius: 1em 0.8em 19em 0em / 0 2.8em 4em 1em;
  border: 0.16em solid var(--color-tab-border-active);
  border-top-style: solid;
  border-left-style: hidden;
  border-bottom-width: 0.5em;
  border-right-style: solid;
  border-bottom-style: double;
  border-right-width: 0.6em;
  border-top-color: black;
  border-top-width: 0em;
`;

type SectionHeaderProps = {
  title: string | ReactNode;
  subtitle?: string;
};

export const SectionHeader = ({ title }: SectionHeaderProps) => {
  return (
    <>
      <StickyHeaderBackground></StickyHeaderBackground>
      <StickyTitleHeader>{title}</StickyTitleHeader>
    </>
  );
};
