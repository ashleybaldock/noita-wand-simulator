import { useHotkeys } from 'react-hotkeys-hook';
import styled from 'styled-components';
import { isString, noop } from '../../util';
import type { TooltipId } from '../Tooltips/tooltipId';
import type { ActionHintId } from '../Tooltips/actionHintId';
import { HotkeyHint } from '../Tooltips/HotkeyHint';

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
/*
 *

--pad-other-side: 2.7em;
padding-left: 0.6em;
background-position: 100% 50%;
--background-size: 0.46em;
--pad-img-side: calc(var(--background-size) + 1.9em);

 */

const breakpoints = ['500px', '600px', '700px'] as const;

export type BreakPoint = (typeof breakpoints)[number];

export const isBreakpoint = (
  (breakpointSet) =>
  (x: unknown): x is BreakPoint =>
    isString(x) && (breakpointSet as Set<string>).has(x)
)(new Set(breakpoints));

export type ImgOnlyOption = 'never' | 'always' | BreakPoint;

const StyledButton = styled.button<{
  imgUrl: string;
  imgDataUrl: string;
  imgAfter: boolean;
  imgOnly: ImgOnlyOption;
  minimal: boolean;
  shape: ButtonShape;
}>`
  position: relative;
  color: var(--color-button);
  background-color: var(--color-button-background);
  border: 0.16em solid var(--color-button-border);
  font-family: var(--font-family-noita-default);
  font-size: 14px;
  font-variant: small-caps;
  cursor: pointer;

  --background-size: 1.4em;
  --pad-img-side: 2.2em;
  --pad-other-side: 0.6em;

  margin: 0;
  padding-top: 0.2em;
  padding-bottom: 0;

  ${({ imgAfter }) =>
    imgAfter
      ? `padding-right: var(--pad-img-side);
         padding-left: var(--pad-other-side);
         background-position: 90% 50%;`
      : `padding-right: var(--pad-other-side);
         padding-left: var(--pad-img-side);
         background-position: 10% 50%;`}

  ${({ shape }) => borderForShape.get(shape)};

  ${({ imgUrl }) =>
    imgUrl.length > 0 ? `background-image: url('/${imgUrl}')` : ''};
  ${({ imgDataUrl }) =>
    imgDataUrl.length > 0 ? `background-image: url("${imgDataUrl}")` : ''};
  background-origin: padding-box;
  background-size: var(--background-size);
  background-repeat: no-repeat;
  image-rendering: pixelated;

  & {
    transition: var(--transition-hover-out);
    transition-property: border-color, color, opacity;
  }

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

  ${({ minimal }) =>
    minimal
      ? `
    --background-size: 0.42em;
    --pad-img-side: calc(var(--background-size) + 1.9em);
    --pad-other-side: 1em;

    margin: 0;
    cursor: pointer;
    padding-top: 0.5em;
    padding-bottom: 0.4em;
    font-size: 0.6em;
    line-height: 1.1em;
    border-radius: 0.2em;
    background-size: auto calc(var(--background-size) * 3.2);
    color: var(--color-emphasis);
    opacity: 0.7;

    &:hover {
      opacity: 1;
      color: var(--color-emphasis);
    }
    `
      : ``};

  ${({ imgOnly }) =>
    imgOnly === 'always' &&
    `
      background-position: center center;
  `}
  ${({ imgOnly }) =>
    isBreakpoint(imgOnly) &&
    `
    @media screen and (max-width: ${imgOnly}) {
      background-position: center center;
    }
  `}
`;

const MobileHidden = styled.div<React.PropsWithChildren>`
  @media screen and (max-width: 600px) {
    display: none;
  }
`;

export const Button = ({
  onClick = noop,
  onMouseOver = noop,
  onMouseOut = noop,
  hotkeys = '',

  tooltipId,
  tooltipActionHintId,

  imgUrl = '',
  imgDataUrl = '',
  imgAfter = false,
  imgOnly = 'never',
  minimal = false,
  shape = 'pill',
  children,
  className = '',
}: React.PropsWithChildren<{
  className?: string;
  onClick?: () => void;
  onMouseOver?: () => void;
  onMouseOut?: () => void;
  hotkeys?: string;
  imgUrl?: string;
  imgDataUrl?: string;
  imgAfter?: boolean;
  imgOnly?: ImgOnlyOption;
  minimal?: boolean;
  shape?: ButtonShape;
  tooltipId?: TooltipId;
  tooltipActionHintId?: ActionHintId;
}>) => {
  useHotkeys(hotkeys, onClick, { enabled: hotkeys !== '' });
  return (
    <StyledButton
      className={className}
      minimal={minimal}
      shape={shape}
      imgUrl={imgUrl}
      imgDataUrl={imgDataUrl}
      imgAfter={imgAfter}
      imgOnly={imgOnly}
      onClick={onClick}
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
      {...(tooltipId ?? false
        ? {
            'data-tooltip-id': tooltipId,
            'data-tooltip-content': `${tooltipActionHintId}`,
          }
        : {})}
    >
      {isBreakpoint(imgOnly) ? (
        <MobileHidden>{children}</MobileHidden>
      ) : (
        children
      )}
      {<HotkeyHint hotkeys={hotkeys} position={minimal ? 'above' : 'below'} />}
    </StyledButton>
  );
};
