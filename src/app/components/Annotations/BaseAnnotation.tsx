import styled from 'styled-components/macro';

export const BaseAnnotation = styled.div`
  position: absolute;
  top: unset;
  bottom: unset;
  left: unset;
  left: calc(-1 * var(--bsize-spell) / 4 + 12px);
  right: calc(var(--bsize-spell) / 4 + 12px);
  right: unset;
  width: calc(var(--bsize-spell) / 4);
  height: calc(var(--bsize-spell) / 4);
  line-height: calc(var(--bsize-spell) / 3 - 2px);
  text-align: center;
`;
