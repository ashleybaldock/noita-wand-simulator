import styled, { type DataAttributes } from 'styled-components';
import { isAnnotationTooltipId } from '../Tooltips/AnnotationTooltip';
import { tipToAttributes, type Tip } from '../Tooltips/tooltipId';
import type { MouseEventHandler, PropsWithChildren } from 'react';
import { KeyNote, KeyExample } from '../Key/Key';
import type { HotkeyCallback } from 'react-hotkeys-hook';
import { useIsDemo } from '../Demo';

// const StyledDiv = styled.div`
//   width: calc(var(--bsize-spell) / 4);
//   height: calc(var(--bsize-spell) / 4);
//   line-height: calc(var(--bsize-spell) / 3 - 2px);
//   text-align: center;

//   ${StyledKeyContainer} & {
//     position: relative;
//     inset: unset;
//     transform: none;
//   }
// `;
const _BaseAnnotation = ({
  hidden = true,
  dataName,
  className,
  tip,
  onClick,
  onHotkey,
  onMouseOut,
  onMouseOver,
  children,
  ...rest
}: {
  hidden?: boolean;
  dataName?: string;
  tip?: Tip;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  onHotkey?: HotkeyCallback;
  onMouseOver?: MouseEventHandler<HTMLButtonElement>;
  onMouseOut?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
} & DataAttributes &
  PropsWithChildren) => {
  const isDemo = useIsDemo();
  return (
    <button
      data-name={dataName}
      className={className}
      hidden={hidden}
      {...((tip ?? isAnnotationTooltipId(dataName ?? ''))
        ? tipToAttributes({ kind: 'annotation', id: dataName })
        : {})}
      onClick={onClick}
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
      {...rest}
    >
      {children}
    </button>
  );
};

export const BaseAnnotation = styled(_BaseAnnotation)`
  border: 0;
  margin: 0;
  padding: 0;
  box-shadow: 0;
  color: var(--base-color);
  font-family: noita;

  width: calc(var(--bsize-spell) / 4);
  height: calc(var(--bsize-spell) / 4);
  line-height: calc(var(--bsize-spell) / 3 - 2px);
  text-align: center;

  ${({ hidden }) =>
    hidden &&
    `
    visibility: hidden;
    pointer-events: none;
    `}

  ${KeyExample} & {
    position: relative;
    inset: unset;
    transform: none;
  }

  ${KeyNote} & {
    position: static;
    display: inline !important;
    inset: unset;
    transform: none;
    margin: 0 0.5ch;
  }
`;
