import styled from 'styled-components/macro';

const StyledButton = styled.button<{
  imgUrl: string;
  imgDataUrl: string;
  minimal: boolean;
}>`
  border: 1px solid var(--color-button-border);
  border-radius: 5px;
  ${({ imgUrl }) =>
    imgUrl.length > 0 ? `background-image: url(/${imgUrl})` : ''};
  ${({ imgDataUrl }) =>
    imgDataUrl.length > 0 ? `background-image: url("${imgDataUrl}")` : ''};
  background-position: 0.6em 50%;
  background-origin: padding-box;
  background-size: 1em;
  background-repeat: no-repeat;
  background-color: var(--color-button-background);
  image-rendering: pixelated;
  font-family: 'noita', '04b03', sans-serif;
  font-variant: small-caps;
  font-size: 16px;
  color: var(--color-button);
  padding: 0.5em 0.6em 0.3em 2.2em;
  margin: 3px;
  cursor: pointer;

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

  ${({ minimal }) =>
    minimal
      ? `
    margin: 3px;
    cursor: pointer;
    background-position: 0.26em 50%;
    background-size: 1.64em;
    padding: 0.4em 0.27em 0.2em 2.2em;
    font-size: 0.7em;
    `
      : ``};
`;

type Props = {
  onClick?: () => void;
  imgUrl?: string;
  imgDataUrl?: string;
  minimal?: boolean;
};

export const Button = ({
  onClick = () => {},
  imgUrl = '',
  imgDataUrl = '',
  minimal = false,
  children,
}: React.PropsWithChildren<Props>) => {
  return (
    <StyledButton
      minimal={minimal}
      imgUrl={imgUrl}
      imgDataUrl={imgDataUrl}
      onClick={onClick}
    >
      {children}
    </StyledButton>
  );
};
