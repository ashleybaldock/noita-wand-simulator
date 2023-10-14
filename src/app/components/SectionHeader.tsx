import styled from 'styled-components/macro';
import { ReactNode } from 'react';

const ParentDiv = styled.div`
  --color-fg-section-header: var(--color-button-border);
  position: sticky;
  top: -0.6em;
  z-index: 100;
  display: flex;
  align-items: center;

  background-color: transparent;
  border-top: 1px solid var(--color-fg-section-header);
  padding: 0.8em 0 0.6em 0;

  &::before,
  &::after {
    content: '';
    width: 1em;
    border-bottom: 1px solid red;
    border-top: 1px solid red;
    align-self: stretch;
  }
  &::before {
    position: absolute;
    top: 0;
    right: 5em;
    left: 3em;
    font-size: 14px;
    height: 0.12em;
    width: unset;
    margin-bottom: 0;
    background-color: var(--color-fg-section-header);
    border-bottom: 0em solid var(--color-base-background);
    border-top: 0px solid var(--color-base-background);
    z-index: 1;
    opacity: 1;
  }
`;

const LeftHeaderDiv = styled.div`
  position: relative;
  display: flex;
  align-items: last baseline;

  --sheader-base-height: 1em;
  font-size: 16px;
  height: calc(var(--sheader-base-height) * 1.75);
  line-height: calc(var(--sheader-base-height) * 1.26);
  border: 0.45em solid var(--color-base-background);

  font-weight: bold;
  font-family: var(--font-family-noita-default);
  font-variant-caps: small-caps;
  font-weight: 600;
  text-align: center;
  white-space: nowrap;

  color: var(--color-tab-active);
  background-color: var(--color-base-background);

  padding: 0 0.8em 0 0.8em;
  margin: 0;

  border-radius: 0em 0em 1.6em 0em;
  border-top: 0 solid transparent;
  border-right: 0.36em solid var(--color-base-background);
  border-bottom-width: 0.8em;
  border: 0.31em solid var(--color-base-background);

  &::after {
    content: '';
    position: absolute;
    right: 0em;
    left: -0.5em;
    bottom: -0.5em;
    width: inherit;
    height: 100%;

    border-radius: 0em 9em 15em 0em;
    border-left: 0 solid transparent;
    border-top: 0em dashed transparent;
    border-right: 0.2em solid var(--color-fg-section-header);
    border-bottom: 0.34em double var(--color-fg-section-header);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0em;
    right: 0em;
    left: 0em;
    height: 100%;
    width: inherit;
    padding-left: 1em;

    border-radius: 13em 0em 0em 9em;
    border-top: 0.12em solid var(--color-fg-section-header);
    border-right: 0em solid transparent;
    border-bottom: 0em dashed transparent;
    border-left: 0.2em solid var(--color-fg-section-header);
  }
`;


const RightHeaderDiv = styled(LeftHeaderDiv)`
  margin-left: auto;

  &::after {
    border-radius: 26px 0px 34px 10px;
    border-top: 0 solid transparent;
    border-bottom: 1px solid var(--color-fg-section-header);
    top: 2px;
    right: 0;
    left: -4px;
    right: -4px;
    top: -2px;
  }

  &::before {
    position: absolute;
    top: 0;
    right: 0px;
    bottom: unset;
    left: 0;

    border-radius: 0px 26px 10px 34px;
    border-radius: 0px 26px 10px 0px;
    border-top: 1px solid var(--color-fg-section-header);
    border-right: 3px solid var(--color-fg-section-header);
    border-bottom: 0 solid transparent;
  }
`;

const Seperator = styled.div`
  margin-left: auto;
`;

type SectionHeaderProps = {
  title: string | ReactNode;
  leftChildren?: ReactNode;
  rightChildren?: ReactNode;
};

export default function SectionHeader({
  leftChildren,
  rightChildren,
  title,
}: SectionHeaderProps) {
  return (
    <ParentDiv>
      <LeftHeaderDiv>{title}</LeftHeaderDiv>
      {leftChildren && <LeftHeaderDiv>{leftChildren}</LeftHeaderDiv>}
      <Seperator></Seperator>
      {rightChildren && (
        <>
          <RightHeaderDiv>{rightChildren}</RightHeaderDiv>
        </>
      )}
    </ParentDiv>
  );
}
