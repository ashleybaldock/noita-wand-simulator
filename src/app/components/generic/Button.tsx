import styled from 'styled-components/macro';

const ButtonShapes = [
  'rectangle',
  'rectrounded',
  'pill',
  'oval',
  'pebble',
  'petal1',
  'petal2',
] as const;
export type ButtonShape = typeof ButtonShapes[number];

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

const StyledButton = styled.button<{
  imgUrl: string;
  imgDataUrl: string;
  minimal: boolean;
  shape: ButtonShape;
}>`
  color: var(--color-button);
  border: 1px solid var(--color-button-border);
  background-color: var(--color-button-background);
  border: 0.16em solid var(--color-button-border);
  font-family: var(--font-family-noita-default);
  font-size: 14px;
  font-variant: small-caps;
  cursor: pointer;

  margin: 0;
  padding: 0.2em 0.6em 0em 2.2em;
  ${({ shape }) => borderForShape.get(shape)};

  ${({ imgUrl }) =>
    imgUrl.length > 0 ? `background-image: url('/${imgUrl}')` : ''};
  ${({ imgDataUrl }) =>
    imgDataUrl.length > 0 ? `background-image: url("${imgDataUrl}")` : ''};
  background-position: 0.4em 50%;
  background-origin: padding-box;
  background-size: 1.6em;
  background-repeat: no-repeat;
  image-rendering: pixelated;

  ${({ minimal }) =>
    minimal
      ? `
    margin: 0;
    cursor: pointer;
    background-size: 1.64em;
    background-position: 0.36em 50%;
    padding: 0.6em 0.4em 0.3em 2.3em;
    font-size: 0.6em;
    line-height: 1.1em;
    `
      : ``};

  & {
    transition: var(--transition-hover-out);
    transition-property: border-color, color;
  }

  &:hover {
    color: var(--color-button-hover);
    border-color: var(--color-button-border-hover);
    transition: var(--transition-hover-in);
    transition-property: border-color, color;
  }

  &:active {
    color: var(--color-button-active);
    border-color: var(--color-button-border-active);
    transition: var(--transition-activate);
    transition-property: border-color, color;
  }
`;

type Props = {
  onClick?: () => void;
  onMouseOver?: () => void;
  onMouseOut?: () => void;
  imgUrl?: string;
  imgDataUrl?: string;
  minimal?: boolean;
  shape?: ButtonShape;
};

const noop = () => {};

export const Button = ({
  onClick = noop,
  onMouseOver = noop,
  onMouseOut = noop,

  imgUrl = '',
  imgDataUrl = '',
  minimal = false,
  shape = 'pill',
  children,
}: React.PropsWithChildren<Props>) => {
  return (
    <StyledButton
      minimal={minimal}
      shape={shape}
      imgUrl={imgUrl}
      imgDataUrl={imgDataUrl}
      onClick={onClick}
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
    >
      {children}
    </StyledButton>
  );
};
