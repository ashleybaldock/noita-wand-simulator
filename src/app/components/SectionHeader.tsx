import styled from 'styled-components';
import type { ReactNode } from 'react';

const StickyTitleHeader = styled.h2`
  --color-fg-section-header: var(--color-button-border);

  width: fit-content;
  white-space: nowrap;
  z-index: var(--zindex-stickyheader-title, 210);

  display: flex;
  flex: 0 0 auto;

  background-color: var(--color-base-background);

  padding: 0.5em 0.6em 6.8px 0.2em;
  margin: 0 auto 0 0;

  border-top: 1px solid var(--color-fg-section-header);
  border-radius: 1em 0.8em 19em 0em / 0 2.8em 4em 1em;
  border: 0.16em solid var(--color-tab-border-active);
  border-top-style: solid;
  border-top-color: black;
  border-top-width: 0em;
  border-right-style: solid;
  border-right-width: 0.6em;
  border-bottom-width: 0.5em;
  border-bottom-style: double;
  border-left-style: hidden;

  font-size: 16px;
  font-weight: normal;

  @media screen and (max-width: 500px) {
    height: 100%;
    bottom: 0;
    left: 0;
    grid-row: buttons;
    grid-column: buttons/span 1;
    z-index: unset;
    font-size: 14px;
    line-height: 1.3;
    white-space: wrap;
    border: none;
    border-radius: 0;
    border-bottom: 0.16em solid var(--color-button-border);
    flex: 1 1 min-content;
    padding: 0;
    padding-left: 0.3em;
    padding-right: 0.6em;
    place-self: center;
    align-items: center;
  }
`;

export const SectionHeader = ({
  title,
  className = '',
}: {
  title: string | ReactNode;
  className?: string;
}) => {
  return <StickyTitleHeader className={className}>{title}</StickyTitleHeader>;
};
