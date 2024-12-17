import styled from 'styled-components';
import type { CSSProperties, PropsWithChildren } from 'react';
import type { ActionSource } from '../../../calc/actionSources';
import { StyledKeyContainer } from '../../Key/Key';

const StyledDiv = styled.div<{ $source: ActionSource }>`
  --hue: var(--hue-arrow-${(props) => props.$source});
  --height: 15px;

  display: flex;
  margin-top: calc(1lh - (var(--size-arrow-w) * 0.5));
  padding-top: calc(1lh - (var(--size-arrow-w) * 0.5));
  width: 50px;
  height: calc(1lh - (var(--size-arrow-w)));
  max-height: 10px;
  line-height: 1;

  position: relative;
  display: flex;
  margin-top: calc(1lh - (var(--size-arrow-w)));
  overflow: visible;
  background-color: #0000;

  box-sizing: border-box;
  border-radius: 1em 0 0 0;
  border-top: 3px solid hsl(var(--hue) 67% 40%);
  border-right-width: 0;
  border-bottom-width: 0;
  border-left: 3px solid hsl(var(--hue) 67% 40%);

  &::after {
    --hue: var(--arrowhead-hue-norm-angle);
    background-image: var(--icon-arrowhead-right);
    background-size: var(--height);
    background-repeat: no-repeat;
    background-position: right center;
    content: '';
    display: flex;
    position: absolute;
    right: 0;
    top: calc(-0.5lh - (var(--size-arrow-w) * 0.5));
    aspect-ratio: auto;
    line-height: 1;

    height: var(--height);
    width: 1lh;
    width: var(--arrow-hz, 48px);
    transform: translate(0px, 0);
    border: none;
    image-rendering: pixelated;

    filter: hue-rotate(calc(var(--arrowhead-hue-norm-angle) + var(--hue)))
      drop-shadow(0 0 0 #000);
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
`;

export const TreeArrow = ({
  source,
  children,
  style,
  className = '',
}: {
  source: ActionSource;
  style?: CSSProperties;
  className?: string;
} & PropsWithChildren) => {
  return (
    <StyledDiv
      $source={source}
      style={style}
      className={className}
      data-name={'TreeArrow'}
      data-source={source}
    >
      {children}
    </StyledDiv>
  );
};

export const DemoTreeArrow = styled(TreeArrow)``;
