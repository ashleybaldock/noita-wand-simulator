import styled from 'styled-components/macro';

export const BaseAnnotation = styled.div`
  position: absolute;
  top: unset;
  bottom: unset;
  left: unset;
  left: calc(-1 * var(--sizes-spell-base) / 4 + 12px);
  right: calc(var(--sizes-spell-base) / 4 + 12px);
  right: unset;
  width: calc(var(--sizes-spell-base) / 4);
  height: calc(var(--sizes-spell-base) / 4);
  line-height: calc(var(--sizes-spell-base) / 3 - 2px);
  text-align: center;
`;
