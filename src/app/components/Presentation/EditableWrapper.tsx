import styled from 'styled-components';
import type { CSSProperties, PropsWithChildren } from 'react';
import { ConfigToggleGroup } from '../ConfigEditor';
import { tipToAttributes, type Tip } from '../Tooltips/tooltipId';
import { useConfigToggle } from '../../redux';

const _EditableWrapper = styled.div<{
  accessHints?: boolean;
  disabled?: boolean;
}>`
  --w: 30px;

  display: flex;
  flex-direction: row;
  cursor: pointer;

  grid-column: 1/span 3;
  
  @media screen and (max-width: 500px) {
    background-position: 0.25ch 50%;
    border-bottom: var(--ou) dotted #222;
    padding: var(--ou) 0.2ch var(--ou) 2.5ch;
    align-content: center;
    align-items: center;
  }

  & > :first-child {
    width: auto;
    flex: 1 1 50%;
    align-content: center;
    justify-content: start;
  }

  & > :last-child {
    position: relative;
    flex: 1 1 40%;
    min-width: unset;
    max-width: unset;
    align-items: center;
    justify-content: end;
  }
  & > :last-child ? * {
    ${({ accessHints = true }) =>
      accessHints
        ? `text-decoration: underline dotted var(--color-toggle-hover) 1.4px;`
        : ''}
  }
  &:hover {
    color: var(--color-toggle-hover);
  }

  & > :last-child::before {
    content: '>';
    padding-left: 0px;
    color: yellow;
    position: static;
    width: var(--w);
    flex: 1 0 var(--w);
    text-align: end;
    display: flex;
    justify-content: end;
    align-content: center;
    align-items: center;
    text-decoration: none;

    width: 100%;
    grid-column: 1;
    grid-row: 1/-1;
    justify-self: end;
    min-width: 2ch;

    transform: translateX(calc(var(--w) * -1)) scaleY(0);
    opacity: 0;

    transition-property: transform, opacity;
    transition-duration: 10ms, 100ms;
    transition-timing-function: ease-in-out;
    transition-delay: 100ms, 100ms;
  }
  &:hover > :last-child::before {
    transform: translateX(0) scaleY(1);
    opacity: 1;

    transition-property: transform, opacity;
    transition-duration: 200ms, 120ms;
    transition-timing-function: ease;
    transition-delay: 0ms, 30ms;
  }

  & & {
    display: contents;
  }
  & & :last-child::before,
  &:hover & :last-child::before,
  & &:hover :last-child::before {
    display: none;
  }

  ${ConfigToggleGroup} & {
    display: grid;
    grid-template-columns: subgrid;
    grid-column: 1 / span 2;
  §}
`;

const TransparentLabel = styled.label`
  display: contents;
`;

const WithLabel = ({
  label,
  className,
  children,
}: { label: boolean; className?: string } & PropsWithChildren) =>
  label ? (
    <TransparentLabel className={className}>{children}</TransparentLabel>
  ) : (
    children
  );

export const EditableWrapper = styled(
  ({
    accessHintsOverride,
    disabled = false,
    label = false,
    children,
    style,
    className,
    dataName = 'EditableWithLabel',
    tip,
  }: {
    accessHintsOverride?: boolean;
    disabled?: boolean;
    label?: boolean;
    style?: CSSProperties;
    className?: string;
    dataName?: string;
    tip?: Tip;
  } & PropsWithChildren) => {
    const [hideAccessibilityHints] = useConfigToggle('hideAccessibilityHints');

    return (
      <WithLabel label={label}>
        <_EditableWrapper
          accessHints={accessHintsOverride ?? !hideAccessibilityHints}
          disabled={disabled}
          style={style}
          className={className}
          data-name={dataName}
          {...(tip ? tipToAttributes(tip) : {})}
        >
          {children}
        </_EditableWrapper>
      </WithLabel>
    );
  },
)``;
