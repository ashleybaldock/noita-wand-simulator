import styled from 'styled-components';
import type { CSSProperties, PropsWithChildren } from 'react';
import type { ActionSource } from '../../../calc/actionSources';
import { StyledKeyContainer } from '../../Key/Key';
import { DebugHints, WithDebugHints } from '../../Debug';

const StyledDiv = styled.div<{ $source: ActionSource; $arrow: Arrow }>`
  --hue: var(--hue-arrow-${(props) => props.$source});
  --height: 15px;

  display: flex;
  margin-top: calc(1lh - (var(--size-arrow-w) * 0.5));
  width: 100%;
  height: calc(1lh - (var(--size-arrow-w)));
  line-height: 1;

  position: absolute;
  top: 0;
  display: flex;
  margin-top: calc(1lh - (var(--size-arrow-w)));
  overflow: visible;
  background-color: #0000;

  border-radius: 1em 0 0 0;
  border: 0 solid hsl(var(--hue) 67% 40%);

  ${(props) =>
    props.$arrow === '⭢ '
      ? `
      --height: var(--row-height);
      height: calc(var(--height) * 0.5);
      margin-top: calc(var(--height) * 0.5);
    top: calc((var(--row-height) * 0.5) - (var(--height) * 0.5));
    top: 0;
    border-left-width: 0;
    border-width: var(--arrow-line-➜);
    border-radius: var(--arrow-radius-➜);

    `
      : ''}
  ${(props) =>
    props.$arrow === '⤵︎'
      ? `
    width: calc(var(--arrow-left-w) - (var(--arrow-line-w) / 2));
    top: calc((var(--row-height) * 0.5) - (var(--arrow-line-w) * 0.5));
    right: unset;
    bottom: 0;
    left: 0;
    border-width: var(--arrow-line-⤵);
    border-radius: var(--arrow-radius-⤵);
    top: calc((var(--spell-size) / 2) + (var(--arrow-line-w) / 2) * -1);

    `
      : ''}
  ${(props) =>
    props.$arrow === '⤷ '
      ? `
    top: calc((var(--row-height) * 0.5) - (var(--arrow-line-w) * 0.5));
    border-width: var(--arrow-line-⤷);
    border-radius: var(--arrow-radius-⤷);

    `
      : ''}

  &&::after {
    background-image: var(--icon-arrowhead-right);
    background-size: var(--arrowhead-h, 16px);
    background-repeat: no-repeat;
    background-position: right center;
    content: '';
    display: flex;
    position: absolute;
    right: 0;
    top: calc(-0.5lh - (var(--size-arrow-w) * 0.5));
    aspect-ratio: auto;
    line-height: 1;

    height: var(--arrowhead-h, 16px);
    width: var(--arrowhead-w, 16px);
    transform: translate(0px, 0);
    border: none;
    image-rendering: pixelated;

    filter: hue-rotate(
        calc(
          var(--arrowhead-hue-norm-angle) +
            var(--hue, var(--arrowhead-hue-norm-angle))
        )
      )
      drop-shadow(0 0 0 #000);

    ${(props) =>
      props.$arrow === '⭢ '
        ? `

      `
        : ''}
    ${(props) =>
      props.$arrow === '⤵︎'
        ? `
        background-image: none;

      `
        : ''}
    ${(props) =>
      props.$arrow === 'ↆ'
        ? `
        background-image: none;

      `
        : ''}
    ${(props) =>
      props.$arrow === '⤷ '
        ? `
      --width: var(--arrow-right-w);
        left: calc(var(--arrow-left-w) - (var(--arrow-line-w) / 2));
  top: calc((var(--row-height) * -0.5));
  --height: calc( var(--row-height) - (var(--spell-size) * 0.5) + var(--arrow-line-w) );

      `
        : ''}
  }

  ${StyledKeyContainer} & {
    transform: none;
    position: relative;
    top: unset;
    right: unset;
    bottom: unset;
    left: unset;

    width: 3em;
    height: 100%;
  }

  ${WithDebugHints} > & {
    background-color: #222;
  }
`;

type Arrow = '⭢ ' | '⤵︎' | 'ↆ' | '⤷ ';

export const TreeArrow = ({
  source,
  arrow = '⭢ ',
  children,
  style,
  className = '',
}: {
  source: ActionSource;
  arrow?: Arrow;
  style?: CSSProperties;
  className?: string;
} & PropsWithChildren) => {
  return (
    <StyledDiv
      $arrow={arrow}
      $source={source}
      style={style}
      className={className}
      data-name={'TreeArrow'}
      data-arrow={arrow}
      data-source={source}
    >
      {children}
    </StyledDiv>
  );
};

export const DemoTreeArrow = styled(TreeArrow)``;
