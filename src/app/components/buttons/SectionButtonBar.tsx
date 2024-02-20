import styled from 'styled-components';

export const SectionButtonBar = styled.div`
  display: flex;
  flex-direction: row;
  align-self: start;
  background-color: var(--color-base-background);
  border-radius: 0 0 0 15.1em / 0 0 0 54.4em;
  padding: 0.04em;
  border: 0.16em solid var(--color-tab-border-active);
  border-top-style: hidden;
  border-right-style: hidden;
  border-bottom-width: 0.12em;

  filter: var(--filter-floating-shadow);
  bottom: 2em;
  gap: 0em;
  flex-wrap: wrap-reverse;
  justify-content: end;

  & > button {
    border: 0.16em solid var(--color-button-border);
    border-radius: 0 0 0.2em 15.1em / 0 0 0em 64.4em;
    border-right-style: hidden;
    padding-top: 0.4em;
    padding-bottom: 0.4em;
    margin-left: -0.4em;
  }
  & > button:first-child {
    margin-left: 0;
  }
`;
