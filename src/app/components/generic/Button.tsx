import { useHotkeys, type HotkeyCallback } from 'react-hotkeys-hook';
import styled from 'styled-components';
import { isString, noop } from '../../util';
import { tipToAttributes } from '../Tooltips/tooltipId';
import type { Tip } from '../Tooltips/tooltipId';
import type { HotkeyConfig } from '../Tooltips/HotkeyHint';
import { HotkeyHint } from '../Tooltips/HotkeyHint';
import type { SpriteName } from '../../calc/sprite';
import { useSpritePath } from '../../calc/sprite';
import type { MouseEventHandler } from 'react';
import { isBreakpoint, type BreakPoint } from '../Breakpoint/Breakpoint';
import { MobileHidden } from '../Breakpoint/MobileHidden';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ButtonShapes = [
  'rectangle',
  'rectrounded',
  'pill',
  'oval',
  'pebble',
  'petal1',
  'petal2',
] as const;

export type ButtonShape = (typeof ButtonShapes)[number];

const borderForShape = new Map<ButtonShape, string>([
  ['rectangle', 'border-radius: 0em / 0em;'],
  ['rectrounded', 'border-radius: 0.3em / 0.3em;'],
  ['pill', 'border-radius: 50% / 0;'],
  ['oval', 'border-radius: 50% / 50%;'],
  [
    'pebble',
    'border-radius: 3.5em 10em 9em 4.2em / 2.463em 2.4em 3.2em 2.58em;',
  ],
  ['petal1', 'border-radius: 1.6em 0em 0em 10em / 14em 0em 0em 41em;'],
  ['petal2', 'border-radius: 3.2em 20em 3.2em 12em / 12em 12em 12em 12em;'],
]);
export type ImgOnlyOption = 'never' | 'always' | BreakPoint;

const StyledButton = styled.button<{
  disabled: boolean;
  background: string;
  imgAfter: boolean;
  imgOnly: ImgOnlyOption;
  minimal: boolean;
  shape: ButtonShape;
}>`
  ${({ imgAfter, imgOnly, minimal, shape, background, disabled }) => `
  position: relative;
  color: var(--color-button);
  background-color: var(--color-button-background);
  background-repeat: no-repeat;
  border: var(--border-thickness) solid var(--color-button-border);
  font-family: var(--font-family-noita-default);
  font-size: 14px;
  font-variant: small-caps;
  cursor: pointer;

  --border-thickness: clamp(0.5px, max(0.1lh, 0.1em), 2px);
  --background-size: 1.4em;
  --pad-img-side: 2.2em;
  --pad-other-side: 0.6em;

  --bdr-tr: 0.2em 15.1em 0 0/0 64.4em 0 0;
  --bdr-br: 0 0.2em 15.1em 0/0 0 64.4em 0;
  --bdr-bl: 0 0 0.2em 15.1em/0 0 0 64.4em;
  --bdr-tl: 15.1em 0 0 0.2em/64.4em 0 0 0;

  margin: 0;
  padding-top: 0.2em;
  padding-bottom: 0;

  ${
    imgAfter
      ? `
  padding-right: var(--pad-img-side);
  padding-left: var(--pad-other-side);
  background-position: right var(--pad-other-side) top 50%;
  `
      : `
  padding-right: var(--pad-other-side);
  padding-left: var(--pad-img-side);
  background-position: left var(--pad-other-side) top 50%;
  `
  }

  ${borderForShape.get(shape)}

  ${background ? `background-image: ${background};` : ''}

  & {
    transition: var(--transition-hover-out);
    transition-property: border-color, color, opacity;
  }

  ${
    minimal
      ? `
  --background-size: 0.42em;
  --pad-img-side: calc(var(--background-size) + 1.9em);
  --pad-other-side: 1em;

  --pad-top: 0.5em;
  --pad-bottom: 0.4em;
  --fsize: 0.6rem;
  --min-height: calc(var(--pad-top) + var(--pad-bottom) + var(--fsize) + (var(--border-thickness) * 2));

  min-height: var(--min-height);
  
  margin: 0;
  cursor: pointer;
  padding-top: var(--pad-top);
  padding-bottom: var(--pad-bottom);
  font-size: var(--fsize);
  line-height: 1.1;
  border-radius: 0.2em;
  background-size: auto calc(var(--background-size) * 3.2);
  color: var(--color-emphasis);
  opacity: 0.7;
  `
      : ``
  }

  ${
    minimal && !disabled
      ? `
  &:hover {
    opacity: 1;
    color: var(--color-emphasis);
  }
  `
      : ''
  }


  ${
    disabled
      ? `
  filter: grayscale(1) contrast(0.7) brightness(0.4);
  background-color: #222;
  cursor: not-allowed;
  `
      : `
  &:hover {
    color: var(--color-button-hover);
    border-color: var(--color-button-border-hover);
    transition: var(--transition-hover-in);
    transition-property: border-color, color, opacity;
  }

  &:active {
    color: var(--color-button-active);
    border-color: var(--color-button-border-active);
    transition: var(--transition-activate);
    transition-property: border-color, color, opacity;
  }
  `
  }
  ${
    imgOnly === 'always'
      ? `
  background-position: center center;
  `
      : ''
  }

  ${
    isBreakpoint(imgOnly)
      ? `
  @media screen and (max-width: ${imgOnly}) {
    background-position: center center;
  }
  `
      : ''
  }
`}
`;

export const Button = ({
  onClick = noop,
  onMouseOver = noop,
  onMouseOut = noop,
  hotkeys = '',
  onHotkey = noop,

  tip,

  icon = 'none',
  imgUrl = '',
  imgDataUrl = '',
  imgAfter = false,
  imgOnly = 'never',
  disabled = false,
  minimal = false,
  shape = 'pill',
  children,
  className = '',
  dataName,
}: React.PropsWithChildren<{
  className?: string;
  dataName?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  onHotkey?: HotkeyCallback;
  onMouseOver?: MouseEventHandler<HTMLButtonElement>;
  onMouseOut?: MouseEventHandler<HTMLButtonElement>;
  hotkeys?: string | HotkeyConfig;
  icon?: SpriteName;
  imgAfter?: boolean;
  imgOnly?: ImgOnlyOption;
  disabled?: boolean;
  minimal?: boolean;
  shape?: ButtonShape;
  tip?: Tip;
  /**
   * @deprecated use @param {icon} instead
   */
  imgUrl?: string;
  /**
   * @deprecated use @param {icon} instead
   */
  imgDataUrl?: string;
}>) => {
  useHotkeys(isString(hotkeys) ? hotkeys : hotkeys.hotkeys, onHotkey, {
    enabled: hotkeys !== '',
  });
  const iconPath = useSpritePath(icon);

  const background =
    iconPath ??
    (imgUrl.length
      ? `url('/${imgUrl}')`
      : imgDataUrl.length
        ? `url("${imgDataUrl}")`
        : 'none');

  return (
    <StyledButton
      data-name={dataName}
      className={className}
      disabled={disabled}
      minimal={minimal}
      shape={shape}
      background={background}
      imgAfter={imgAfter}
      imgOnly={imgOnly}
      onClick={onClick}
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
      {...(tip ? tipToAttributes(tip) : {})}
    >
      {isBreakpoint(imgOnly) ? (
        <MobileHidden breakpoint={imgOnly}>{children}</MobileHidden>
      ) : (
        imgOnly !== 'always' && children
      )}
      {isString(hotkeys) ? (
        <HotkeyHint hotkeys={hotkeys} position={minimal ? 'above' : 'below'} />
      ) : (
        <HotkeyHint {...hotkeys} />
      )}
    </StyledButton>
  );
};
