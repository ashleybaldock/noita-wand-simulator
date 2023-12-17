import styled from 'styled-components';

const Container = styled.div`
  --line-width-x: 3px;
  --line-width-y: 6px;
  --offset-x: 0px;
  --offset-y: 0px;

  --nesting-offset: var(--sizes-nesting-offset, 16px);

  display: flex;
  flex-direction: column;
  position: relative;

  place-items: stretch center;
  position: relative;
  flex-direction: column;
  display: flex;
  box-sizing: border-box;
`;

const Spacer = styled.div.attrs<{
  $nestingLevel?: number;
  $alignTop?: boolean;
  $hide?: boolean;
  $origin?: boolean;
  $endpoint?: boolean;
  $branch?: boolean;
}>(
  ({ $hide = false, $origin = false, $endpoint = false, $branch = false }) => ({
    $hide,
    $origin,
    $endpoint,
    $branch,
  }),
)`
  --line-style: solid;
  --line-color: var(--color-arrow-action);
  --opacity: 1;

  &::before {
    content: '';
    position: absolute;
    width: calc(50%);
    height: 1em;
    top: calc(var(--line-width-x) * -1);
    left: 0;
    border-left: var(--line-width-x) hidden var(--line-color);
  }

  ${({ $branch }) =>
    $branch
      ? `
  &:last-of-type::after {
    --line-style: solid;

    content: '';
    position: absolute;
    top: unset;
    bottom: 0;
    right: 0;
    width: calc(50% - var(--offset-x,0px ) + calc(var(--line-width-y) / 2));
    height: 60%;

    background-image: calc(((var(--nesting-offset) + var(--offset-y)) / 2) );

    box-sizing: border-box;
    border-top: 0 hidden transparent;
    border-right: 0 hidden transparent;
    border-bottom: var(--line-width-x) var(--line-style) var(--color-arrow-action);
    border-left: var(--line-width-y) var(--line-style) var(--color-arrow-action);
      border-radius: 0 0 0 30px / 0 0 0 10px;
      border-bottom: var(--line-width-x) var(--line-style) var(--color-arrow-action);
  }
      `
      : `
      `}
  ${({ $origin }) =>
    $origin
      ? `
  &:last-of-type::after {
    content: '';
    position: absolute;
    height: 0.5em;
    right: 0px;
    border-top: var(--line-width-x) solid var(--line-color);
    top: calc(var(--line-width-x) * -1);
    --border-style: double;
    border-left: 12px var(--border-style) var(--line-color);
    width: calc(50% - 11px);
    border-bottom: 1px hidden transparent;
    border-radius: 77px 0px 0px / 42px 0px 0px 20px;
  }
      `
      : `
      `}

  margin-top: calc(-1 * var(--line-width-x));
  position: relative;

  ${({ $hide }) =>
    $hide
      ? `
  opacity: 0;
    `
      : `
  opacity: var(--opacity);
    `}

  ${({ $alignTop = true }) => `
    ${
      $alignTop
        ? `
  border-top: var(--line-width-x) var(--line-style) var(--line-color);
  padding-top: calc(var(--nesting-offset) + var(--line-width-x));
  `
        : `
  border-bottom: var(--line-width-x) var(--line-style) var(--line-color);
  padding-bottom: calc(var(--nesting-offset) + var(--line-width-x));
`
    }`}

  &:first-of-type {
  }
  &:last-of-type {
    --opacity: 1;
    --line-style: solid;

    top: 0;

    ::before {
      content: '';
      position: absolute;
      top: calc(var(--line-width-x) * -1);
      left: 0;
      width: calc(50% + (var(--line-width-x) + var(--offset-x, 0px)));
      height: 60%;

      box-sizing: border-box;
      border-top: var(--line-width-x) var(--line-style) var(--line-color);
      border-right: var(--line-width-y) var(--line-style) var(--line-color);
      border-radius: 0 11px 0 0 / 0 10px 0 0;
      margin-top: 0;
    }
  }

  &:first-of-type:last-of-type {
    top: 0;
  }

  ${({ $origin, $endpoint }) => `
    ${
      ($origin || $endpoint) &&
      `
      border-top-color: transparent;
    `
    }
    ${
      $origin &&
      `
      &::before {
        display: none;
      }
    `
    }
  `}
`;

export const LineSpacer = styled(
  ({
    $nestingLevel,
    $origin = false,
    $endpoint = false,
    $branch = false,

    className,
  }: {
    $nestingLevel: number;
    $origin?: boolean;
    $endpoint?: boolean;
    $branch?: boolean;
    className?: string;
  }) => {
    return (
      <Container className={className}>
        {[...Array($nestingLevel + 1)].map((_, i) => (
          <Spacer
            $origin={$origin}
            $hide={false}
            $endpoint={$endpoint}
            $branch={$branch}
            key={i}
          />
        ))}
      </Container>
    );
  },
)``;
