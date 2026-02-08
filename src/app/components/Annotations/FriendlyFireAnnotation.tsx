import styled from 'styled-components';
import { BaseAnnotation } from './BaseAnnotation';

const SourceInnate = styled(BaseAnnotation)`
  pointer-events: none;
  position: absolute;
  top: 10%;
  transform: translateY(-50%);
  left: calc(-1 * var(--bsize-spell) / 4 + 32px);
  width: calc(var(--bsize-spell) / 4);
  height: calc(var(--bsize-spell) / 4);
  border: none;
  background-color: transparent;
  background-image: url('/data/warnings/icon_danger.png');
  font-size: 12px;
  line-height: calc(var(--bsize-spell) / 3 - 2px);
  text-align: center;
  font-family: var(--font-family-noita-default);
  opacity: 0;
`;

const SourceModification = styled(BaseAnnotation)`
  pointer-events: none;
  position: absolute;
  top: 10%;
  transform: translateY(-50%);
  left: calc(-1 * var(--bsize-spell) / 4 + 32px);
  width: calc(var(--bsize-spell) / 4);
  height: calc(var(--bsize-spell) / 4);
  border: none;
  background-color: transparent;
  background-image: url('/data/warnings/icon_danger.png');
  font-size: 12px;
  line-height: calc(var(--bsize-spell) / 3 - 2px);
  text-align: center;
  font-family: var(--font-family-noita-default);
  opacity: 0;
`;

export type FriendlyFireSource = 'no' | 'innate' | 'modification';

export function FriendlyFireAnnotation({
  friendlyFire = 'no',
}: {
  friendlyFire?: FriendlyFireSource;
}) {
  if (friendlyFire === 'innate') {
    return <SourceInnate data-name="FriendlyFireInnate"></SourceInnate>;
  }
  if (friendlyFire === 'modification') {
    return (
      <SourceModification data-name="FriendlyFireModification"></SourceModification>
    );
  }
  return null;
}
