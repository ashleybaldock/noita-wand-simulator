import styled from 'styled-components';

export const DynamicBackground = styled.div`
  background-image: var(--bg-image);
  background-repeat: var(--bg-repeat);
  background-size: var(--bg-size);
  background-position: var(--bg-position);
  cursor: var(--cursor);

  &:hover {
    background-image: var(--bg-image-hover, --bg-image);
    background-repeat: var(--bg-repeat-hover, --bg-repeat);
    background-size: var(--bg-size-hover, --bg-size);
    background-position: var(--bg-position-hover, --bg-position);
    cursor: var(--cursor-hover, --cursor);
  }
`;
