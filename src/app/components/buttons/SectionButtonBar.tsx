import styled from 'styled-components/macro';

export const SectionButtonBar = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-self: end;
  position: sticky;
  top: -0.16em;
  z-index: var(--zindex-stickyheader-controls, 220);
  margin-top: -2.56em;
  background-color: var(--color-base-background);
  border-radius: 0 0 0 15.1em / 0 0 0 54.4em;
  padding: 0.36em 0.2em 0.46em 0.6em;
  padding: 0;
  border: 0.16em solid var(--color-tab-border-active);
  border-top-style: hidden;
  border-right-style: hidden;
  bottom: 2em;
  gap: 0.1em;

  & > button {
    border: 0.16em solid var(--color-button-border);
    border-radius: 0 0 0.2em 15.1em / 0 0 0em 64.4em;
    border-right-style: hidden;
    padding-top: 0.4em;
    padding-bottom: 0.3em;
    margin-left: -0.4em;
  }
  & > button:first-child {
    margin-left: 0;
  }

  @media screen and (max-width: 900px) {
  }
`;
